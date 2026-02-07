from rest_framework import serializers
from api.models import (
    Microcourse,
    MicrocourseSection,
    GlossaryTerm,
    QuizQuestion,
    RecallNote
)


# serializers.py

class GlossaryTermSerializer(serializers.ModelSerializer):
    class Meta:
        model = GlossaryTerm
        fields = ['id', 'section', 'term', 'definition']

class QuizQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizQuestion
        fields = ['id', 'section', 'question', 'options', 'correct_answer']

class RecallNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecallNote
        fields = ['id', 'section', 'content', 'timestamp']

class MicrocourseSectionSerializer(serializers.ModelSerializer):
    # Nest the related glossary, quiz, and recall notes
    glossary_terms = GlossaryTermSerializer(many=True, read_only=True)
    quiz_questions = QuizQuestionSerializer(many=True, read_only=True)
    recall_notes = RecallNoteSerializer(many=True, read_only=True)

    class Meta:
        model = MicrocourseSection
        fields = [
            "id",
            "microcourse",
            "section_title",
            "content",
            "code_examples",
            "math_expressions",
            "glossary_terms",
            "quiz_questions",
            "recall_notes",
        ]

    def create(self, validated_data):
        # Remove 'user' key if present
        validated_data.pop("user", None)
        return MicrocourseSection.objects.create(**validated_data)

class MicrocourseSerializer(serializers.ModelSerializer):
    sections = MicrocourseSectionSerializer(many=True, read_only=True)

    class Meta:
        model = Microcourse
        fields = [
            "id",
            "title",
            "topic",
            "complexity",
            "target_audience",
            "url",
            "pdf",
            "sections",
        ]
        extra_kwargs = {"user": {"read_only": True}}

