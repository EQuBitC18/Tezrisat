import json
from unittest.mock import patch

from rest_framework.test import APITestCase

from .models import Microcourse, MicrocourseSection, GlossaryTerm, QuizQuestion, RecallNote


class ApiLlmFlowTests(APITestCase):
    def _mock_section_data(self):
        return {
            "section_title": "Introduction",
            "content": "Test content",
            "code_examples": "[]",
            "math_expressions": "[]",
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
