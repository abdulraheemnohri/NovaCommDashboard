from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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

@router.post("/nodes/", response_model=schemas.Node)
def create_node(node: schemas.NodeCreate, db: Session = Depends(get_db)):
    db_node = crud.get_node_by_node_id(db, node_id=node.node_id)
    if db_node:
        raise HTTPException(status_code=400, detail="Node already registered")
    return crud.create_node(db=db, node=node)

@router.get("/nodes/", response_model=list[schemas.Node])
def read_nodes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    nodes = crud.get_nodes(db, skip=skip, limit=limit)
    return nodes

@router.get("/nodes/{node_id}", response_model=schemas.Node)
def read_node(node_id: str, db: Session = Depends(get_db)):
    db_node = crud.get_node_by_node_id(db, node_id=node_id)
    if db_node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return db_node

@router.post("/nodes/{node_id}/command")
def send_node_command(node_id: str, command: dict):
    print(f"Received command for node {node_id}: {command['command']}")
    return {"message": f"Command '{command['command']}' sent to node {node_id} (simulated)"}

@router.post("/nodes/{node_id}/configure", response_model=schemas.Node)
def configure_node(node_id: str, config: dict, db: Session = Depends(get_db)):
    db_node = crud.update_node_configuration(db, node_id, config)
    if db_node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    print(f"Received configuration for node {node_id}: {config}")
    return db_node

@router.get("/nodes/{node_id}/configuration", response_model=dict)
def get_node_configuration(node_id: str, db: Session = Depends(get_db)):
    db_node = crud.get_node_by_node_id(db, node_id=node_id)
    if db_node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    return db_node.configuration or {}

@router.post("/nodes/{node_id}/reboot")
def reboot_node(node_id: str):
    print(f"Received reboot command for node {node_id}")
    return {"message": f"Node {node_id} reboot command sent (simulated)"}

@router.post("/nodes/{node_id}/firmware-update")
def firmware_update_node(node_id: str):
    print(f"Received firmware update command for node {node_id}")
    return {"message": f"Node {node_id} firmware update command sent (simulated)"}

@router.delete("/nodes/{node_id}")
def delete_node(node_id: str, db: Session = Depends(get_db)):
    db_node = crud.get_node_by_node_id(db, node_id=node_id)
    if db_node is None:
        raise HTTPException(status_code=404, detail="Node not found")
    crud.delete_node(db=db, node_id=node_id)
    return {"message": f"Node {node_id} deleted successfully"}
