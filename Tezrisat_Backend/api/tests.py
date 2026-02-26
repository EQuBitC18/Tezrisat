import json
from unittest.mock import patch, MagicMock

from django.test import TestCase
from rest_framework.test import APITestCase

from .models import Microcourse, MicrocourseSection, GlossaryTerm, QuizQuestion, RecallNote
from .generate_microcourse import (
    call_llm,
    document_relevancy_check,
    hallucination_detection,
    _generate_main_section,
    _generate_code_examples,
    _generate_math_expressions,
    _generate_math_expressions_refined,
)


class CallLlmReturnTypeTests(TestCase):
    """Verify call_llm returns a plain str, not a tuple."""

    @patch("api.generate_microcourse.ChatOpenAI")
    def test_call_llm_returns_str(self, mock_chat_cls):
        mock_response = MagicMock()
        mock_response.content = "hello"
        mock_chat_cls.return_value.invoke.return_value = mock_response

        result = call_llm("prompt", "fake-key")
        self.assertIsInstance(result, str)
        self.assertEqual(result, "hello")

    @patch("api.generate_microcourse.ChatOpenAI")
    def test_call_llm_returns_str_not_tuple(self, mock_chat_cls):
        mock_response = MagicMock()
        mock_response.content = '{"key": "value"}'
        mock_chat_cls.return_value.invoke.return_value = mock_response

        result = call_llm("prompt", "fake-key")
        self.assertNotIsInstance(result, tuple)
        self.assertIsInstance(result, str)


class GenerateMainSectionTests(TestCase):
    """Verify _generate_main_section handles the str return from call_llm."""

    @patch("api.generate_microcourse.call_llm")
    def test_valid_json(self, mock_llm):
        mock_llm.return_value = json.dumps({
            "section_title": "Intro",
            "content": "Hello world",
        })
        data, error = _generate_main_section("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data["section_title"], "Intro")
        self.assertEqual(data["token_usage"], 0)

    @patch("api.generate_microcourse.call_llm")
    def test_invalid_json_returns_error(self, mock_llm):
        mock_llm.return_value = "not valid json"
        data, error = _generate_main_section("prompt", "fake-key")
        self.assertIsNone(data)
        self.assertIn("Error parsing main section JSON", error)


class GenerateCodeExamplesTests(TestCase):
    """Test _generate_code_examples parsing paths."""

    @patch("api.generate_microcourse.call_llm")
    def test_valid_json_array(self, mock_llm):
        examples = [{"description": "Example", "code": "print('hi')"}]
        mock_llm.return_value = json.dumps(examples)
        data, error = _generate_code_examples("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data, examples)

    @patch("api.generate_microcourse.call_llm")
    def test_json_object_not_array_triggers_extraction(self, mock_llm):
        mock_llm.return_value = '{"not": "an array"}'
        data, error = _generate_code_examples("prompt", "fake-key")
        self.assertIsNone(data)
        self.assertIn("Error parsing code examples JSON", error)

    @patch("api.generate_microcourse.call_llm")
    def test_extracts_array_from_surrounding_text(self, mock_llm):
        examples = [{"description": "Ex", "code": "x=1"}]
        mock_llm.return_value = f'Here are examples: {json.dumps(examples)} hope that helps!'
        data, error = _generate_code_examples("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data, examples)

    @patch("api.generate_microcourse.call_llm")
    def test_empty_array(self, mock_llm):
        mock_llm.return_value = "[]"
        data, error = _generate_code_examples("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data, [])

    @patch("api.generate_microcourse.call_llm")
    def test_completely_unparseable(self, mock_llm):
        mock_llm.return_value = "no json here at all"
        data, error = _generate_code_examples("prompt", "fake-key")
        self.assertIsNone(data)
        self.assertIn("Error parsing code examples JSON", error)


class GenerateMathExpressionsTests(TestCase):
    """Test _generate_math_expressions parsing paths."""

    @patch("api.generate_microcourse.call_llm")
    def test_valid_json_array(self, mock_llm):
        expressions = [{"description": "Pythagorean", "expression": "$a^2+b^2=c^2$"}]
        mock_llm.return_value = json.dumps(expressions)
        data, error = _generate_math_expressions("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data, expressions)

    @patch("api.generate_microcourse.call_llm")
    def test_extracts_array_from_surrounding_text(self, mock_llm):
        expressions = [{"description": "E=mc2", "expression": "$E=mc^2$"}]
        mock_llm.return_value = f'Math: {json.dumps(expressions)} done.'
        data, error = _generate_math_expressions("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data, expressions)

    @patch("api.generate_microcourse.call_llm")
    def test_empty_array(self, mock_llm):
        mock_llm.return_value = "[]"
        data, error = _generate_math_expressions("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data, [])

    @patch("api.generate_microcourse.call_llm")
    def test_unparseable(self, mock_llm):
        mock_llm.return_value = "no math here"
        data, error = _generate_math_expressions("prompt", "fake-key")
        self.assertIsNone(data)
        self.assertIn("Error parsing math expressions JSON", error)


class GenerateMathExpressionsRefinedTests(TestCase):
    """Test _generate_math_expressions_refined parsing paths."""

    @patch("api.generate_microcourse.call_llm")
    def test_valid_json_array(self, mock_llm):
        expressions = [{"description": "Area", "expression": "$A=\\pi r^2$"}]
        mock_llm.return_value = json.dumps(expressions)
        data, error = _generate_math_expressions_refined("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data, expressions)

    @patch("api.generate_microcourse.call_llm")
    def test_extracts_array_from_text(self, mock_llm):
        expressions = [{"description": "Sum", "expression": "$\\sum_{i=1}^n i$"}]
        mock_llm.return_value = f'Result: {json.dumps(expressions)} end'
        data, error = _generate_math_expressions_refined("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data, expressions)

    @patch("api.generate_microcourse.call_llm")
    def test_empty_array(self, mock_llm):
        mock_llm.return_value = "[]"
        data, error = _generate_math_expressions_refined("prompt", "fake-key")
        self.assertIsNone(error)
        self.assertEqual(data, [])

    @patch("api.generate_microcourse.call_llm")
    def test_unparseable(self, mock_llm):
        mock_llm.return_value = "garbage"
        data, error = _generate_math_expressions_refined("prompt", "fake-key")
        self.assertIsNone(data)
        self.assertIn("Error parsing math expressions JSON", error)


class DocumentRelevancyCheckTests(TestCase):
    """Test document_relevancy_check parsing."""

    @patch("api.generate_microcourse.call_llm")
    def test_valid_json_response(self, mock_llm):
        mock_llm.return_value = json.dumps({
            "relevant": "yes",
            "score": 0.9,
            "reason": "Highly relevant",
        })
        result = document_relevancy_check("Python", "Python is great", "fake-key")
        self.assertEqual(result["relevant"], "yes")
        self.assertEqual(result["score"], 0.9)

    @patch("api.generate_microcourse.call_llm")
    def test_unparseable_returns_fallback(self, mock_llm):
        mock_llm.return_value = "not json"
        result = document_relevancy_check("Python", "some text", "fake-key")
        self.assertEqual(result["relevant"], "no")
        self.assertEqual(result["score"], 0)
        self.assertEqual(result["reason"], "Parsing error")


class HallucinationDetectionTests(TestCase):
    """Test hallucination_detection parsing."""

    @patch("api.generate_microcourse.call_llm")
    def test_valid_json_no_hallucination(self, mock_llm):
        mock_llm.return_value = json.dumps({
            "hallucination_detected": "no",
            "details": "",
        })
        result = hallucination_detection("response text", "context text", "fake-key")
        self.assertEqual(result["hallucination_detected"], "no")

    @patch("api.generate_microcourse.call_llm")
    def test_valid_json_with_hallucination(self, mock_llm):
        mock_llm.return_value = json.dumps({
            "hallucination_detected": "yes",
            "details": "Claim not in context",
        })
        result = hallucination_detection("response text", "context text", "fake-key")
        self.assertEqual(result["hallucination_detected"], "yes")
        self.assertEqual(result["details"], "Claim not in context")

    @patch("api.generate_microcourse.call_llm")
    def test_unparseable_returns_fallback(self, mock_llm):
        mock_llm.return_value = "broken output"
        result = hallucination_detection("response", "context", "fake-key")
        self.assertEqual(result["hallucination_detected"], "no")
        self.assertEqual(result["details"], "Parsing error")


class ApiLlmFlowTests(APITestCase):
    def _mock_section_data(self, generate_code=False, generate_math=False):
        code = json.dumps([{"description": "Ex", "code": "x=1"}]) if generate_code else "[]"
        math = json.dumps([{"description": "Area", "expression": "$A=\\pi r^2$"}]) if generate_math else "[]"
        return {
            "section_title": "Introduction",
            "content": "Test content",
            "code_examples": code,
            "math_expressions": math,
            "vocabulary": json.dumps({"term": "definition"}),
            "quiz": json.dumps({
                "question": "Q?",
                "options": {"A": "A", "B": "B", "C": "C", "D": "D"},
                "correct_answer": "A",
            }),
            "recall_notes": json.dumps(["note 1", "note 2"]),
        }

    @patch("api.views.generate_microcourse_section")
    def test_add_microcourse_creates_section_and_related(self, mock_generate):
        mock_generate.return_value = self._mock_section_data()

        payload = {
            "title": "Test Course",
            "topic": "Testing",
            "complexity": "Beginner",
            "target_audience": "Students",
            "openai_key": "test-key",
            "serpapi_key": "test-serp",
        }

        response = self.client.post("/api/add_microcourse/", data=payload, format="multipart")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Microcourse.objects.count(), 1)
        self.assertEqual(MicrocourseSection.objects.count(), 1)
        self.assertEqual(GlossaryTerm.objects.count(), 1)
        self.assertEqual(QuizQuestion.objects.count(), 1)
        self.assertEqual(RecallNote.objects.count(), 2)

    @patch("api.views.generate_microcourse_section")
    def test_add_microcourse_with_code_generation(self, mock_generate):
        mock_generate.return_value = self._mock_section_data(generate_code=True)

        payload = {
            "title": "Code Course",
            "topic": "Python",
            "complexity": "Beginner",
            "target_audience": "Developers",
            "openai_key": "test-key",
            "serpapi_key": "test-serp",
        }

        response = self.client.post("/api/add_microcourse/", data=payload, format="multipart")
        self.assertEqual(response.status_code, 200)
        section = MicrocourseSection.objects.first()
        code = json.loads(section.code_examples)
        self.assertEqual(len(code), 1)
        self.assertEqual(code[0]["description"], "Ex")

    @patch("api.views.generate_microcourse_section")
    def test_add_microcourse_with_math_generation(self, mock_generate):
        mock_generate.return_value = self._mock_section_data(generate_math=True)

        payload = {
            "title": "Math Course",
            "topic": "Calculus",
            "complexity": "Intermediate",
            "target_audience": "Students",
            "openai_key": "test-key",
            "serpapi_key": "test-serp",
        }

        response = self.client.post("/api/add_microcourse/", data=payload, format="multipart")
        self.assertEqual(response.status_code, 200)
        section = MicrocourseSection.objects.first()
        math = json.loads(section.math_expressions)
        self.assertEqual(len(math), 1)
        self.assertEqual(math[0]["description"], "Area")

    @patch("api.views.generate_microcourse_section")
    def test_add_microcourse_with_code_and_math(self, mock_generate):
        mock_generate.return_value = self._mock_section_data(
            generate_code=True, generate_math=True,
        )

        payload = {
            "title": "Full Course",
            "topic": "Physics",
            "complexity": "Advanced",
            "target_audience": "Researchers",
            "openai_key": "test-key",
            "serpapi_key": "test-serp",
        }

        response = self.client.post("/api/add_microcourse/", data=payload, format="multipart")
        self.assertEqual(response.status_code, 200)
        section = MicrocourseSection.objects.first()
        self.assertTrue(len(json.loads(section.code_examples)) > 0)
        self.assertTrue(len(json.loads(section.math_expressions)) > 0)

    @patch("api.views.generate_microcourse_section")
    def test_go_in_depth_creates_next_section(self, mock_generate):
        mock_generate.return_value = self._mock_section_data()

        microcourse = Microcourse.objects.create(
            title="Course",
            topic="Topic",
            complexity="Beginner",
            target_audience="Learners",
        )

        payload = {
            "microcourseId": microcourse.id,
            "previousSection": "Previous content",
            "openai_key": "test-key",
        }

        response = self.client.post("/api/generate_next_section/", data=payload, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(MicrocourseSection.objects.filter(microcourse=microcourse).count(), 1)

    @patch("api.views.generate_microcourse_section")
    def test_go_in_depth_with_code_generation(self, mock_generate):
        mock_generate.return_value = self._mock_section_data(generate_code=True)

        microcourse = Microcourse.objects.create(
            title="Course",
            topic="Python",
            complexity="Beginner",
            target_audience="Developers",
        )

        payload = {
            "microcourseId": microcourse.id,
            "previousSection": "Previous content",
            "openai_key": "test-key",
        }

        response = self.client.post("/api/generate_next_section/", data=payload, format="json")
        self.assertEqual(response.status_code, 200)
        section = MicrocourseSection.objects.filter(microcourse=microcourse).first()
        code = json.loads(section.code_examples)
        self.assertEqual(len(code), 1)

    @patch("api.views.generate_microcourse_section")
    def test_go_in_depth_with_math_generation(self, mock_generate):
        mock_generate.return_value = self._mock_section_data(generate_math=True)

        microcourse = Microcourse.objects.create(
            title="Course",
            topic="Calculus",
            complexity="Intermediate",
            target_audience="Students",
        )

        payload = {
            "microcourseId": microcourse.id,
            "previousSection": "Previous content",
            "openai_key": "test-key",
        }

        response = self.client.post("/api/generate_next_section/", data=payload, format="json")
        self.assertEqual(response.status_code, 200)
        section = MicrocourseSection.objects.filter(microcourse=microcourse).first()
        math = json.loads(section.math_expressions)
        self.assertEqual(len(math), 1)

    @patch("api.views.generate_microcourse_section")
    def test_go_in_depth_with_code_and_math(self, mock_generate):
        mock_generate.return_value = self._mock_section_data(
            generate_code=True, generate_math=True,
        )

        microcourse = Microcourse.objects.create(
            title="Course",
            topic="Physics",
            complexity="Advanced",
            target_audience="Researchers",
        )

        payload = {
            "microcourseId": microcourse.id,
            "previousSection": "Previous content",
            "openai_key": "test-key",
        }

        response = self.client.post("/api/generate_next_section/", data=payload, format="json")
        self.assertEqual(response.status_code, 200)
        section = MicrocourseSection.objects.filter(microcourse=microcourse).first()
        self.assertTrue(len(json.loads(section.code_examples)) > 0)
        self.assertTrue(len(json.loads(section.math_expressions)) > 0)

    @patch("api.views.LLMChain")
    def test_get_agent_response_returns_answer(self, mock_chain_cls):
        mock_chain = mock_chain_cls.return_value
        mock_chain.run.return_value = "Test answer"

        microcourse = Microcourse.objects.create(
            title="Course",
            topic="Topic",
            complexity="Beginner",
            target_audience="Learners",
        )
        MicrocourseSection.objects.create(
            microcourse=microcourse,
            section_title="Intro",
            content="Some content",
        )

        payload = {
            "question": "What is this?",
            "id": microcourse.id,
            "openai_key": "test-key",
        }

        response = self.client.post(
            "/api/agent_response/",
            data=json.dumps(payload),
            content_type="application/json",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("answer"), "Test answer")
