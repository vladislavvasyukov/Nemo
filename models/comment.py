from models import Base
from sqlalchemy import Column, Integer


class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, autoincrement=True)
    text = Column(String(128), nullable=False)
