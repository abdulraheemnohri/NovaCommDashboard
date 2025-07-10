from sqlalchemy.orm import Session
from . import models, schemas
import datetime
from passlib.context import CryptContext
import secrets # For generating secure tokens

# Import broadcast_update from websocket_handler
from ..websocket_handler import broadcast_update
import asyncio

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Node CRUD
def get_node(db: Session, node_id: int):
    return db.query(models.Node).filter(models.Node.id == node_id).first()

def get_node_by_uuid(db: Session, uuid: str):
    return db.query(models.Node).filter(models.Node.uuid == uuid).first()

def get_nodes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Node).offset(skip).limit(limit).all()

def create_node(db: Session, node: schemas.NodeCreate):
    db_node = models.Node(
        uuid=node.uuid,
        name=node.name,
        lat=node.lat,
        lng=node.lng,
        mode=node.mode,
        tx_power=node.tx_power,
        freq=node.freq,
        bandwidth=node.bandwidth,
        ai_model=node.ai_model,
        firmware=node.firmware,
        configuration=node.configuration
    )
    db.add(db_node)
    db.commit()
    db.refresh(db_node)
    asyncio.run(broadcast_update("new_node", schemas.Node.from_orm(db_node).dict()))
    return db_node

def update_node(db: Session, node_uuid: str, node_update: dict):
    db_node = get_node_by_uuid(db, node_uuid)
    if db_node:
        for key, value in node_update.items():
            setattr(db_node, key, value)
        db.commit()
        db.refresh(db_node)
        asyncio.run(broadcast_update("node_update", schemas.Node.from_orm(db_node).dict()))
        return db_node
    return None

def delete_node(db: Session, uuid: str):
    db_node = db.query(models.Node).filter(models.Node.uuid == uuid).first()
    if db_node:
        db.delete(db_node)
        db.commit()
        asyncio.run(broadcast_update("node_deleted", {"uuid": uuid}))
        return True
    return False

# Packet CRUD
def get_packets(db: Session, skip: int = 0, limit: int = 100, node_id: str = None, start_time: datetime.datetime = None, end_time: datetime.datetime = None):
    query = db.query(models.Packet)
    if node_id:
        query = query.filter(models.Packet.node_id == node_id)
    if start_time:
        query = query.filter(models.Packet.timestamp >= start_time)
    if end_time:
        query = query.filter(models.Packet.timestamp <= end_time)
    return query.offset(skip).limit(limit).all()

def create_packet(db: Session, packet: schemas.PacketCreate):
    db_packet = models.Packet(**packet.dict())
    db.add(db_packet)
    db.commit()
    db.refresh(db_packet)
    # Update the associated node's last_seen and status
    db_node = get_node_by_uuid(db, packet.node_id) # Assuming node_id in packet is actually uuid
    if db_node:
        db_node.last_seen = datetime.datetime.utcnow()
        db_node.status = "online"
        db.commit()
        db.refresh(db_node)
        asyncio.run(broadcast_update("node_update", schemas.Node.from_orm(db_node).dict()))
    asyncio.run(broadcast_update("new_packet", schemas.Packet.from_orm(db_packet).dict()))
    return db_packet

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password, role="viewer") # Default role
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_role(db: Session, user_id: int, role: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user:
        db_user.role = role
        db.commit()
        db.refresh(db_user)
        return db_user
    return None

def generate_password_reset_token(db: Session, email: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    token = secrets.token_urlsafe(32)
    expires = datetime.datetime.utcnow() + datetime.timedelta(hours=1) # Token valid for 1 hour
    user.password_reset_token = token
    user.password_reset_expires = expires
    db.commit()
    db.refresh(user)
    return token

def reset_password_with_token(db: Session, token: str, new_password: str):
    user = db.query(models.User).filter(models.User.password_reset_token == token).first()
    if not user or user.password_reset_expires < datetime.datetime.utcnow():
        return None # Invalid or expired token
    
    user.hashed_password = get_password_hash(new_password)
    user.password_reset_token = None
    user.password_reset_expires = None
    db.commit()
    db.refresh(user)
    return user

# Firmware CRUD (renamed to OTATask for consistency with blueprint)
def get_firmware_versions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.OTATask).offset(skip).limit(limit).all()

def create_firmware_version(db: Session, firmware: schemas.FirmwareCreate):
    db_firmware = models.OTATask(version=firmware.version, filename=firmware.filename) # This needs adjustment
    db.add(db_firmware)
    db.commit()
    db.refresh(db_firmware)
    return db_firmware

def get_firmware_by_version(db: Session, version: str):
    return db.query(models.OTATask).filter(models.OTATask.version == version).first()

# OTA Task CRUD
def get_ota_tasks(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.OTATask).offset(skip).limit(limit).all()

def create_ota_task(db: Session, ota_task: schemas.OTATaskCreate):
    db_ota_task = models.OTATask(**ota_task.dict())
    db.add(db_ota_task)
    db.commit()
    db.refresh(db_ota_task)
    asyncio.run(broadcast_update("new_ota_task", schemas.OTATask.from_orm(db_ota_task).dict()))
    return db_ota_task

def update_ota_task_progress(db: Session, task_id: int, progress: float, status: str = None):
    db_task = db.query(models.OTATask).filter(models.OTATask.id == task_id).first()
    if db_task:
        db_task.progress = progress
        if status: db_task.status = status
        if progress >= 100.0 and status != "failed": db_task.status = "completed"; db_task.end_time = datetime.datetime.utcnow()
        db.commit()
        db.refresh(db_task)
        asyncio.run(broadcast_update("ota_task_update", schemas.OTATask.from_orm(db_task).dict()))
        return db_task
    return None

# Job CRUD
def get_jobs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Job).offset(skip).limit(limit).all()

def create_job(db: Session, job: schemas.JobCreate):
    db_job = models.Job(**job.dict())
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    asyncio.run(broadcast_update("new_job", schemas.Job.from_orm(db_job).dict()))
    return db_job

def delete_job(db: Session, job_id: int):
    db_job = db.query(models.Job).filter(models.Job.id == job_id).first()
    if db_job:
        db.delete(db_job)
        db.commit()
        asyncio.run(broadcast_update("job_deleted", {"id": job_id}))
        return True
    return False

# Alert CRUD
def get_alerts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Alert).offset(skip).limit(limit).all()

def create_alert(db: Session, alert: schemas.AlertCreate):
    db_alert = models.Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    asyncio.run(broadcast_update("new_alert", schemas.Alert.from_orm(db_alert).dict()))
    return db_alert

def resolve_alert(db: Session, alert_id: int):
    db_alert = db.query(models.Alert).filter(models.Alert.id == alert_id).first()
    if db_alert:
        db_alert.is_resolved = True
        db.commit()
        db.refresh(db_alert)
        asyncio.run(broadcast_update("alert_updated", schemas.Alert.from_orm(db_alert).dict()))
        return db_alert
    return None

# AI Log CRUD
def get_ai_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.AILog).offset(skip).limit(limit).all()

def create_ai_log(db: Session, ai_log: schemas.AILogCreate):
    db_ai_log = models.AILog(**ai_log.dict())
    db.add(db_ai_log)
    db.commit()
    db.refresh(db_ai_log)
    asyncio.run(broadcast_update("new_ai_log", schemas.AILog.from_orm(db_ai_log).dict()))
    return db_ai_log