import os
import json
import logging
import time
from uuid import uuid4
from tqdm import tqdm
from typing import Optional, Dict, Any, List, Union

from langchain.cache import InMemoryCache
from langchain.llms import OpenAI
from langchain.document_loaders import PyPDFLoader
from langchain.docstore.document import Document
import trafilatura
from langchain.text_splitter import CharacterTextSplitter, RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from dotenv import load_dotenv
try:
    from langchain.cache.base import BaseCache
except ModuleNotFoundError:
    # Define a dummy BaseCache so that Pydantic can resolve the annotation.
    class BaseCache:
        pass

# ------------------------------
# Configuration & Logging
# ------------------------------
load_dotenv()
os.environ["LANGCHAIN_TRACING_V2"] = os.getenv("LANGCHAIN_TRACING_V2")
os.environ["LANGCHAIN_API_KEY"] = os.getenv("LANGCHAIN_API_KEY")
os.environ["WOLFRAM_ALPHA_APPID"] = os.getenv("WOLFRAM_ALPHA_APPID")
os.environ["SERPAPI_API_KEY"] = os.getenv("SERPAPI_API_KEY")
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

OpenAI.cache = InMemoryCache()
OpenAI.model_rebuild()

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


# ------------------------------
# Fine-Tuning Context Extraction
# ------------------------------
from typing import Optional, Union, List
from langchain.document_loaders import PyPDFLoader
from langchain.docstore.document import Document
import os
import trafilatura


def load_finetuning_docs(
        pdf_path: Optional[Union[str, List[str]]],
        website_url: str
) -> List[Document]:
    """Loads documents from PDFs and a website.

    Parameters:
      pdf_path: A single path as a string or a list of PDF file paths.
      website_url: A URL to fetch and extract text from.

    Returns:
      A list of Document objects.
    """
    docs = []
    if pdf_path:
        if isinstance(pdf_path, list):
            for path in pdf_path:
                if os.path.isfile(path):
                    loader = PyPDFLoader(path)
                    pdf_docs = loader.load()
                    docs.extend(pdf_docs)
                else:
                    # Log or handle the error if the file does not exist.
                    print(f"File not found: {path}")
        else:
            if os.path.isfile(pdf_path):
                loader = PyPDFLoader(pdf_path)
                pdf_docs = loader.load()
                docs.extend(pdf_docs)
            else:
                print(f"File not found: {pdf_path}")

    if website_url:
        downloaded = trafilatura.fetch_url(website_url)
        if downloaded:
            extracted_text = trafilatura.extract(downloaded)
            if extracted_text:
                docs.append(Document(page_content=extracted_text, metadata={"source": website_url}))
    return docs


def call_llm(prompt: str) -> str:
    llm = OpenAI(temperature=0.7, max_tokens=1024)
    return llm(prompt)


def document_relevancy_check(topic: str, text: str, max_length: int = 1000) -> Dict[str, Any]:
    # Truncate the text to avoid huge prompts
    truncated_text = text if len(text) <= max_length else text[:max_length] + "..."
    prompt = f"""Is the following text relevant to "{topic}"?
    Text: '''{truncated_text}'''
    Answer as JSON: {{"relevant": "yes" or "no", "score": number between 0 and 1, "reason": "brief explanation"}}
    """
    output = call_llm(prompt)
    try:
        return json.loads(output)
    except Exception as e:
        logging.error("Document relevancy check parsing error: " + str(e))
        return {"relevant": "no", "score": 0, "reason": "Parsing error"}


def filter_relevant_docs(topic: str, docs: List[Document], threshold: float = 0.5, max_length: int = 1000) -> List[Document]:
    relevant_docs = []
    for doc in docs:
        logging.info("Processing doc for relevancy check.")
        result = document_relevancy_check(topic, doc.page_content, max_length)
        logging.info("Result from relevancy check: " + str(result))
        if result.get("relevant", "no").lower() == "yes" and float(result.get("score", 0)) >= threshold:
            relevant_docs.append(doc)
        else:
            logging.info(f"Filtered out doc: Score={result.get('score', 0)} Reason: {result.get('reason', '')}")
    return relevant_docs


def get_finetuning_context(topic: str, pdf_path: Optional[Union[str, List[str]]], website_url: str) -> str:
    docs = load_finetuning_docs(pdf_path, website_url)
    if not docs:
        return ""
    splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    docs_chunks = splitter.split_documents(docs)
    embeddings = OpenAIEmbeddings()
    vectorstore = Chroma.from_documents(docs_chunks, collection_name="microcourse", embedding=embeddings, persist_directory=".")
    try:
        retrieved_docs = vectorstore.similarity_search(topic, k=5)
    except AttributeError:
        retrieved_docs = vectorstore.get_relevant_documents(topic)
    filtered_docs = filter_relevant_docs(topic, retrieved_docs, threshold=0.5)
    if not filtered_docs:
        return ""
    context = "\n\n".join([doc.page_content for doc in filtered_docs])
    return context


# ------------------------------
# Generation Retry Mechanism
# ------------------------------
def _generate_main_section(prompt: str):
    output = call_llm(prompt)
    try:
        data = json.loads(output)
        return data, None
    except Exception as e:
        return None, f"Error parsing main section JSON. Raw output:\n{output}\nException: {e}"


def _generate_code_examples(prompt: str):
    output = call_llm(prompt)
    try:
        data = json.loads(output)
        if not isinstance(data, list):
            raise ValueError("Output is not a JSON array")
        return data, None
    except Exception as e:
        # Try to extract JSON array substring from output
        start = output.find('[')
        end = output.rfind(']')
        if start != -1 and end != -1 and end > start:
            substring = output[start:end + 1]
            try:
                data = json.loads(substring)
                if not isinstance(data, list):
                    raise ValueError("Extracted output is not a JSON array")
                return data, None
            except Exception as e2:
                return None, f"Error parsing code examples JSON after extraction. Substring:\n{substring}\nOriginal output:\n{output}\nException: {e2}"
        return None, f"Error parsing code examples JSON. Raw output:\n{output}\nException: {e}"


def _generate_math_expressions(prompt: str):
    output = call_llm(prompt)
    try:
        data = json.loads(output)
        if not isinstance(data, list):
            raise ValueError("Output is not a JSON array")
        return data, None
    except Exception as e:
        # Attempt to extract a JSON array substring from the output
        start = output.find('[')
        end = output.rfind(']')
        if start != -1 and end != -1 and end > start:
            substring = output[start:end+1]
            try:
                data = json.loads(substring)
                if not isinstance(data, list):
                    raise ValueError("Extracted output is not a JSON array")
                return data, None
            except Exception as e2:
                return None, f"Error parsing math expressions JSON after extraction. Substring:\n{substring}\nOriginal output:\n{output}\nException: {e2}"
        return None, f"Error parsing math expressions JSON. Raw output:\n{output}\nException: {e}"


def retry_generate(generate_func, prompt: str, max_retries: int = 3, delay: int = 1):
    attempts = 0
    while attempts < max_retries:
        data, error = generate_func(prompt)
        if error is None:
            return data, None
        else:
            logging.error(f"Error encountered: {error} - Retrying ({attempts + 1}/{max_retries})")
            attempts += 1
            time.sleep(delay)
    return None, f"Failed after {max_retries} attempts."


# ------------------------------
# Hallucination Detection
# ------------------------------
def hallucination_detection(response: str, context: str) -> Dict[str, Any]:
    prompt = f"""
    Based on the following context: '''{context}''', and the given response: '''{response}''', determine if any parts of the response are hallucinated (i.e., not supported by the context). 
    Answer in JSON with the following format:
    {{"hallucination_detected": "yes" or "no", "details": "brief explanation if any, or empty string if none"}}
    Do not include any additional commentary.
    """
    output = call_llm(prompt)
    try:
        data = json.loads(output)
        return data
    except Exception as e:
        logging.error("Hallucination detection parsing error: " + str(e))
        return {"hallucination_detected": "no", "details": "Parsing error"}


# ------------------------------
# Microcourse Generation Functions
# ------------------------------
def generate_introduction_section(topic: str, finetune_context: str) -> Dict[str, Any]:
    extra_context = (
        f"\n\nAdditional fine-tuning context extracted from provided documents:\n{finetune_context}\n\n"
        if finetune_context else ""
    )
    prompt_main = f"""
    You are an expert educator creating a microcourse on the topic: {topic}.
    {extra_context}Please generate only one section, which is the Introduction.
    Include the following fields:
    - "section_title": a title for the section.
    - "content": the main text of the introduction.
    - "recall_notes": a list of key recall notes.
    - "vocabulary": an object mapping key terms to their definitions.
    - "quiz": an object containing:
         - "question": a quiz question related to the section content.
         - "options": an object with four answer options labeled "A", "B", "C", and "D".
         - "correct_answer": the letter representing the correct answer.
         - "generate_code": True if code examples are relevant for this section, False otherwise.
         - "generate_math": True if math expressions are relevant for this section, False otherwise.
    Do NOT include any code examples or math expressions.
    IMPORTANT: Your output MUST be valid, complete JSON with no additional commentary.
    Output ONLY the JSON object exactly in the following format:

    {{
      "section_title": "Introduction",
      "content": "Your introduction text here.",
      "recall_notes": ["recall note 1", "recall note 2", "..."],
      "vocabulary": {{
          "word1": "definition1",
          "word2": "definition2",
          "..."
      }},
      "quiz": {{
          "question": "Your quiz question here.",
          "options": {{
              "A": "Option A",
              "B": "Option B",
              "C": "Option C",
              "D": "Option D"
          }},
          "correct_answer": "A"
      }},
      "generate_code": True,
      "generate_math": True
    }}

    Ensure the JSON starts with {{ and ends with }}.
    """
    main_section, error_main = retry_generate(_generate_main_section, prompt_main)
    if error_main:
        raise Exception(error_main)
    return main_section


def generate_code_examples_section(topic: str) -> List[Dict[str, str]]:
    prompt_code = f"""
    You are an expert educator creating a microcourse on the topic: {topic}.
    Based on the section generated above, please provide code examples that illustrate key concepts.
    Output ONLY a JSON array of code examples. Each code example should be a JSON object with:
    - "description": a brief explanation.
    - "code": the code snippet.
    IMPORTANT: Represent newline characters as the escape sequence \\n.
    If no code examples are relevant, output an empty array: [].
    Do not include any additional commentary.
    """
    code_examples, error_code = retry_generate(_generate_code_examples, prompt_code)
    if error_code:
        raise Exception(error_code)
    return code_examples


def _generate_math_expressions_refined(prompt: str):
    """Refined function to parse JSON arrays for math expressions, or return an empty array if none."""
    output = call_llm(prompt)
    try:
        data = json.loads(output)
        if not isinstance(data, list):
            raise ValueError("Output is not a JSON array")
        return data, None
    except Exception as e:
        start = output.find('[')
        end = output.rfind(']')
        if start != -1 and end != -1 and end > start:
            substring = output[start:end+1]
            try:
                data = json.loads(substring)
                if not isinstance(data, list):
                    raise ValueError("Extracted output is not a JSON array")
                return data, None
            except Exception as e2:
                return None, f"Error parsing math expressions JSON after extraction.\nSubstring:\n{substring}\nException: {e2}"
        return None, f"Error parsing math expressions JSON. Output:\n{output}\nException: {e}"

def generate_math_expressions_section(topic: str, content: str) -> List[Dict[str, str]]:
    """
    Produces math expressions relevant to the topic and main content.
    If math expressions are not relevant, returns an empty array (i.e. []).
    Each expression is an object with "description" and "expression" (LaTeX).
    """
    # This prompt instructs the LLM to check if math expressions make sense.
    # If they are irrelevant, produce an empty JSON array: []
    refined_prompt = f"""
    You are an expert educator focusing on correctness. 
    Topic: "{topic}"
    Content: "{content}"
    
    Only provide math expressions if they are truly relevant to the above topic AND content. 
    If not relevant, output an empty array: []
    
    Format: A JSON array of objects, each with:
    - "description": a brief explanation
    - "expression": a short LaTeX expression
    
    No commentary or extra text, just valid JSON. Example:
    [
      {{
        "description": "Brief explanation",
        "expression": "$x^2 + y^2 = z^2$"
      }}
    ]
        """
    math_expressions, error = retry_generate(_generate_math_expressions_refined, refined_prompt)
    if error:
        raise Exception(error)
    return math_expressions


import requests

def perform_web_search(query: str) -> str:
    api_key = os.getenv("SERPAPI_API_KEY")
    params = {
        "engine": "google",
        "q": query,
        "api_key": api_key,
        "num": "5"
    }
    response = requests.get("https://serpapi.com/search", params=params)
    data = response.json()
    snippets = [result.get("snippet", "") for result in data.get("organic_results", []) if result.get("snippet")]
    return "\n".join(snippets) if snippets else ""



def generate_microcourse_section(topic: str,
                                 pdf_path: list = None,
                                 website_url: str = "",
                                 is_next_section: bool = False,
                                 previous_section: Optional[Dict[str, Any]] = None
                                 ) -> Dict[str, Any]:
    # Use locally processed finetuning context
    state = {}
    print("gelangt")
    state["finetune_context"] = get_finetuning_context(topic, pdf_path, website_url)
    # TODO - Solve maximum context length problem
    MAX_CONTEXT_LENGTH = 500  # Reduced limit to avoid excessive tokens
    if len(state["finetune_context"]) > MAX_CONTEXT_LENGTH:
        state["finetune_context"] = state["finetune_context"][:MAX_CONTEXT_LENGTH] + "..."
    finetune_context = state.get("finetune_context", "")

    web_context = perform_web_search(topic)
    extra_context = f"\n\nAdditional fine-tuning context extracted from provided documents:\n{finetune_context}\n\n" if finetune_context else ""
    if web_context:
        extra_context += f"Up-to-date information from web search:\n{web_context}\n\n"

    if not is_next_section:
        prompt_main = f"""
        You are an expert educator creating a microcourse on the topic: {topic}.
        {extra_context}Please generate only one section, which is the Introduction.
        Include the following fields:
        - "section_title": a title for the section.
        - "content": the main text.
        - "recall_notes": a list of key recall notes.
        - "vocabulary": an object mapping key terms to definitions.
        - "quiz": an object with:
             - "question": a quiz question.
             - "options": an object with keys "A", "B", "C", "D".
             - "correct_answer": the letter representing the correct answer.
             - "generate_code": true if code examples are relevant for this section, false otherwise.
             - "generate_math": true if math expressions are relevant for this section, false otherwise.
        Do NOT include code examples or math expressions.
        IMPORTANT: Output ONLY the JSON object exactly in the following format:
        
        {{
          "section_title": "Introduction",
          "content": "Your introduction text here.",
          "recall_notes": ["recall note 1", "recall note 2", "..."],
          "vocabulary": {{
              "word1": "definition1",
              "word2": "definition2",
              "..."
          }},
          "quiz": {{
              "question": "Your quiz question here.",
              "options": {{
                  "A": "Option A",
                  "B": "Option B",
                  "C": "Option C",
                  "D": "Option D"
              }},
              "correct_answer": "A"
          }},
          "generate_code": True,
          "generate_math": True
        }}
        
        Ensure the JSON starts with {{ and ends with }}.
        """
    else:
        if previous_section is None:
            raise ValueError("For next sections, previous_section must be provided.")
        prompt_main = f"""
        You are an expert educator developing a microcourse on the topic: {topic}.
        Previously, you generated the following section:
        {json.dumps(previous_section, indent=2)}
        
        {extra_context}Now, please generate the next section that logically continues from the previous one.
        Include the following fields:
        - "section_title": the new section's title.
        - "content": the main text.
        - "recall_notes": a list of key recall notes.
        - "vocabulary": an object mapping key terms to definitions.
        - "quiz": an object with:
             - "question": a quiz question.
             - "options": an object with keys "A", "B", "C", "D".
             - "correct_answer": the letter representing the correct answer.
             - "generate_code": true if code examples are relevant for this section, false otherwise.
         - "generate_math": true if math expressions are relevant for this section, false otherwise.
        Do NOT include code examples or math expressions.
        IMPORTANT: Output ONLY the JSON object exactly in the following format:
        
        {{
          "section_title": "Next Section Title",
          "content": "Your section content here.",
          "recall_notes": ["recall note 1", "recall note 2", "..."],
          "vocabulary": {{
              "word1": "definition1",
              "word2": "definition2",
              "..."
          }},
          "quiz": {{
              "question": "Your quiz question here.",
              "options": {{
                  "A": "Option A",
                  "B": "Option B",
                  "C": "Option C",
                  "D": "Option D"
              }},
              "correct_answer": "A"
          }},
          "generate_code": True,
          "generate_math": True
        }}
        
        Ensure the JSON starts with {{ and ends with }}.
        """
    main_section, error_main = retry_generate(_generate_main_section, prompt_main)
    if error_main:
        raise Exception(error_main)

    if main_section.get("generate_code"):
        code_examples = generate_code_examples_section(topic)
    else:
        code_examples = []

    if main_section.get("generate_math"):
        math_expressions = generate_math_expressions_section(topic, main_section.get("content", ""))
    else:
        math_expressions = []

    hall_result = hallucination_detection(main_section.get("content", ""), finetune_context)
    if hall_result.get("hallucination_detected", "").lower() == "yes":
        logging.warning("Hallucination detected: " + hall_result.get("details", ""))

    combined_section = main_section.copy()
    combined_section["code_examples"] = code_examples
    combined_section["math_expressions"] = math_expressions

    # Convert structured fields to JSON strings if required by your API:
    for field in ["recall_notes", "vocabulary", "quiz", "code_examples", "math_expressions"]:
        combined_section[field] = json.dumps(combined_section[field])

    return combined_section
