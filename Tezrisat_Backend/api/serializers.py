import logging
from django.contrib.auth.models import User
from rest_framework import serializers, generics
from rest_framework.permissions import IsAuthenticated
from api.models import (
    Microcourse,
    MicrocourseSection,
    GlossaryTerm,
    QuizQuestion,
    RecallNote,
    Payment,
    Subscription,
)


# serializers.py
class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'user', 'amount', 'currency', 'stripe_payment_id', 'created_at', 'email']
        extra_kwargs = {'user': {'read_only': True}}


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            'id',
            'stripe_subscription_id',
            'status',
            'created_at',
        ]
        extra_kwargs = {'user': {'read_only': True}}

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def create(self, validated_data):
        logging.info("Starting user generation.")
        user = User.objects.create_user(**validated_data)
        logging.info("Completed user generation.")
        return user

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

class MicrocourseDetail(generics.RetrieveAPIView):
    serializer_class = MicrocourseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Microcourse.objects.filter(user=self.request.user)
