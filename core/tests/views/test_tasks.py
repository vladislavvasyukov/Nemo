import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.models import Task
from core.tests.factories import UserFactory, TaskFactory


@pytest.mark.django_db
def test_get_tasks_to_execute(client):
    """
    Тест получения списка задач к исполнению
    """

    user1 = UserFactory()
    user2 = UserFactory()
    token = AuthToken.objects.create(user1)[1]

    TaskFactory(executor=user1, status=Task.Status.enqueued)
    TaskFactory(executor=user1, status=Task.Status.enqueued)
    TaskFactory(executor=user2, status=Task.Status.enqueued)

    response = client.get(reverse('tasks-list') + '?to_execute', HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200
    assert len(response.data) == 2


@pytest.mark.django_db
def test_get_manager_tasks(client):
    """
    Тест получения списка выставленных задач
    """

    user1 = UserFactory()
    user2 = UserFactory()
    token = AuthToken.objects.create(user1)[1]

    TaskFactory(manager=user1, status=Task.Status.enqueued)
    TaskFactory(manager=user1, status=Task.Status.enqueued)
    TaskFactory(manager=user2, status=Task.Status.enqueued)

    response = client.get(reverse('tasks-list'), HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200
    assert len(response.data) == 2
