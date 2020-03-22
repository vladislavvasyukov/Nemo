import pytest
from django.urls import reverse
from knox.models import AuthToken

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
def test_create_comment(client):
    """
    Тест создания комментария
    """

    user1 = UserFactory()
    token = AuthToken.objects.create(user1)[1]
    task = TaskFactory()

    data = {
        'text': 'test comment',
        'task': task.pk,
    }
    response = client.post(reverse('create-comment'), data=data, HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200
    assert task.comments.count() == 1
