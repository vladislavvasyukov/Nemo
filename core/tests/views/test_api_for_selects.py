import pytest
from django.urls import reverse

from core.tests.factories import TagFactory, UserFactory, ProjectFactory


@pytest.mark.django_db
def test_api_tags_select(client):
    """
    Тест получения options для select-а с тегами
    """

    TagFactory(title='tag11')
    TagFactory(title='tag111')
    TagFactory(title='tag22')

    data = {
        'q': '11',
    }

    response = client.get(reverse('api-tags-select'), data=data)

    assert response.status_code == 200
    assert len(response.data) == 2


@pytest.mark.django_db
def test_api_users_select(client):
    """
    Тест получения options для select-а с пользователями
    """

    UserFactory(name='user_aaa')
    UserFactory(name='user_bbb')
    UserFactory(name='user_bb_aa')

    data = {
        'q': 'bb',
    }

    response = client.get(reverse('api-users-select'), data=data)

    assert response.status_code == 200
    assert len(response.data) == 2


@pytest.mark.django_db
def test_api_projects_select(client):
    """
    Тест получения options для select-а с проектами
    """

    ProjectFactory(name='Google')
    ProjectFactory(name='Amazon')
    ProjectFactory(name='Yandex')

    data = {
        'q': 'o',
    }

    response = client.get(reverse('api-projects-select'), data=data)

    assert response.status_code == 200
    assert len(response.data) == 2
