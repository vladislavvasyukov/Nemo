from datetime import timedelta, datetime

from django.contrib.auth.views import PasswordResetConfirmView
from django.db.models import Q, Case, When, IntegerField
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.utils.dateparse import parse_datetime
from django.views.generic import TemplateView
from knox.models import AuthToken
from rest_framework import permissions, generics, viewsets
from rest_framework.mixins import ListModelMixin, RetrieveModelMixin
from rest_framework.response import Response

from core import serializers
from core.forms import PasswordRecoveryForm
from core.models import Task, Tag, Project, User, Company, Email
from core.models.task import TaskNegativeTotalWorkTimeError
from core.paginators import TasksPagination
from core.utils import get_real_true_false


class RegistrationAPI(generics.GenericAPIView):
    serializer_class = serializers.CreateUserSerializer

    def post(self, request, *args, **kwargs):
        data = request.data

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        company = user.companies.first()
        self.request.session['current_company_id'] = company.pk if company else None

        return Response({
            "user": serializers.UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1],
            'current_company_id': self.request.session['current_company_id'],
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
        task_id = data.get('task_id')
        if task_id:
            task = Task.objects.get(pk=task_id)
            serializer = self.get_serializer(task, data=data)
        else:
            serializer = self.get_serializer(data=data)

        serializer.is_valid(raise_exception=True)
        task = serializer.save()

        task.tags.clear()
        for tag in Tag.objects.filter(pk__in=data['tags']):
            task.tags.add(tag)

        task.participants.clear()
        for user in User.objects.filter(pk__in=data.get('participants', [])):
            task.participants.add(user)

        return Response({
            "task": serializers.TaskSerializer(task, context=self.get_serializer_context()).data,
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

        company = user.companies.first()
        self.request.session['current_company_id'] = company.pk if company else None

        return Response({
            "user": serializers.UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1],
            'current_company_id': self.request.session['current_company_id']
        })


class UserAPI(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.UserSerializer

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        user = self.get_object()
        if not self.request.session.get('current_company_id'):
            company = user.companies.first()
            self.request.session['current_company_id'] = company.pk if company else None

        serializer = self.get_serializer(user)
        return Response({
            'user': serializer.data,
            'current_company_id': self.request.session['current_company_id']
        })


class TaskListViewSet(ListModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.TaskSerializerShort
    pagination_class = TasksPagination

    def get_queryset(self):
        if 'to_execute' in self.request.query_params:
            tasks = self.request.user.tasks_to_execute.filter(status__in=Task.WORK_STATUSES)
        else:
            tasks = self.request.user.manager_tasks.filter(status__in=Task.WORK_STATUSES)

        return tasks.filter(project__company_id=self.request.session.get('current_company_id'))


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
        return Project.objects.filter(name__icontains=q, company_id=self.request.session.get('current_company_id'))[:20]


class UserListApi(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.UserSelectSerializer

    def get_queryset(self):
        q = self.request.query_params.get('q', '')

        filters = Q(name__icontains=q, companies=self.request.session.get('current_company_id'),)
        users = User.objects.filter(filters).distinct()

        task_id = self.request.query_params.get('task_id')
        if task_id:
            try:
                task = Task.objects.get(pk=task_id)
                task_user_ids = task.members_pks
                users = users.annotate(
                    is_member=Case(When(pk__in=task_user_ids, then=0), default=1, output_field=IntegerField())
                )
                users = users.order_by('is_member')
            except Task.DoesNotExist:
                pass

        return users[:20]


class TaskRetrieveView(RetrieveModelMixin, viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.TaskSerializer

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


class ChangeCurrentCompanyView(generics.GenericAPIView):

    def post(self, request, *args, **kwargs):
        current_company_id = request.data['current_company_id']
        user = request.user

        try:
            company = user.companies.get(pk=current_company_id)
            request.session['current_company_id'] = company.pk
            return Response({
                'success': True,
            })
        except Company.DoesNotExist:
            return Response({
                'success': False,
                "message": "Пользователь не числится в данной компании",
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


class CompanyApi(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]
    serializer_class = serializers.CompanySerializerShort

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        company = serializer.save()
        request.session['current_company_id'] = company.pk
        return Response({
            'success': True,
        })


class InviteUserView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def post(self, request, *args, **kwargs):
        email = request.data['email']
        try:
            user = User.objects.get(email__iexact=email, is_active=True)
            company = Company.objects.get(pk=request.session['current_company_id'])
            user.companies.add(company)
            Email.objects.create_from_tpl(
                "core/emails/invitation.html",
                {
                    'company': company
                },
                f"Приглашение в компанию {company.name}",
                [email]
            )
            return Response({
                'success': True,
            })
        except User.DoesNotExist:
            return Response({
                'success': False,
                'message': "Извините, пользователь с указанным email-ом не обнаружен."
            })


class LeaveCompanyApi(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def post(self, request, *args, **kwarg):
        company_id = request.data['company_id']
        user = request.user
        user.companies.remove(company_id)
        if request.session.get('current_company_id') == company_id:
            company = user.companies.first()
            request.session['current_company_id'] = company.pk if company else None

        return Response({
            "user": serializers.UserSerializer(user, context=self.get_serializer_context()).data,
            'current_company_id': request.session.get('current_company_id'),
        })


class CompanyUserListApi(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.UserSerializer

    def get_queryset(self):
        return User.objects.filter(companies=self.request.session.get('current_company_id')).distinct()


class WorkHoursView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated, ]

    def post(self, request, *args, **kwarg):
        h = int(request.data['hours'])
        m = int(request.data['minutes'])
        text = request.data['comment']

        work_date = request.data.get('work_date')
        work_date = parse_datetime(work_date) if work_date else datetime.today()

        minus_work_time = get_real_true_false(request.data['minus_work_time'])

        work_time = timedelta(hours=h, minutes=m)

        task = Task.objects.get(pk=request.data['task_id'])

        try:
            task.add_work_time(request.user, work_date, text, work_time, minus_work_time=minus_work_time)
            return Response({
                'task': serializers.TaskSerializer(task, context=self.get_serializer_context()).data,
            })
        except TaskNegativeTotalWorkTimeError as e:
            return Response({'message': str(e)}, status=400)
