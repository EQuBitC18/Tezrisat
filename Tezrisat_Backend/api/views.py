import json
import logging
import os
from typing import Optional
from django.core.files.storage import FileSystemStorage
from django.conf import settings
from django.http import JsonResponse

from rest_framework.decorators import (
    api_view,
    parser_classes,
)
from rest_framework.parsers import MultiPartParser, FormParser
from langchain.chains.llm import LLMChain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
# from serpapi import GoogleSearch
from langchain_openai import ChatOpenAI

# Local project imports
from .generate_microcourse import generate_microcourse_section
from .models import (
    Microcourse,
    MicrocourseSection,
    GlossaryTerm,
    QuizQuestion,
    RecallNote,
)
from .serializers import (
    MicrocourseSerializer,
    MicrocourseSectionSerializer,
)

logger = logging.getLogger(__name__)


def _get_request_key(request, header_name: str, data_key: str) -> Optional[str]:
    header_value = request.headers.get(header_name)
    if header_value:
        return header_value
    try:
        return request.data.get(data_key)
    except Exception:
        return None


def _get_env_or_request_key(request, env_key: str, header_name: str, data_key: str) -> Optional[str]:
    env_value = os.getenv(env_key)
    return env_value or _get_request_key(request, header_name, data_key)


@api_view(["GET"])
def get_keys_status(request):
    def is_set(value: Optional[str]) -> bool:
        return bool(value and value.strip())

    configured = {
        "openai": is_set(os.getenv("OPENAI_API_KEY")),
        "serpapi": is_set(os.getenv("SERPAPI_API_KEY")),
        "wolfram": is_set(os.getenv("WOLFRAM_ALPHA_APPID")),
    }
    return JsonResponse({
        "configured": configured,
        "required": ["openai", "serpapi"],
        "optional": ["wolfram"],
    })


@api_view(['GET'])
def get_microcourses(request):
    """
    Retrieve all microcourses.
    """
    logger.info("Retrieving all microcourses")
    try:
        microcourses = Microcourse.objects.all()
        serializer = MicrocourseSerializer(microcourses, many=True)
        logger.info("Successfully retrieved microcourses")
        return JsonResponse(serializer.data, safe=False)
    except Exception as e:
        logger.error("Error retrieving microcourses: %s", e)
        return JsonResponse({"error": "Failed to retrieve microcourses"}, status=500)


@api_view(['GET'])
def get_microcourse(request, pk):
    """
    Retrieve detailed information for a specific microcourse.
    """
    try:
        microcourse = Microcourse.objects.get(id=pk)
        logger.info("Microcourse retrieved successfully")
        sections_data = []
        for section in microcourse.sections.all().order_by("id"):
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
    except Microcourse.DoesNotExist:
        return JsonResponse({"error": "Microcourse not found"}, status=404)
    except Exception as e:
        logger.error("Error retrieving microcourse: %s", e)
        return JsonResponse({"error": "Failed to retrieve microcourse"}, status=500)


@api_view(['POST'])
def go_in_depth(request):
    """
    Generate and add a new microcourse section using the provided previous section content.
    """
    try:
        microcourse = Microcourse.objects.get(id=request.data.get("microcourseId"))
    except Microcourse.DoesNotExist:
        return JsonResponse({"error": "Microcourse not found"}, status=404)

    previous_section = request.data.get("previousSection")
    topic = microcourse.topic

    estimated_tokens_needed = 2000

    openai_key = _get_env_or_request_key(
        request,
        "OPENAI_API_KEY",
        "X-OpenAI-Key",
        "openai_key",
    )
    if not openai_key:
        return JsonResponse({"error": "OpenAI API key is required."}, status=400)
    serpapi_key = _get_env_or_request_key(
        request,
        "SERPAPI_API_KEY",
        "X-SerpAPI-Key",
        "serpapi_key",
    )
    wolfram_key = _get_env_or_request_key(
        request,
        "WOLFRAM_ALPHA_APPID",
        "X-Wolfram-Key",
        "wolfram_key",
    )

    try:
        microcourse_section_data = generate_microcourse_section(
            topic,
            is_next_section=True,
            previous_section=previous_section,
            openai_api_key=openai_key,
            serpapi_api_key=serpapi_key or "",
            wolfram_alpha_appid=wolfram_key or "",
        )
    except Exception as e:
        logger.error("Error generating microcourse section: %s", e)
        return JsonResponse({"error": "Failed to generate microcourse section."}, status=500)

    try:
        new_section = MicrocourseSection.objects.create(
            microcourse=microcourse,
            section_title=microcourse_section_data.get("section_title"),
            content=microcourse_section_data.get("content"),
            code_examples=microcourse_section_data.get("code_examples"),
            math_expressions=microcourse_section_data.get("math_expressions"),
        )
        # Process vocabulary/glossary.
        glossary_json = microcourse_section_data.get("vocabulary")
        if glossary_json:
            glossary = json.loads(glossary_json)
            for term, definition in glossary.items():
                GlossaryTerm.objects.create(section=new_section, term=term, definition=definition)
        # Process quiz.
        quiz_json = microcourse_section_data.get("quiz")
        if quiz_json:
            quiz = json.loads(quiz_json)
            QuizQuestion.objects.create(
                section=new_section,
                question=quiz.get("question"),
                options=quiz.get("options"),
                correct_answer=quiz.get("correct_answer"),
            )
        # Process recall notes.
        recall_json = microcourse_section_data.get("recall_notes")
        if recall_json:
            recall_notes = json.loads(recall_json)
            for note_content in recall_notes:
                RecallNote.objects.create(section=new_section, content=note_content)
    except Exception as e:
        logger.error("Error creating new MicrocourseSection and related items: %s", e)
        return JsonResponse({"error": "Failed to create new microcourse section."}, status=500)

    token_usage_from_response = microcourse_section_data.get("token_usage", estimated_tokens_needed)
    serializer = MicrocourseSectionSerializer(new_section)
    return JsonResponse(serializer.data)


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def add_microcourse(request):
    """
    Create a new microcourse using the provided data (including URLs and PDF files).
    Uses the backend's OpenAI API key configured in environment variables.
    """
    logger.info("Received request to add microcourse")
    user = None
    
    openai_api_key = _get_env_or_request_key(
        request,
        "OPENAI_API_KEY",
        "X-OpenAI-Key",
        "openai_key",
    )
    if not openai_api_key:
        return JsonResponse({"error": "OpenAI API key is required."}, status=400)
    serpapi_key = _get_env_or_request_key(
        request,
        "SERPAPI_API_KEY",
        "X-SerpAPI-Key",
        "serpapi_key",
    )
    wolfram_key = _get_env_or_request_key(
        request,
        "WOLFRAM_ALPHA_APPID",
        "X-Wolfram-Key",
        "wolfram_key",
    )
    
    title = request.data.get("title")
    topic = request.data.get("topic")
    complexity = request.data.get("complexity")
    target_audience = request.data.get("target_audience")
    urls = request.data.getlist("url")
    urls_json = json.dumps(urls) if urls else None
    pdf_files = request.FILES.getlist("pdf")
    saved_pdf_filenames = []
    if pdf_files:
        fs = FileSystemStorage(location=os.path.join(settings.MEDIA_ROOT, "pdfs"))
        for pdf in pdf_files:
            try:
                filename = fs.save(pdf.name, pdf)
                saved_pdf_filenames.append(filename)  # Just store filename, not full path
                logger.info("PDF file saved successfully: %s", filename)
            except Exception as e:
                logger.error("Error saving PDF file: %s", e)
    else:
        logger.info("No PDF file provided")

    try:
        microcourse_section_data = generate_microcourse_section(
            topic,
            pdf_path=saved_pdf_filenames,
            website_url=urls_json,
            is_next_section=False,
            openai_api_key=openai_api_key,
            serpapi_api_key=serpapi_key or "",
            wolfram_alpha_appid=wolfram_key or "",
        )
        logger.info("Generated section: %s", json.dumps(microcourse_section_data, indent=2))
    except Exception as e:
        logger.error("Error generating microcourse section: %s", e)
        return JsonResponse({"error": "Failed to generate microcourse section."}, status=500)

    try:
        pdf_field = saved_pdf_filenames[0] if saved_pdf_filenames else None
        microcourse = Microcourse.objects.create(
            title=title,
            topic=topic,
            complexity=complexity,
            target_audience=target_audience,
            url=urls_json,
            pdf=pdf_field,
            user=user,
        )
    except Exception as e:
        logger.error("Error creating Microcourse: %s", e)
        return JsonResponse({"error": "Failed to create microcourse."}, status=500)

    try:
        section = MicrocourseSection.objects.create(
            microcourse=microcourse,
            section_title=microcourse_section_data.get("section_title"),
            content=microcourse_section_data.get("content"),
            code_examples=microcourse_section_data.get("code_examples"),
            math_expressions=microcourse_section_data.get("math_expressions"),
        )
        glossary_json = microcourse_section_data.get("vocabulary")
        if glossary_json:
            glossary = json.loads(glossary_json)
            for term, definition in glossary.items():
                GlossaryTerm.objects.create(section=section, term=term, definition=definition)
        quiz_json = microcourse_section_data.get("quiz")
        if quiz_json:
            quiz = json.loads(quiz_json)
            QuizQuestion.objects.create(
                section=section,
                question=quiz.get("question"),
                options=quiz.get("options"),
                correct_answer=quiz.get("correct_answer"),
            )
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
    """
    Process a question using the AI agent and return its answer.
    """
    prompt_template = ChatPromptTemplate.from_messages([
        (
            "system",
            (
                "You are an expert instructor in {topic} aimed at {target_audience}. "
                "The microcourse covers the following topics: {contents}. "
                "Use this information to answer any questions as clearly and helpfully as possible."
            ),
        ),
        MessagesPlaceholder(variable_name="messages"),
    ])

    try:
        payload = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON payload."}, status=400)

    openai_key = payload.get("openai_key")
    if not openai_key:
        openai_key = _get_env_or_request_key(
            request,
            "OPENAI_API_KEY",
            "X-OpenAI-Key",
            "openai_key",
        )
    if not openai_key:
        return JsonResponse({"error": "OpenAI API key is required."}, status=400)

    llm = ChatOpenAI(temperature=0.7, openai_api_key=openai_key)
    chain = LLMChain(llm=llm, prompt=prompt_template)

    question = payload.get("question")
    data_id = payload.get("id")
    try:
        microcourse = Microcourse.objects.get(id=data_id)
    except Microcourse.DoesNotExist:
        return JsonResponse({"error": "Microcourse not found"}, status=404)

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
    return JsonResponse({"answer": answer})


@api_view(['POST'])
def add_glossary_term(request):
    """
    Add a new glossary term to the latest section of the microcourse.
    Expects JSON data in the format:
    {"termData": {"term": "Some Term", "definition": "A definition", "microcourse_id": 123}}
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
    except json.JSONDecodeError:
        return JsonResponse({"detail": "Invalid JSON."}, status=400)

    term_data = data.get("termData", {})
    new_term = term_data.get("term")
    new_definition = term_data.get("definition")
    microcourse_id = term_data.get("microcourse_id")
    if not new_term or not new_definition or not microcourse_id:
        return JsonResponse({"detail": "Term, definition, and microcourse_id are required."}, status=400)

    sections = MicrocourseSection.objects.filter(microcourse_id=microcourse_id)
    if not sections.exists():
        return JsonResponse({"detail": "No section found for the current microcourse."}, status=404)

    section = sections.latest("id")
    glossary_term = GlossaryTerm.objects.create(
        section=section,
        term=new_term,
        definition=new_definition,
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
def delete_glossary_term(request, term_id):
    """
    Delete a glossary term by its ID.
    """
    try:
        glossary_term = GlossaryTerm.objects.get(pk=term_id)
    except GlossaryTerm.DoesNotExist:
        return JsonResponse({"detail": "Glossary term not found."}, status=404)
    glossary_term.delete()
    return JsonResponse({"detail": "Glossary term deleted successfully."}, status=200)


@api_view(['POST'])
def add_note(request):
    """
    Add a new recall note to a specific section.
    Expects data in the format: {"noteData": {"content": "Note text", "section_id": <id>}}
    """
    data = request.data.get("noteData")
    if not data:
        return JsonResponse({"detail": "Invalid data."}, status=400)
    content = data.get("content")
    section_id = data.get("section_id")
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
def delete_note(request, note_id):
    """
    Delete a recall note identified by its ID.
    """
    try:
        note = RecallNote.objects.get(pk=note_id)
    except RecallNote.DoesNotExist:
        return JsonResponse({"detail": "Recall note not found."}, status=404)
    note.delete()
    return JsonResponse({"detail": "Recall note deleted successfully."}, status=200)


@api_view(['DELETE'])
def delete_microcourse(request, microcourse_id):
    """
    Delete a microcourse by ID.
    """
    try:
        microcourse = Microcourse.objects.get(pk=microcourse_id)
    except Microcourse.DoesNotExist:
        return JsonResponse({"detail": "Microcourse not found."}, status=404)
    microcourse.delete()
    return JsonResponse({"detail": "Microcourse deleted successfully."}, status=200)
