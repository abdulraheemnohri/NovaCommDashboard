from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session

from ..db import crud, schemas
from ..db.database import SessionLocal
from ..main import get_current_user
from ..ota_manager import ota_manager

router = APIRouter(prefix="/ota")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/upload", response_model=schemas.Firmware)
async def upload_firmware(
    version: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    if not current_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to upload firmware")
    
    db_firmware = crud.get_firmware_by_version(db, version=version)
    if db_firmware:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Firmware version already exists")

    file_content = await file.read()
    file_location = await ota_manager.upload_firmware(file.filename, file_content)

    firmware_create = schemas.FirmwareCreate(version=version, filename=file.filename)
    return crud.create_firmware_version(db=db, firmware=firmware_create)

@router.post("/deploy", response_model=dict)
async def deploy_firmware(
    node_uuid: str,
    firmware_version: str,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    if not current_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to deploy firmware")
    
    # Create an OTA task in the database
    ota_task_create = schemas.OTATaskCreate(
        node_id=node_uuid,
        firmware_version=firmware_version,
        status="pending",
        file_url=f"/ota/{firmware_version}" # Simulate URL to firmware
    )
    ota_task = crud.create_ota_task(db, ota_task_create)

    success = await ota_manager.deploy_firmware(node_uuid, firmware_version)
    if not success:
        # Update OTA task status to failed
        crud.update_ota_task_progress(db, ota_task.id, 0.0, "failed")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Firmware deployment failed")
    
    # Update OTA task status to in_progress (simulated)
    crud.update_ota_task_progress(db, ota_task.id, 10.0, "in_progress")

    return {"message": f"Firmware {firmware_version} deployment initiated for node {node_uuid}", "ota_task_id": ota_task.id}

@router.get("/status/{node_uuid}", response_model=dict)
async def get_ota_status(node_uuid: str, current_user: schemas.User = Depends(get_current_user)):
    status = await ota_manager.get_firmware_status(node_uuid)
    return status

@router.get("/", response_model=list[schemas.Firmware])
def get_firmware_versions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    firmware_versions = crud.get_firmware_versions(db, skip=skip, limit=limit)
    return firmware_versions