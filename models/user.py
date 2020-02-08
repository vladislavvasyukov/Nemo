from sqlalchemy import Boolean, Column, Integer, String, ForeignKey
from models import Base

from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    is_admin = Column(Boolean, default=False)

    password = Column(String(255))

    telegram = Column(String(255), nullable=True)
    skype = Column(String(255), nullable=True)

    company_id = Column(Integer, ForeignKey('companies.id'))
    company = relationship("Company", back_populates="users")
