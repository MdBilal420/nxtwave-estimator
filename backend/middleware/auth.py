import os
import json
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key-for-development-only")
JWT_ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 1 week

security = HTTPBearer()

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Create a new JWT token"""
    to_encode = data.copy()
    
    # Set expiration
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    
    # Create token
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Dict[str, Any]:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current user from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    
    # Extract user information from token
    email = payload.get("sub")
    is_admin = payload.get("is_admin", False)
    
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return {"email": email, "is_admin": is_admin}

async def verify_admin(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify that the current user is an admin"""
    token = credentials.credentials
    payload = decode_token(token)
    
    # Check if user is admin
    is_admin = payload.get("is_admin", False)
    
    if not is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return True 