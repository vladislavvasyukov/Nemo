from models import Base
from sqlalchemy import Column, Integer, String


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = name = Column(String(128), nullable=False)
    description = Column(Text)
