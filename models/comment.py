from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from models import Base


class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(String(128), nullable=False)
    date = Column(DateTime(timezone=True))

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="comments")

    task_id = Column(Integer, ForeignKey('tasks.id'))
    task = relationship("Task", back_populates="comments")
