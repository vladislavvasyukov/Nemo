from django.conf.urls import include
from django.urls import path
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('tasks', api.TaskViewSet, 'tasks')

urlpatterns = [
    path('', include(router.urls)),
    path("auth/register/", api.RegistrationAPI.as_view(), name='register'),
    path("auth/login/", api.LoginAPI.as_view(), name='login'),
    path("auth/user/", api.UserAPI.as_view(), name='user'),
    path("tags/", api.TagListApi.as_view()),
    path("projects/", api.ProjectListApi.as_view()),
    path("users/", api.UserListApi.as_view()),
]
