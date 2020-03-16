from knox.models import AuthToken
from rest_framework import permissions, generics, viewsets
from rest_framework.response import Response

from core.models import Task, Tag, Project, User
from core.serializers import CreateUserSerializer, UserSerializer, LoginUserSerializer, TaskSerializerShort, \
    TagSelectSerializer, ProjectSelectSerializer, UserSelectSerializer


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = CreateUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginUserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = TaskSerializerShort

    def get_queryset(self):
        return self.request.user.tasks_to_execute.filter(status__in=Task.WORK_STATUSES)


class TagListApi(generics.ListAPIView):

    serializer_class = TagSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return Tag.objects.filter(title__icontains=q)[:20]


class ProjectListApi(generics.ListAPIView):
    permissions_classes = [permissions.IsAuthenticated, ]
    serializer_class = ProjectSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return Project.objects.filter(name__icontains=q)[:20]


class UserListApi(generics.ListAPIView):
    permissions_classes = [permissions.IsAuthenticated]
    serializer_class = UserSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')
        return User.objects.filter(name__icontains=q)[:20]
