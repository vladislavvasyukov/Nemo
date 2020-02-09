from sqlalchemy import Boolean, Column, Integer, String, ForeignKey, Unicode, DateTime
from models import Base

from sqlalchemy.orm import relationship, composite
from sqlalchemy_utils import EmailType, PhoneNumber


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)

    password = Column(String(255))

    email = Column(EmailType)
    telegram = Column(String(255), nullable=True)
    skype = Column(String(255), nullable=True)

    _phone_number = Column(Unicode(20))
    country_code = Column(Unicode(8))
    phonenumber = composite(PhoneNumber, _phone_number, country_code)

    company_id = Column(Integer, ForeignKey('companies.id'))
    company = relationship("Company", back_populates="users")

    date_deleted = Column(DateTime(timezone=True))
