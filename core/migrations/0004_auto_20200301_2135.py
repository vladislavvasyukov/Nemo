# Generated by Django 3.0.3 on 2020-03-01 18:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_remove_user_phone'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='user',
            options={'verbose_name': 'Сотрудник', 'verbose_name_plural': 'Сотрудники'},
        ),
        migrations.CreateModel(
            name='CompanyUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('company', models.ForeignKey(db_index=False, on_delete=django.db.models.deletion.CASCADE, to='core.Company', verbose_name='Компания')),
                ('user', models.ForeignKey(db_index=False, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='Сотрудник')),
            ],
            options={
                'verbose_name': 'Сотрудник компании',
                'verbose_name_plural': 'Сотрудники компаний',
            },
        ),
        migrations.AddField(
            model_name='user',
            name='companies',
            field=models.ManyToManyField(related_name='users', through='core.CompanyUser', to='core.Company', verbose_name='Компании'),
        ),
        migrations.AddConstraint(
            model_name='companyuser',
            constraint=models.UniqueConstraint(fields=('user', 'company'), name='unique_company_user'),
        ),
    ]
