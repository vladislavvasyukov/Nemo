from django.contrib import admin

from core.models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    pass
