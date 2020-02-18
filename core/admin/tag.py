from django.contrib import admin

from core.models import Tag


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass
