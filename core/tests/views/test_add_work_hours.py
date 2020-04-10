import pytest
from django.urls import reverse
from knox.models import AuthToken

from core.tests.factories import UserFactory, TaskFactory


@pytest.mark.django_db
class TestAddWorkHours:
    """
    Класс для тестирования отметки потраченного времени
    """
    pytestmark = pytest.mark.django_db

    def test_add_works_hours_successful(self, mocker, client) -> None:
        """
        Тест удачной отметки потраченного времени
        """

        task = TaskFactory()
        user_one = UserFactory()
        token = AuthToken.objects.create(user_one)[1]

        data = self.__get_data(task, False)

        response = client.post(reverse('add_work_hours'), data=data, HTTP_AUTHORIZATION=f'Token {token}')
        task.refresh_from_db()

        assert response.status_code == 200
        assert task.work_hours == 1.5

    def test_add_works_hours_failed(self, mocker, client) -> None:
        """
        Тест неудачной отметки потраченного времени
        """

        task = TaskFactory()
        user_one = UserFactory()
        token = AuthToken.objects.create(user_one)[1]

        data = self.__get_data(task, True)

        response = client.post(reverse('add_work_hours'), data=data, HTTP_AUTHORIZATION=f'Token {token}')
        task.refresh_from_db()

        assert response.status_code == 400

    @staticmethod
    def __get_data(task, minus_work_time):
        return {
            'work_date': '',
            'hours': 1,
            'minutes': 30,
            'minus_work_time': minus_work_time,
            'comment': 'test comment',
            'task_id': task.pk,
        }
