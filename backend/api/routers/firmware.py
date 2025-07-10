from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
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

@router.post("/firmware/", response_model=schemas.Firmware)
def upload_firmware(
    version: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to upload firmware")
    
    db_firmware = crud.get_firmware_by_version(db, version=version)
    if db_firmware:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Firmware version already exists")

    # In a real application, you would save the file to a secure storage location
    # For now, we'll just simulate saving it.
    file_location = f"./firmware_binaries/{file.filename}"
    # with open(file_location, "wb+") as file_object:
    #     file_object.write(file.file.read())

    firmware_create = schemas.FirmwareCreate(version=version, filename=file.filename)
    return crud.create_firmware_version(db=db, firmware=firmware_create)

@router.get("/firmware/", response_model=list[schemas.Firmware])
def get_firmware_versions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    firmware_versions = crud.get_firmware_versions(db, skip=skip, limit=limit)
    return firmware_versions

@router.get("/firmware/{version}")
def download_firmware(version: str, current_user: schemas.User = Depends(get_current_user)):
    # In a real application, you would serve the actual binary file
    # For now, we'll just simulate the download.
    return {"message": f"Simulating download of firmware version {version}"}
