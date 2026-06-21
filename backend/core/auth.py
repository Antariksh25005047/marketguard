import os
import jwt
from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from fastapi import  Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
from backend.core.models import User, get_session


load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "marketguard2026")
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60*27*7
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool : 
    return pwd_context.verify(plain, hashed)

def create_token(user_id: int, email:str) -> str:
    expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    payload= {"sub": str(user_id), "email": email, "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> Optional[dict]:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except Exception:
        return None

def create_user(email: str, password: str, name: str = "") -> User:
    session = get_session()
    try:
        existing = session.query(User).filter_by(email=email.lower()).first()
        if existing:
            raise ValueError("Email already registered")
        user = User(
            email         = email.lower(),
            password_hash = hash_password(password),
            name          = name or email.split("@")[0],
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        return user
    finally:
        session.close()


def authenticate_user(email: str, password: str) -> Optional[User]:
    session = get_session()
    try:
        user = session.query(User).filter_by(email=email.lower()).first()
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        user.last_login_at = datetime.utcnow()
        session.commit()
        session.refresh(user)
        return user
    finally:
        session.close()


async def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> User:
    error = HTTPException(
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail      = "Not logged in or session expired",
        headers     = {"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise error

    payload = decode_token(token)
    if not payload:
        raise error

    session = get_session()
    try:
        user = session.query(User).filter_by(id=int(payload["sub"])).first()
        if not user or not user.is_active:
            raise error
        session.expunge(user)
        return user
    finally:
        session.close()
