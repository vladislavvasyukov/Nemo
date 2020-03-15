from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import ugettext_lazy as _

from core.models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('id', 'name', 'is_staff', 'is_superuser', 'last_login', 'is_active',)
    ordering = ('id',)
    fieldsets = (
        (None, {'fields': ('password',)}),
        (_('Personal info'), {'fields': ('email', 'skype', 'telegram')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2'),
        }),
    )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('email',)
