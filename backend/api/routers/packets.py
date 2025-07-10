from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime

from ..db import crud, models, schemas
from ..db.database import SessionLocal

router = APIRouter()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/packets/", response_model=schemas.Packet)
def create_packet(packet: schemas.PacketCreate, db: Session = Depends(get_db)):
    return crud.create_packet(db=db, packet=packet)

@router.get("/packets/", response_model=list[schemas.Packet])
def read_packets(
    skip: int = 0,
    limit: int = 100,
    node_id: str | None = Query(None, description="Filter by node ID"),
    start_time: datetime | None = Query(None, description="Filter by start time (ISO 8601)"),
    end_time: datetime | None = Query(None, description="Filter by end time (ISO 8601)"),
    db: Session = Depends(get_db)
):
    return crud.get_packets(db, skip=skip, limit=limit, node_id=node_id, start_time=start_time, end_time=end_time)