from django.conf.urls import include
from django.urls import path, re_path
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('tasks', api.TaskListViewSet, 'tasks')
router.register('get_task', api.TaskRetrieveView, basename='get-task')
router.register('company', api.CompanyApi, 'company')

urlpatterns = [
    path('', include(router.urls)),
    path("auth/register/", api.RegistrationAPI.as_view(), name='register'),
    path("auth/login/", api.LoginAPI.as_view(), name='login'),
    path("auth/user/", api.UserAPI.as_view(), name='user'),
    path("tags/", api.TagListApi.as_view(), name='api-tags-select'),
    path("projects/", api.ProjectListApi.as_view(), name='api-projects-select'),
    path("users/", api.UserListApi.as_view(), name='api-users-select'),
    path("create_task/", api.CreateTaskApi.as_view(), name='create-task'),
    path("create_comment/", api.CreateCommentApi.as_view(), name='create-comment'),
    path("save_description/", api.SaveDescription.as_view(), name='save-description'),
    path("avatar_upload/", api.AvatarUpload.as_view(), name='avatar-upload'),
    path("save_profile/<int:pk>/", api.SaveProfile.as_view(), name='save-profile'),
    path("recover_password/", api.RecoverPassword.as_view(), name="recover-password"),
    re_path(
        r'^password_reset_confirm/(?P<uidb64>[0-9A-Za-z]{1,13})-(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        api.PasswordResetView.as_view(),
        name='password_reset_confirm'
    ),
    path('password_reset/complete/', api.RecoverSuccessView.as_view(), name='password_reset_complete'),
]
