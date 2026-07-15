from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime, UTC
import os
from dotenv import load_dotenv


load_dotenv()


Base=declarative_base()


class User(Base):
    __tablename__="users"
    id =Column(Integer, primary_key=True)
    email= Column(String(255), unique=True, nullable=False)
    password_hash= Column(String(255), nullable=False)
    name= Column(String(255), nullable=True)
    is_active= Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(UTC))
    last_login_at = Column(DateTime, nullable=True)


def get_engine():
    db_url = os.getenv("DATABASE_URL", "sqlite:///./marketguard.db")
    return create_engine(db_url, echo=False)


def get_session():
    engine=get_engine()
    Session=sessionmaker(bind=engine)
    return Session()


def init_db():
    engine=get_engine()
    Base.metadata.create_all(engine)
    print("Database tables created")


if __name__ == "__main__":
    init_db()

from sqlalchemy import Column, Integer, Float, String, DateTime, Text, JSON, Boolean

class Stock(Base):
    __tablename__ = "stocks"
    id = Column(Integer, primary_key=True)
    symbol = Column(String(20), unique=True, nullable=False)
    name = Column(String(20))
    is_active = Column(Boolean, default= True)
    created_at= Column(DateTime, default = datetime.utcnow)


class StockPrice(Base):
    __tablename__ = "stock_price"
    id = Column(Integer, primary_key=True)
    symbol= Column(String(20), nullable=False)
    open = Column(Float)
    high = Column(Float)
    low= Column(Float)
    close = Column(Float)
    volume = Column(Float)
    timestamp= Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class NewsArticle(Base):
    __tablename__ = "news_articles"
    id= Column(Integer, primary_key=True)
    symbol= Column(String(20))
    title = Column(String(500))
    url = Column(String(500), unique=True)
    source = Column(String(100))
    pump_score = Column(Float, default= 0)
    published_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    __tablename__ = "alerts"
    id  = Column(Integer, primary_key=True)
    symbol = Column(String)
    risk_score = Column(Float)
    risk_level = Column(String(20))
    pattern = Column(Text)
    description = Column(Text, nullable=False)
    is_resolved = Column(Boolean, default = False)
    created_at = Column(DateTime, default=datetime.utcnow)

