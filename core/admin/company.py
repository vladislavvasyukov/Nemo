from django.contrib import admin

from core.models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    pass
