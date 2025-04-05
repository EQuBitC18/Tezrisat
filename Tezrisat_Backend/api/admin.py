from django.contrib import admin
from .models import (
    Microcourse,
    MicrocourseSection,
    GlossaryTerm,
    QuizQuestion,
    RecallNote,
)

@admin.register(Microcourse)
class MicrocourseAdmin(admin.ModelAdmin):
    list_display = ("title", "topic", "complexity", "target_audience", "user")

@admin.register(MicrocourseSection)
class MicrocourseSectionAdmin(admin.ModelAdmin):
    list_display = ("microcourse", "section_title", "id")
    list_filter = ("microcourse",)

@admin.register(GlossaryTerm)
class GlossaryTermAdmin(admin.ModelAdmin):
    list_display = ("term", "definition", "section")
    list_filter = ("section",)

@admin.register(QuizQuestion)
class QuizQuestionAdmin(admin.ModelAdmin):
    list_display = ("question", "correct_answer", "section")
    list_filter = ("section",)

@admin.register(RecallNote)
class RecallNoteAdmin(admin.ModelAdmin):
    list_display = ("content", "timestamp", "section")
    list_filter = ("section",)
