from django.conf.urls import include
from django.urls import path, re_path
from rest_framework import routers

from . import api

router = routers.DefaultRouter()
router.register('tasks', api.TaskListViewSet, 'tasks')
router.register('get_task', api.TaskRetrieveView, basename='get-task')
router.register('projects', api.ProjectListViewSet, 'projects')
router.register('get_project', api.ProjectRetrieveView, basename='get-project')


urlpatterns = [
    path('', include(router.urls)),
    path("auth/register/", api.RegistrationAPI.as_view(), name='register'),
    path("auth/login/", api.LoginAPI.as_view(), name='login'),
    path("auth/user/", api.UserAPI.as_view(), name='user'),
    path("tags/", api.TagListApi.as_view(), name='api-tags-select'),
    path("projects_for_select/", api.ProjectListApi.as_view(), name='api-projects-select'),
    path("users/", api.UserListApi.as_view(), name='api-users-select'),
    path("create_task/", api.CreateTaskApi.as_view(), name='create-task'),
    path("create_project/", api.CreateProjectApi.as_view(), name='create-project'),
    path("create_comment/", api.CreateCommentApi.as_view(), name='create-comment'),
    path("save_description/", api.SaveDescription.as_view(), name='save-description'),
    path("save_company_name/", api.SaveCompanyName.as_view(), name='save-company-name'),
    path("avatar_upload/", api.AvatarUpload.as_view(), name='avatar-upload'),
    path("save_profile/<int:pk>/", api.SaveProfile.as_view(), name='save-profile'),
    path("recover_password/", api.RecoverPassword.as_view(), name="recover-password"),
    re_path(
        r'^password_reset_confirm/(?P<uidb64>[0-9A-Za-z]{1,13})-(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        api.PasswordResetView.as_view(),
        name='password_reset_confirm'
    ),
    path('password_reset/complete/', api.RecoverSuccessView.as_view(), name='password_reset_complete'),
    path('change_current_company/', api.ChangeCurrentCompanyView.as_view(), name='change_current_company'),
    path('create_company/', api.CompanyApi.as_view(), name='create-company'),
    path('invite_user/', api.InviteUserView.as_view(), name='invite-user'),
    path('leave_company/', api.LeaveCompanyApi.as_view(), name='leave_company'),
    path('get_company_users/', api.CompanyUserListApi.as_view(), name='get_company_users'),
    path('add_work_hours/', api.WorkHoursView.as_view(), name='add_work_hours'),
]
