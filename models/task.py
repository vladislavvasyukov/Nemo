from models import Base
from sqlalchemy import Column, Integer, String, ForeignKey

from sqlalchemy.orm import relationship


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = name = Column(String(128), nullable=False)
    description = Column(Text)

    executor_id = Column(Integer, ForeignKey('users.id'))
    executor = relationship("User", back_populates="tasks")
    manager_id = Column(Integer, ForeignKey('users.id'))
    manager = relationship("User", back_populates="tasks")
    author_id = Column(Integer, ForeignKey('users.id'))
    author = relationship("User", back_populates="tasks")

    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship("Project", back_populates="tasks")
