import os
import uuid
from io import StringIO

import magic
from sqlalchemy import Column, Integer, String, ForeignKey, Text, ARRAY, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy_utils import EmailType

import settings
from models import Base


class Email(Base):
    __tablename__ = 'emails'

    id = Column(Integer, primary_key=True, autoincrement=True)
    body = Column(Text)
    subject = Column(String(255))
    sender = Column(EmailType)
    error = Column(Text)
    send_date = Column(DateTime)
    bcc = Column(ARRAY(EmailType))
    to = Column(ARRAY(EmailType))
    cc = Column(ARRAY(EmailType))


class EmailAttachment(Base):
    __tablename__ = 'email_attachments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    path = Column(String(255), nullable=False)
    filename = Column(String(255))

    email_id = Column(Integer, ForeignKey('emails.id'))
    email = relationship("Email", back_populates="attachments")

    @property
    def file(self):
        if not os.path.exists(self.absolute_path):
            return StringIO("")
        with open(self.absolute_path) as f:
            return StringIO(f.read())

    @file.setter
    def file(self, f):
        f.seek(os.SEEK_SET)
        path = os.path.join(settings.MEDIA_PATH, str(uuid.uuid4()))
        with open(path, 'wb') as f_w:
            f_w.write(f.read())
        f.seek(os.SEEK_SET)
        self.path = path

    @property
    def absolute_path(self):
        return os.path.join(settings.BASE_DIR, self.path)

    @property
    def url(self):
        return "/file/{}".format(self.id)

    @property
    def mimetype(self):
        if not os.path.exists(self.absolute_path):
            return None
        return magic.from_file(self.absolute_path, True)
