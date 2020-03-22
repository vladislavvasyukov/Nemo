import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.tests.factories import UserFactory, TaskFactory


@pytest.mark.django_db
def test_get_task(client):
    """
    Тест получения данных по задаче
    """

    user1 = UserFactory()
    token = AuthToken.objects.create(user1)[1]

    task = TaskFactory()

    response = client.get(reverse('get-task-detail', args=(task.pk, )), HTTP_AUTHORIZATION=f'Token {token}')

    assert response.status_code == 200
