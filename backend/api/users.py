from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import crud, schemas
from ..db.database import SessionLocal
from ..main import get_current_user

router = APIRouter(prefix="/users")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to create users")
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@router.get("/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view users")
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin" and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this user")
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

@router.put("/{user_id}/role", response_model=schemas.User)
def update_user_role(user_id: int, role: str, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to change user roles")
    db_user = crud.update_user_role(db, user_id, role)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

@router.post("/request-password-reset")
def request_password_reset(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    token = crud.generate_password_reset_token(db, request.email)
    if not token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User with that email not found")
    print(f"Password reset token for {request.email}: {token}")
    return {"message": "Password reset email sent (simulated)", "token": token} # Return token for testing

@router.post("/reset-password")
def reset_password(reset: schemas.PasswordReset, db: Session = Depends(get_db)):
    user = crud.reset_password_with_token(db, reset.token, reset.new_password)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    return {"message": "Password reset successfully"}