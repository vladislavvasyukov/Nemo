from random import randint

import factory.fuzzy
import faker

from core.models import Email, EmailAttachment

faker = faker.Faker()


class EmailFactory(factory.django.DjangoModelFactory):
    body = factory.LazyFunction(lambda: faker.text(max_nb_chars=500))
    subject = factory.Faker("sentence", nb_words=5, variable_nb_words=True)
    to = factory.Sequence(lambda x: [faker.free_email() for _ in range(randint(1, 4))])
    cc = factory.Sequence(lambda x: [faker.free_email() for _ in range(randint(1, 4))])
    bcc = factory.Sequence(lambda x: [faker.free_email() for _ in range(randint(1, 4))])
    sender = factory.Faker('free_email')

    class Meta:
        model = Email

    @factory.post_generation
    def attachments(self, create, extracted, **kwargs):
        if not create:
            return

        attachments = extracted or [EmailAttachmentFactory(email=self)]
        for attachment in attachments:
            self.attachments.add(attachment)


class EmailAttachmentFactory(factory.django.DjangoModelFactory):
    email = factory.SubFactory(Email)
    filename = factory.Faker("file_name")
    file = factory.django.FileField(data=b"test data")

    class Meta:
        model = EmailAttachment
