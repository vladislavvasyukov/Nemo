import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.models import Company
from core.tests.factories import UserFactory, TaskFactory, ProjectFactory


@pytest.mark.django_db
def test_create_task(client):
    """
    Тест создания задачи
    """

    user1 = UserFactory()
    token = AuthToken.objects.create(user1)[1]
    project = ProjectFactory()

    data = {
        'executor': user1.pk,
        'manager': user1.pk,
        'author': user1.pk,
        'title': 'text-task',
        'project': project.pk,
        'description': 'description',
    }

    response = client.post(reverse('create-task'), data=data, HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200


@pytest.mark.django_db
def test_update_task(client):
    """
    Тест изменения задачи
    """

    user1 = UserFactory()
    token = AuthToken.objects.create(user1)[1]
    task = TaskFactory()

    data = {
        'executor': task.executor.pk,
        'manager': task.manager.pk,
        'author': task.pk,
        'title': 'text-task',
        'project': task.project.pk,
        'description': task.description,
        'task_id': task.pk,
    }

    response = client.post(reverse('create-task'), data=data, HTTP_AUTHORIZATION=f'Token {token}')
    task.refresh_from_db()

    assert response.status_code == 200
    assert task.title == data['title']


@pytest.mark.django_db
def test_create_comment(client):
    """
    Тест создания комментария
    """

    user = UserFactory()
    token = AuthToken.objects.create(user)[1]
    task = TaskFactory()

    data = {
        'text': 'test comment',
        'task': task.pk,
    }
    response = client.post(reverse('create-comment'), data=data, HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200
    assert task.comments.count() == 1


@pytest.mark.django_db
def test_create_company(client):
    """
    Тест создания компании
    """

    user = UserFactory()
    token = AuthToken.objects.create(user)[1]
    data = {
        'name': 'Google',
    }

    response = client.post(reverse('create-company'), data=data, HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200

    company = Company.objects.get(name=data['name'], creator=user)
    assert company.name == data['name']
    assert company.creator_id == user.pk
    assert user.companies.filter(pk=company.pk).exists()
