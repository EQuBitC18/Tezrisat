from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    def __str__(self):
        return f"{self.user.username}'s Profile"

# Signal: automatically create or update UserProfile whenever a User is created/updated.
@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    else:
        instance.profile.save()


class Microcourse(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=1000)
    topic = models.CharField(max_length=1000)
    complexity = models.CharField(max_length=1000)
    target_audience = models.CharField(max_length=1000)
    url = models.URLField(max_length=500, blank=True, null=True)
    pdf = models.FileField(upload_to='pdfs/', null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="microcourses")

    def __str__(self):
        return self.title

class MicrocourseSection(models.Model):
    microcourse = models.ForeignKey(Microcourse, on_delete=models.CASCADE, related_name="sections")
    section_title = models.TextField(default="Introduction")
    content = models.TextField(default="")
    # Retain code_examples and math_expressions here if desired
    code_examples = models.TextField(default="")
    math_expressions = models.TextField(default="")

    def __str__(self):
        return f"{self.microcourse.title} - {self.section_title}"

class GlossaryTerm(models.Model):
    section = models.ForeignKey(MicrocourseSection, on_delete=models.CASCADE, related_name="glossary_terms")
    term = models.CharField(max_length=255)
    definition = models.TextField()

    def __str__(self):
        return f"{self.term} ({self.section.section_title})"

class QuizQuestion(models.Model):
    section = models.ForeignKey(MicrocourseSection, on_delete=models.CASCADE, related_name="quiz_questions")
    question = models.TextField()
    # Store options as JSON – Django 3.1+ supports models.JSONField
    options = models.JSONField()
    correct_answer = models.CharField(max_length=10)  # e.g., "A"

    def __str__(self):
        return f"Quiz: {self.question}"

class RecallNote(models.Model):
    section = models.ForeignKey(MicrocourseSection, on_delete=models.CASCADE, related_name="recall_notes")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Note for {self.section.section_title} at {self.timestamp}"
