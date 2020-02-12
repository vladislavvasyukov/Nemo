from sqlalchemy import Column, Integer, String

from models import Base


class Tag(Base):
    __tablename__ = 'tags'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(128), nullable=False)
