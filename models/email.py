from models import Base
from sqlalchemy import Column, Integer


class Email(Base):
    __tablename__ = 'emails'

    id = Column(Integer, primary_key=True, autoincrement=True)


class EmailAttachment(Base):
    __tablename__ = 'email_attachments'

    id = Column(Integer, primary_key=True, autoincrement=True)
