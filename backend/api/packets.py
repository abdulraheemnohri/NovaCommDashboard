from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from datetime import datetime

from ..db import crud, schemas
from ..db.database import SessionLocal
from ..main import get_current_user

router = APIRouter(prefix="/packets")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Packet)
def create_packet(packet: schemas.PacketCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # Packets are typically created by the MQTT bridge, but an API endpoint can be useful for testing/manual injection
    if not current_user.role == "admin": # Only admins can manually create packets
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to create packets")
    return crud.create_packet(db=db, packet=packet)

@router.get("/", response_model=list[schemas.Packet])
def read_packets(
    skip: int = 0,
    limit: int = 100,
    node_uuid: str | None = Query(None, description="Filter by node UUID"),
    start_time: datetime | None = Query(None, description="Filter by start time (ISO 8601)"),
    end_time: datetime | None = Query(None, description="Filter by end time (ISO 8601)"),
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    # Anyone can view packets for now, but could be restricted by role
    return crud.get_packets(db, skip=skip, limit=limit, node_id=node_uuid, start_time=start_time, end_time=end_time)
