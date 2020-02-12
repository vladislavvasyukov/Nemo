import enum

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Text, PrimaryKeyConstraint
from sqlalchemy.orm import relationship, backref
from sqlalchemy_utils import ChoiceType

from models import Base


class TaskStatus(enum.Enum):
    enqueued = 1
    inprogress = 2
    to_accept = 3
    completed = 4
    canceled = 5
    rejected = 6


TaskStatus.enqueued.label = 'в очереди'
TaskStatus.inprogress.label = 'выполняется'
TaskStatus.to_accept.label = 'на проверке'
TaskStatus.completed.label = 'выполнена'
TaskStatus.canceled.label = 'отменена'
TaskStatus.rejected.label = 'отклонена'


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = name = Column(String(128), nullable=False)
    description = Column(Text)
    status = Column(ChoiceType(TaskStatus, impl=Integer()))
    deadline = Column(DateTime(timezone=True))
    work_hours = Column(Float)

    executor_id = Column(Integer, ForeignKey('users.id'))
    executor = relationship("User", back_populates="tasks")
    manager_id = Column(Integer, ForeignKey('users.id'))
    manager = relationship("User", back_populates="tasks")
    author_id = Column(Integer, ForeignKey('users.id'))
    author = relationship("User", back_populates="tasks")

    members = relationship(
        "User",
        secondary="task_members",
        secondaryjoin="and_(TaskMember.member_id == User.id, User.date_deleted.is_(None))",
        backref=backref("tasks", lazy='dynamic'),
        post_update=True,
    )

    tags = relationship(
        "Tag",
        secondary="task_tags",
        secondaryjoin="and_(TaskTag.tag_id == Tag.id)",
        backref=backref("tasks", lazy='dynamic'),
        post_update=True,
    )

    project_id = Column(Integer, ForeignKey('projects.id'))
    project = relationship("Project", back_populates="tasks")


class TaskMember(Base):
    __tablename__ = 'task_members'
    __table_args__ = (
        PrimaryKeyConstraint('task_id', 'member_id', name='_member_task_uc'),
    )

    task_id = Column(Integer, ForeignKey('tasks.id'), nullable=False)
    task = relationship('Task', back_populates='task_members', foreign_keys=task_id, post_update=True)

    member_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    member = relationship('User', back_populates='members', foreign_keys=member_id, post_update=True)


class TaskTag(Base):
    __tablename__ = 'task_tags'

    __table_args__ = (
        PrimaryKeyConstraint('task_id', 'tag_id', name='_tag_task_uc'),
    )

    task_id = Column(Integer, ForeignKey('tasks.id'), nullable=False)
    task = relationship('Task', back_populates='task_tags', foreign_keys=task_id, post_update=True)

    tag_id = Column(Integer, ForeignKey('tags.id'), nullable=False)
    tag = relationship('Tag', back_populates='tags', foreign_keys=tag_id, post_update=True)
