from django.contrib import admin

from core.models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = [
        'id', 'created', 'status', 'planned_work_hours', 'work_hours', 'deadline', 'executor', 'manager', 
    ]
