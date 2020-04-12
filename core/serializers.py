from django.contrib.auth import authenticate, get_user_model
from django.utils.translation import ugettext_lazy as _
from rest_framework import serializers

from core.models import Task, Tag, Project, Comment
from core.models.company import CompanyUser, Company

User = get_user_model()


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ('pk', 'title')


class UserSerializerShort(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'is_superuser', 'avatar_url')

    @staticmethod
    def get_avatar_url(obj):
        return obj.avatar_url


class ProjectSerializerShort(serializers.ModelSerializer):
    creator = UserSerializerShort()

    class Meta:
        model = Project
        fields = ('pk', 'name', 'creator')


class CompanySerializerShort(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ('pk', 'name')

    def create(self, validated_data):
        company, _ = Company.objects.get_or_create(
            name=validated_data.get('name'),
            creator=self.context['request'].user,
        )
        CompanyUser.objects.create(
            company=company,
            user=company.creator,
            is_admin=True,
        )
        return company


class ProjectSerializer(serializers.ModelSerializer):
    creator = UserSerializerShort()
    company = CompanySerializerShort()
    participants = UserSerializerShort(many=True)

    class Meta:
        model = Project
        fields = ('pk', 'name', 'creator', 'participants', 'description', 'company')


class CompanyUserSerializer(serializers.ModelSerializer):
    company_name = serializers.SerializerMethodField()

    class Meta:
        model = CompanyUser
        fields = ('company_id', 'company_name', 'is_admin')

    @staticmethod
    def get_company_name(obj):
        return obj.company.name


class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    companies = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'is_superuser', 'avatar_url', 'email', 'telegram', 'skype', 'companies')

    @staticmethod
    def get_avatar_url(obj):
        return obj.avatar_url

    @staticmethod
    def get_companies(obj):
        return CompanyUserSerializer(obj.companyuser_set.all(), many=True).data


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'telegram', 'skype')


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializerShort()
    timestamp = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('pk', 'timestamp', 'text', 'user')

    @staticmethod
    def get_timestamp(obj):
        return obj.timestamp.strftime('%d.%m.%Y %H:%M')


class TaskSerializerShort(serializers.ModelSerializer):
    executor = UserSerializerShort()
    tags = TagSerializer(many=True)

    class Meta:
        model = Task
        fields = ('id', 'title', 'executor', 'deadline', 'tags')


class TaskSerializer(serializers.ModelSerializer):
    project = ProjectSerializerShort()
    executor = UserSerializerShort()
    manager = UserSerializerShort()
    author = UserSerializerShort()
    participants = UserSerializerShort(many=True)
    tags = TagSerializer(many=True)
    comments = CommentSerializer(many=True)
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = (
            'pk', 'title', 'description', 'project', 'executor', 'manager', 'author', 'deadline',
            'planned_work_hours', 'participants', 'tags', 'status', 'work_hours', 'comments',
            'status_display',
        )

    @staticmethod
    def get_status_display(obj):
        return obj.get_status_display()


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'password', 'email', 'skype', 'telegram')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data.get('name'),
            email=validated_data.get('email'),
            password=validated_data.get('password'),
            skype=validated_data.get('skype'),
            telegram=validated_data.get('telegram'),
        )
        return user

    @staticmethod
    def validate_name(username):
        # добавить валидацию
        return username

    @staticmethod
    def validate_email(email):
        # добавить валидацию
        return email

    @staticmethod
    def validate_password(password):
        # добавить валидацию
        return password


class CreateTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            'pk', 'title', 'description', 'project', 'executor', 'manager', 'author', 'deadline', 'planned_work_hours',
        )


class CreateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = (
            'pk', 'name', 'description', 'company', 'creator',
        )


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('pk', 'text', 'user', 'task')


class LoginUserSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError(_("Неверно указан email или пароль"))


class BaseSelectSerializer(serializers.ModelSerializer):
    key = serializers.SerializerMethodField()
    text = serializers.SerializerMethodField()

    @staticmethod
    def get_key(obj):
        return obj.pk


class TagSelectSerializer(BaseSelectSerializer):

    class Meta:
        model = Tag
        fields = ('key', 'text')

    @staticmethod
    def get_text(obj):
        return obj.title


class ProjectSelectSerializer(BaseSelectSerializer):

    class Meta:
        model = Project
        fields = ('key', 'text')

    @staticmethod
    def get_text(obj):
        return obj.name


class UserSelectSerializer(BaseSelectSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('key', 'text', 'avatar_url')

    @staticmethod
    def get_text(obj):
        return obj.name

    @staticmethod
    def get_avatar_url(obj):
        return obj.avatar_url
