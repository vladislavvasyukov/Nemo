from knox.models import AuthToken
from rest_framework import permissions, generics, viewsets
from rest_framework.mixins import ListModelMixin
from rest_framework.response import Response

from core import serializers
from core.models import Task, Tag, Project, User


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = serializers.CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": serializers.UserSerializerShort(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class CreateTaskApi(generics.GenericAPIView):
    serializer_class = serializers.CreateTaskSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        data['author'] = request.user.pk
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        task = serializer.save()
        return Response({
            "task": serializers.TaskSerializer(task, context=self.get_serializer_context()).data,
        })


class LoginAPI(generics.GenericAPIView):
    serializer_class = serializers.LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": serializers.UserSerializerShort(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.UserSerializerShort

    def get_object(self):
        return self.request.user


class TaskListViewSet(ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.TaskSerializerShort

    def get_queryset(self):
        return self.request.user.tasks_to_execute.filter(status__in=Task.WORK_STATUSES)


class TagListApi(generics.ListAPIView):

    serializer_class = serializers.TagSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return Tag.objects.filter(title__icontains=q)[:20]


class ProjectListApi(generics.ListAPIView):
    permissions_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.ProjectSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return Project.objects.filter(name__icontains=q)[:20]


class UserListApi(generics.ListAPIView):
    permissions_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.UserSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return User.objects.filter(name__icontains=q)[:20]
