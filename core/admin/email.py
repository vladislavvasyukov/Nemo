from django.contrib import admin
from django.utils.safestring import mark_safe
from django.utils.translation import ugettext_lazy as _

from core.models import Email, EmailAttachment


class EmailAttachmentInline(admin.TabularInline):
    model = EmailAttachment
    extra = 0
    readonly_fields = ['file']
    exclude = ['filename']


@admin.register(Email)
class EmailAdmin(admin.ModelAdmin):
    inlines = [EmailAttachmentInline]
    list_display = ("id", "subject", "created", "sender", "to", 'sent_date', 'status')
    list_filter = ['created', 'sent_date']

    def status(self, obj):
        if obj.sent_date:
            return mark_safe('<span style="color:green">%s</span>' % _('Отправлено'))
        elif obj.error is not None and obj.error != '':
            return mark_safe('<span style="color:red">%s</span>' % _('Ошибка'))
        else:
            return mark_safe('<span style="color:blue">%s</span>' % _('В очереди'))
    status.short_description = _('Статус')
