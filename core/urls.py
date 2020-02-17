from django.urls import path
from core.views import index_page


app_name = 'core'

urlpatterns = [
    path('', index_page, name='index'),
]