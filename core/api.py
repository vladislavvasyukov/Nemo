from django.contrib.auth.views import PasswordResetConfirmView
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.utils.translation import ugettext_lazy as _
from django.views.generic import TemplateView
from knox.models import AuthToken
from rest_framework import permissions, generics, viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.response import Response

from core import serializers
from core.forms import PasswordRecoveryForm
from core.models import Task, Tag, Project, User
from core.paginators import TasksPagination
from core.serializers import TaskSerializer


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = serializers.CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": serializers.UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class CreateTaskApi(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.CreateTaskSerializer

    def post(self, request, *args, **kwargs):
        data = {k: v for k, v in request.data.items()}
        tag_ids = []
        if 'tags' in data:
            for tag_id in data['tags']:
                if isinstance(tag_id, str):
                    tag, _ = Tag.objects.get_or_create(title=tag_id)
                    tag_ids.append(tag.pk)
                else:
                    tag_ids.append(tag_id)

        data['tags'] = tag_ids
        data['author'] = request.user.pk
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()

        for tag in Tag.objects.filter(pk__in=data['tags']):
            task.tags.add(tag)

        for user in User.objects.filter(pk__in=data.get('participants', [])):
            task.participants.add(user)

        return Response({
            "task": serializers.TaskSerializerShort(task, context=self.get_serializer_context()).data,
        })


class SaveProfile(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.ProfileSerializer
    queryset = User.objects.all()

    def post(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "user": serializers.UserSerializer(instance, context=self.get_serializer_context()).data,
        })


class CreateCommentApi(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.CreateCommentSerializer

    def post(self, request, *args, **kwargs):
        data = {k: v for k, v in request.data.items()}
        data['user'] = request.user.pk
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        comment = serializer.save()
        return Response({
            'comment': serializers.CommentSerializer(comment, context=self.get_serializer_context()).data,
        })


class LoginAPI(generics.GenericAPIView):
    serializer_class = serializers.LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": serializers.UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user


class TaskListViewSet(ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.TaskSerializerShort
    pagination_class = TasksPagination

    def get_queryset(self):
        if 'to_execute' in self.request.query_params:
            return self.request.user.tasks_to_execute.filter(status__in=Task.WORK_STATUSES)
        else:
            return self.request.user.manager_tasks.filter(status__in=Task.WORK_STATUSES)


class TagListApi(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.TagSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return Tag.objects.filter(title__icontains=q)[:20]


class ProjectListApi(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.ProjectSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return Project.objects.filter(name__icontains=q)[:20]


class UserListApi(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.UserSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return User.objects.filter(name__icontains=q)[:20]


class TaskRetrieveView(RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = TaskSerializer

    queryset = Task.objects.all().select_related('executor', 'manager', 'author')


class SaveDescription(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        task = Task.objects.get(pk=request.data['task_id'])
        task.description = request.data['description']
        task.save()

        return Response({
            "description": task.description,
        })


class AvatarUpload(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        user = User.objects.get(pk=request.data['pk'])

        for field_name in request.FILES:
            user.avatar = request.FILES.get(field_name)
            user.save()

        return Response({
            "avatar_url": user.avatar_url,
        })


class RecoverPassword(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):
        form = PasswordRecoveryForm(request.data)
        if form.is_valid():
            form.save(request=self.request)
            return Response({
                'success': True,
                "message": "ALL OK",
            })
        else:
            return Response({
                'success': False,
                "error": form.errors["email"][0],
            })


class PasswordResetView(PasswordResetConfirmView):
    template_name = 'core/password_recovery/password_recovery_page.html'
    success_url = reverse_lazy('password_reset_complete')

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            self.form_valid(form)
            json_res = {
                'status': True,
                'data': {
                    'redirect_url': self.success_url,
                },
            }
        else:
            json_res = {'status': False, 'form_errors': form.errors}

        response = JsonResponse(json_res, status=200)
        response['Vary'] = 'Accept'
        return response


class RecoverSuccessView(TemplateView):
    template_name = 'core/password_recovery/complete.html'
