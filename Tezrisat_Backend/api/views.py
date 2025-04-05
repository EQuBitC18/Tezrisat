import json
import os
import logging

from django.contrib.auth.models import User
from django.core.files.storage import FileSystemStorage
from django.http import JsonResponse
#from dotenv import load_dotenv
from langchain import hub
from langchain.agents import AgentExecutor, create_react_agent
from langchain.chains import (
    create_history_aware_retriever,
    create_retrieval_chain,
)
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains.history_aware_retriever import create_history_aware_retriever
from langchain.chains.llm import LLMChain
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.memory import ConversationBufferWindowMemory
from langchain_chroma import Chroma
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import Tool
from langchain_openai import ChatOpenAI, OpenAI
from langchain_openai import OpenAIEmbeddings
from rest_framework import generics
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from serpapi import GoogleSearch

from .generate_microcourse import generate_microcourse_section
from .models import Microcourse, MicrocourseSection, GlossaryTerm, QuizQuestion, RecallNote
from .serializers import UserSerializer, MicrocourseSerializer, MicrocourseSectionSerializer

logger = logging.getLogger(__name__)


#load_dotenv()
#os.environ["LANGCHAIN_TRACING_V2"] = os.getenv("LANGCHAIN_TRACING_V2")
#os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
#os.environ["WOLFRAM_ALPHA_APPID"] = os.getenv("WOLFRAM_ALPHA_APPID")
#os.environ["SERPAPI_API_KEY"] = os.getenv("SERPAPI_API_KEY")
#os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    data = {
        "first_name": user.first_name,
        "last_name": user.last_name,
        "username": user.username,
        "email": user.email,
    }
    return JsonResponse(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    data = request.data.get("body")

    user.first_name = data.get("firstname")
    user.last_name = data.get("lastname")
    user.username = data.get("username")
    user.email = data.get("email")

    # If a new password is provided, update it
    if data.get('password'):
        user.set_password(data['password'])

    user.save()
    return JsonResponse({"detail": "Profile updated successfully"}, status=200)

@api_view(['GET'])
def get_microcourses(request):
    logging.info("Retrieving all microcourses")
    if request.method == 'GET':
        try:
            microcourses = Microcourse.objects.all()
            microcourses_serializer = MicrocourseSerializer(microcourses, many=True)
            logging.info("Successfully retrieved microcourses")
            return JsonResponse(microcourses_serializer.data, safe=False)
        except Exception as e:
            logging.error("Error retrieving microcourses: %s", e)
            return JsonResponse({"error": "Failed to retrieve microcourses"}, status=500)

@api_view(['GET'])
def get_microcourse(request, pk):
    try:
        microcourse = Microcourse.objects.get(id=pk, user=request.user)
        logging.info("Microcourse retrieved successfully")

        sections = microcourse.sections.all().order_by("id")
        sections_data = []
        for section in sections:
            glossary_terms = list(section.glossary_terms.all().values("id", "term", "definition"))
            quiz_questions = list(section.quiz_questions.all().values("id", "question", "options", "correct_answer"))
            recall_notes = list(section.recall_notes.all().values("id", "content", "timestamp"))
            sections_data.append({
                "id": section.id,
                "section_title": section.section_title,
                "content": section.content,
                "glossary_terms": glossary_terms,
                "quiz_questions": quiz_questions,
                "recall_notes": recall_notes,
                "code_examples": section.code_examples,
                "math_expressions": section.math_expressions,
            })

        data = {
            "id": microcourse.id,
            "title": microcourse.title,
            "topic": microcourse.topic,
            "complexity": microcourse.complexity,
            "target_audience": microcourse.target_audience,
            "url": microcourse.url,
            "pdf": microcourse.pdf.url if microcourse.pdf else None,
            "sections": sections_data,
        }
        return JsonResponse(data, safe=False)
    except Exception as e:
        logging.error("Error retrieving microcourse: %s", e)
        return JsonResponse({"error": "Failed to retrieve microcourse"}, status=500)



@api_view(['POST'])
def go_in_depth(request):
    if request.method == 'POST':
        microcourse_id = request.data.get('microcourseId')
        try:
            microcourse = Microcourse.objects.get(id=microcourse_id, user=request.user)
        except Microcourse.DoesNotExist:
            return JsonResponse({"error": "Microcourse not found"}, status=404)

        previous_section = request.data.get('previousSection')
        topic = microcourse.topic

        try:
            microcourse_section_data = generate_microcourse_section(
                topic,
                is_next_section=True,
                previous_section=previous_section
            )
        except Exception as e:
            logging.error("Error generating microcourse section: %s", e)
            return JsonResponse({"error": "Failed to generate microcourse section."}, status=500)

        try:
            new_section = MicrocourseSection.objects.create(
                microcourse=microcourse,
                section_title=microcourse_section_data.get("section_title"),
                content=microcourse_section_data.get("content"),
                code_examples=microcourse_section_data.get("code_examples"),
                math_expressions=microcourse_section_data.get("math_expressions"),
            )
            # Create nested glossary terms, quiz, and recall notes if present
            glossary_json = microcourse_section_data.get("vocabulary")
            if glossary_json:
                glossary = json.loads(glossary_json)
                for term, definition in glossary.items():
                    GlossaryTerm.objects.create(section=new_section, term=term, definition=definition)

            quiz_json = microcourse_section_data.get("quiz")
            if quiz_json:
                quiz = json.loads(quiz_json)
                QuizQuestion.objects.create(
                    section=new_section,
                    question=quiz.get("question"),
                    options=quiz.get("options"),
                    correct_answer=quiz.get("correct_answer")
                )

            recall_json = microcourse_section_data.get("recall_notes")
            if recall_json:
                recall_notes = json.loads(recall_json)
                for note_content in recall_notes:
                    RecallNote.objects.create(section=new_section, content=note_content)
        except Exception as e:
            logging.error("Error creating new MicrocourseSection and related items: %s", e)
            return JsonResponse({"error": "Failed to create new microcourse section."}, status=500)

        serializer = MicrocourseSectionSerializer(new_section)
        return JsonResponse(serializer.data)



@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_microcourse(request):
    import json
    from django.core.files.storage import FileSystemStorage
    logger.info("Received request to add microcourse")
    if request.method == 'POST':
        title = request.data.get('title')
        topic = request.data.get('topic')
        complexity = request.data.get('complexity')
        target_audience = request.data.get('target_audience')
        # Get all website URLs as a list and store as JSON
        urls = request.data.getlist('url')
        urls_json = json.dumps(urls) if urls else None

        # Process multiple PDF files
        pdf_files = request.FILES.getlist('pdf')
        saved_pdf_filenames = []
        if pdf_files:
            fs = FileSystemStorage(location='media/pdfs')
            for pdf in pdf_files:
                try:
                    filename = fs.save(pdf.name, pdf)
                    saved_pdf_filenames.append(filename)
                    logger.info("PDF file saved successfully: %s", filename)
                except Exception as e:
                    logger.error("Error saving PDF file: %s", e)
        else:
            logger.info("No PDF file provided")

        try:
            # Update the call to generate_microcourse_section to accept multiple PDF paths and URLs.
            microcourse_section_data = generate_microcourse_section(
                topic,
                pdf_paths=saved_pdf_filenames,  # pass list of saved PDF filenames
                website_urls=urls_json,           # pass JSON string of URLs
                is_next_section=False
            )
            logger.info("Generated section: %s", json.dumps(microcourse_section_data, indent=2))
        except Exception as e:
            logger.error("Error generating microcourse section: %s", e)
            return JsonResponse({"error": "Failed to generate microcourse section."}, status=500)

        try:
            # Store the PDF filenames as JSON (assuming your Microcourse model can handle it)
            pdf_files_field = json.dumps(saved_pdf_filenames) if saved_pdf_filenames else None
            microcourse = Microcourse.objects.create(
                title=title,
                topic=topic,
                complexity=complexity,
                target_audience=target_audience,
                url=urls_json,            # store URLs as JSON
                pdf=pdf_files_field,      # store multiple PDF filenames
                user=request.user
            )
        except Exception as e:
            logger.error("Error creating Microcourse: %s", e)
            return JsonResponse({"error": "Failed to create microcourse."}, status=500)

        try:
            # Create the first section
            section = MicrocourseSection.objects.create(
                microcourse=microcourse,
                section_title=microcourse_section_data.get("section_title"),
                content=microcourse_section_data.get("content"),
                code_examples=microcourse_section_data.get("code_examples"),
                math_expressions=microcourse_section_data.get("math_expressions"),
            )
            # Process glossary data
            glossary_json = microcourse_section_data.get("vocabulary")
            if glossary_json:
                glossary = json.loads(glossary_json)
                for term, definition in glossary.items():
                    GlossaryTerm.objects.create(section=section, term=term, definition=definition)

            # Process quiz data
            quiz_json = microcourse_section_data.get("quiz")
            if quiz_json:
                quiz = json.loads(quiz_json)
                QuizQuestion.objects.create(
                    section=section,
                    question=quiz.get("question"),
                    options=quiz.get("options"),
                    correct_answer=quiz.get("correct_answer")
                )

            # Process recall notes
            recall_json = microcourse_section_data.get("recall_notes")
            if recall_json:
                recall_notes = json.loads(recall_json)
                for note_content in recall_notes:
                    RecallNote.objects.create(section=section, content=note_content)
        except Exception as e:
            logger.error("Error creating MicrocourseSection and related items: %s", e)
            return JsonResponse({"error": "Failed to create microcourse section and related items."}, status=500)

        serializer = MicrocourseSerializer(microcourse)
        if serializer.is_valid:
            logger.info("Microcourse added successfully")
            return JsonResponse(serializer.data)
        else:
            logger.error("Error serializing microcourse: %s", serializer.errors)
            return JsonResponse(serializer.errors, status=400)




@api_view(['POST'])
def get_agent_response(request):
    prompt_template = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                (
                    "You are an expert instructor in {topic} aimed at {target_audience}. "
                    "The microcourse covers the following topics: {contents}. "
                    "Use this information to answer any questions as clearly and helpfully as possible."
                ),
            ),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    # --- Initialize the LLM and Chain ---
    # In a production app, consider initializing these at startup so they aren’t recreated per request.
    llm = ChatOpenAI(temperature=0.7)
    chain = LLMChain(llm=llm, prompt=prompt_template)

    data = json.loads(request.body)
    question = data.get("question")
    data_id = data.get("id")
    microcourse = Microcourse.objects.get(id=data_id, user=request.user)

    contents = "\n\n".join(microcourse.sections.all().values_list("content", flat=True))
    recall_notes = []
    glossary = []
    quiz = []
    code_examples = []
    math_expressions = []

    for section in microcourse.sections.all():
        recall_notes.extend(list(section.recall_notes.all().values_list("content", flat=True)))
        glossary.extend([f"{gt.term}: {gt.definition}" for gt in section.glossary_terms.all()])
        quiz.extend(list(section.quiz_questions.all().values_list("question", flat=True)))
        code_examples.append(section.code_examples)
        math_expressions.append(section.math_expressions)

    def answer_question(question, conversation_history=None):
        if conversation_history is None:
            conversation_history = []
        conversation_history.append({"role": "user", "content": question})
        inputs = {
            "messages": conversation_history,
            "title": microcourse.title,
            "topic": microcourse.topic,
            "target_audience": microcourse.target_audience,
            "contents": contents,
            "recall_notes": "\n".join(recall_notes),
            "vocabulary": "\n".join(glossary),
            "quiz": "\n".join(quiz),
            "code_examples": "\n".join(code_examples),
            "math_expressions": "\n".join(math_expressions),
        }
        answer = chain.run(**inputs)
        conversation_history.append({"role": "assistant", "content": answer})
        return answer, conversation_history

    answer, _ = answer_question(question)

    # Return the answer in JSON format.
    return JsonResponse({"answer": answer})


import json

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_glossary_term(request):
    print("GEHT 1")
    raw_body = request.body  # This is bytes
    try:
        data = json.loads(raw_body.decode("utf-8"))  # Convert bytes → string → JSON
    except json.JSONDecodeError as e:
        return JsonResponse({"detail": "Invalid JSON."}, status=400)

    # If your frontend sends {"termData": {"term": "asd", "definition": "asd", "microcourse_id": 123}}
    term_data = data.get("termData", {})
    new_term = term_data.get("term")
    new_definition = term_data.get("definition")
    microcourse_id = term_data.get("microcourse_id")

    if not new_term or not new_definition or not microcourse_id:
        return JsonResponse({"detail": "Term, definition, and microcourse_id are required."}, status=400)

    sections = MicrocourseSection.objects.filter(microcourse_id=microcourse_id)
    if not sections.exists():
        return JsonResponse({"detail": "No section found for the current microcourse."}, status=404)

    section = sections.latest('id')

    glossary_term = GlossaryTerm.objects.create(
        section=section,
        term=new_term,
        definition=new_definition
    )

    return JsonResponse({
        "detail": "Glossary term added successfully.",
        "glossary_term": {
            "id": glossary_term.id,
            "term": glossary_term.term,
            "definition": glossary_term.definition,
        }
    }, status=200)



@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_glossary_term(request, term_id):
    print("GEHT 2!")
    try:
        glossary_term = GlossaryTerm.objects.get(pk=term_id)
    except GlossaryTerm.DoesNotExist:
        return JsonResponse({"detail": "Glossary term not found."}, status=404)

    glossary_term.delete()
    return JsonResponse({"detail": "Glossary term deleted successfully."}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_note(request):
    try:
        data = request.data.get("noteData")
        print("Data received:", data)
    except Exception as e:
        return JsonResponse({"detail": "Invalid data."}, status=400)

    content = data.get("content") if data else None
    section_id = data.get("section_id") if data else None

    if not content or not section_id:
        return JsonResponse({"detail": "Content and section_id are required."}, status=400)

    try:
        section = MicrocourseSection.objects.get(pk=section_id)
    except MicrocourseSection.DoesNotExist:
        return JsonResponse({"detail": "Section not found."}, status=404)

    new_note = RecallNote.objects.create(section=section, content=content)

    return JsonResponse({
        "id": new_note.id,
        "content": new_note.content,
        "timestamp": new_note.timestamp.isoformat()
    }, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_note(request, note_id):
    try:
        note = RecallNote.objects.get(pk=note_id)
    except RecallNote.DoesNotExist:
        return JsonResponse({"detail": "Recall note not found."}, status=404)

    note.delete()
    return JsonResponse({"detail": "Recall note deleted successfully."}, status=200)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_microcourse(request, microcourse_id):
    try:
        # Ensure the microcourse belongs to the requesting user
        microcourse = Microcourse.objects.get(pk=microcourse_id, user=request.user)
    except Microcourse.DoesNotExist:
        return JsonResponse({"detail": "Microcourse not found."}, status=404)

    microcourse.delete()
    return JsonResponse({"detail": "Microcourse deleted successfully."}, status=200)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

