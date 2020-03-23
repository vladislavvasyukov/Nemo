import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.tests.factories import UserFactory, TaskFactory


@pytest.mark.django_db
def test_save_description(client):
    """
    Тест сохранение описания задачи
    """

    user1 = UserFactory()
    token = AuthToken.objects.create(user1)[1]
    task = TaskFactory()

    data = {
        'description': 'my new description',
        'task_id': task.pk,
    }
    response = client.post(reverse('save-description'), data=data, HTTP_AUTHORIZATION=f'Token {token}')

    task.refresh_from_db()

    assert response.status_code == 200
    assert task.description == data['description']
