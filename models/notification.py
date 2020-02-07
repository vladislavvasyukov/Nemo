from models import Base
from sqlalchemy import Column, Integer


class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, autoincrement=True)
