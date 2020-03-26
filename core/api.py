from knox.models import AuthToken
from rest_framework import permissions, generics, viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.response import Response

from core import serializers
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
            "user": serializers.UserSerializerShort(user, context=self.get_serializer_context()).data,
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
