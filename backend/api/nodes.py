from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import crud, schemas
from ..db.database import SessionLocal
from ..main import get_current_user
from ..mesh_logic.mode_switcher import switch_node_mode

router = APIRouter(prefix="/nodes")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Node)
def create_node(node: schemas.NodeCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin": # Check for admin role
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to create nodes")
    db_node = crud.get_node_by_uuid(db, uuid=node.uuid)
    if db_node:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Node already registered")
    return crud.create_node(db=db, node=node)

@router.get("/", response_model=list[schemas.Node])
def read_nodes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    nodes = crud.get_nodes(db, skip=skip, limit=limit)
    return nodes

@router.get("/{node_uuid}", response_model=schemas.Node)
def read_node(node_uuid: str, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_node = crud.get_node_by_uuid(db, uuid=node_uuid)
    if db_node is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Node not found")
    return db_node

@router.post("/{node_uuid}/command")
def send_node_command(node_uuid: str, command: dict, current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin": # Check for admin role
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to send commands")
    print(f"Received command for node {node_uuid}: {command['command']}")
    return {"message": f"Command '{command['command']}' sent to node {node_uuid} (simulated)"}

@router.post("/{node_uuid}/configure", response_model=schemas.Node)
def configure_node(node_uuid: str, config: dict, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin": # Check for admin role
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to configure nodes")
    db_node = crud.update_node(db, node_uuid, {"configuration": config})
    if db_node is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Node not found")
    print(f"Received configuration for node {node_uuid}: {config}")
    return db_node

@router.get("/{node_uuid}/configuration", response_model=dict)
def get_node_configuration(node_uuid: str, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_node = crud.get_node_by_uuid(db, uuid=node_uuid)
    if db_node is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Node not found")
    return db_node.configuration or {}

@router.post("/{node_uuid}/reboot")
def reboot_node(node_uuid: str, current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin": # Check for admin role
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to reboot nodes")
    print(f"Received reboot command for node {node_uuid}")
    return {"message": f"Node {node_uuid} reboot command sent (simulated)"}

@router.post("/{node_uuid}/firmware-update")
def firmware_update_node(node_uuid: str, current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin": # Check for admin role
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to trigger firmware updates")
    print(f"Received firmware update command for node {node_uuid}")
    return {"message": f"Node {node_uuid} firmware update command sent (simulated)"}

@router.delete("/{node_uuid}")
def delete_node(node_uuid: str, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin": # Check for admin role
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete nodes")
    db_node = crud.get_node_by_uuid(db, uuid=node_uuid)
    if db_node is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Node not found")
    crud.delete_node(db=db, uuid=node_uuid)
    return {"message": f"Node {node_uuid} deleted successfully"}

@router.post("/{node_uuid}/mode")
async def set_node_mode(node_uuid: str, mode: dict, current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin": # Check for admin role
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to change node mode")
    success = await switch_node_mode(node_uuid, mode.get("mode"))
    if not success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to switch node mode")
    # Update node's mode in DB
    crud.update_node(db, node_uuid, {"mode": mode.get("mode")})
    return {"message": f"Node {node_uuid} mode switched to {mode.get("mode")} (simulated)"}