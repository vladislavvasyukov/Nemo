from sqlalchemy import Boolean, Column, Integer, String
from models import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    is_admin = Column(Boolean, default=False)
