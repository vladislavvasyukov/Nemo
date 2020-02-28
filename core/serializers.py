from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from rest_framework import serializers

from core.models import Task

User = get_user_model()


class TaskSerializerShort(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description',)


class CreateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name', 'password', 'email', 'skype', 'telegram')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            name=validated_data['name'],
            email=validated_data['email'],
            password=validated_data['password'],
            skype=validated_data['skype'],
            telegram=validated_data['telegram'],
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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'name')


class LoginUserSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        print(user, user.is_active if hasattr(user, 'is_active') else '--------------')
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")
