from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..db import crud, schemas
from ..db.database import SessionLocal
from ..main import get_current_user
from ..mesh_logic.routing_ai import optimize_route

router = APIRouter(prefix="/mesh")

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/health", response_model=dict)
async def get_mesh_health(current_user: schemas.User = Depends(get_current_user)):
    # Simulate mesh health metrics
    return {"status": "healthy", "latency_avg_ms": 120, "packet_loss_rate": 0.05, "active_routes": 5}

@router.get("/topology", response_model=dict)
async def get_mesh_topology(current_user: schemas.User = Depends(get_current_user)):
    # Simulate mesh topology data for D3.js visualization
    return {
        "nodes": [
            {"id": "gateway", "group": 0, "x": 0, "y": 0},
            {"id": "node_alpha", "group": 1, "x": 100, "y": 50},
            {"id": "node_beta", "group": 1, "x": -50, "y": 120},
            {"id": "node_gamma", "group": 1, "x": 150, "y": -80}
        ],
        "links": [
            {"source": "gateway", "target": "node_alpha", "value": 1},
            {"source": "gateway", "target": "node_beta", "value": 1},
            {"source": "node_alpha", "target": "node_gamma", "value": 1}
        ]
    }

@router.post("/optimize-route/{node_uuid}", response_model=dict)
async def optimize_node_route(node_uuid: str, current_route: list, current_user: schemas.User = Depends(get_current_user)):
    if not current_user.role == "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to optimize routes")
    optimized_route = await optimize_route(node_uuid, current_route)
    return {"node_uuid": node_uuid, "optimized_route": optimized_route}