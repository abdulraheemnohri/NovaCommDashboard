from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import crud, schemas
from ..db.database import SessionLocal
from ..main import get_current_user

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@router.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view users")
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@router.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin and current_user.id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this user")
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

@router.put("/users/{user_id}/admin", response_model=schemas.User)
def update_user_admin_status(user_id: int, is_admin: bool, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to change admin status")
    db_user = crud.update_user_admin_status(db, user_id, is_admin)
    if db_user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return db_user

@router.post("/users/request-password-reset")
def request_password_reset(request: schemas.PasswordResetRequest, db: Session = Depends(get_db)):
    token = crud.generate_password_reset_token(db, request.email)
    if not token:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User with that email not found")
    # In a real application, you would send this token via email to the user
    print(f"Password reset token for {request.email}: {token}")
    return {"message": "Password reset email sent (simulated)", "token": token} # Return token for testing

@router.post("/users/reset-password")
def reset_password(reset: schemas.PasswordReset, db: Session = Depends(get_db)):
    user = crud.reset_password_with_token(db, reset.token, reset.new_password)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired token")
    return {"message": "Password reset successfully"}
