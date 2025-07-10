from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from ..db import crud, schemas
from ..db.database import SessionLocal
from ..main import get_current_user

router = APIRouter(prefix="/jobs")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.Job])
async def get_scheduled_jobs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # Anyone can view jobs for now, but could be restricted by role
    jobs = crud.get_jobs(db, skip=skip, limit=limit)
    return jobs

@router.post("/create", response_model=schemas.Job)
async def create_job(job_details: schemas.JobCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to create jobs")
    
    # Ensure schedule_time is a datetime object
    if isinstance(job_details.schedule_time, str):
        try:
            job_details.schedule_time = datetime.fromisoformat(job_details.schedule_time)
        except ValueError:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid schedule_time format. Use ISO 8601.")

    job = crud.create_job(db, job_details)
    return job

@router.delete("/{job_id}", response_model=dict)
async def delete_job(job_id: int, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete jobs")
    success = crud.delete_job(db, job_id)
    if not success:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return {"message": f"Job {job_id} deleted successfully"}