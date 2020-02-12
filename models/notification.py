from sqlalchemy import Column, Integer, PrimaryKeyConstraint, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from models import Base


class Notification(Base):
    __tablename__ = 'notifications'
    __table_args__ = (
        PrimaryKeyConstraint('comment_id', 'user_id', name='_notification_uc'),
    )
    
    comment_id = Column(Integer, ForeignKey('comments.id'))
    comment = relationship("Comment", back_populates="notifications")

    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="notifications")

    date_created = Column(DateTime(timezone=True))
    date_read = Column(DateTime(timezone=True))
