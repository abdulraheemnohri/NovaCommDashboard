from pydantic import BaseModel, EmailStr
import datetime
from typing import Optional

class NodeBase(BaseModel):
    uuid: str
    name: Optional[str] = None
    lat: Optional[float] = None
    lng: Optional[float] = None
    mode: Optional[str] = None
    tx_power: Optional[int] = None
    freq: Optional[float] = None
    bandwidth: Optional[float] = None
    ai_model: Optional[str] = None
    firmware: Optional[str] = None
    configuration: Optional[dict] = None

class NodeCreate(NodeBase):
    pass

class Node(NodeBase):
    id: int
    status: str
    last_seen: datetime.datetime

    class Config:
        orm_mode = True

class PacketBase(BaseModel):
    node_id: str
    payload: str
    snr: float
    rssi: float

class PacketCreate(PacketBase):
    pass

class Packet(PacketBase):
    id: int
    timestamp: datetime.datetime

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: Optional[EmailStr] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    role: str

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordReset(BaseModel):
    token: str
    new_password: str

class FirmwareBase(BaseModel):
    version: str
    filename: str

class FirmwareCreate(FirmwareBase):
    pass

class Firmware(FirmwareBase):
    id: int
    upload_date: datetime.datetime

    class Config:
        orm_mode = True

class OTATaskBase(BaseModel):
    node_id: str
    firmware_version: str
    status: Optional[str] = None
    progress: Optional[float] = None
    file_url: Optional[str] = None

class OTATaskCreate(OTATaskBase):
    pass

class OTATask(OTATaskBase):
    id: int
    start_time: datetime.datetime
    end_time: Optional[datetime.datetime] = None

    class Config:
        orm_mode = True

class JobBase(BaseModel):
    job_type: str
    schedule_time: datetime.datetime
    node_id: Optional[str] = None
    payload: Optional[dict] = None

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    status: str

    class Config:
        orm_mode = True

class AlertBase(BaseModel):
    level: str
    message: str
    node_id: Optional[str] = None

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    timestamp: datetime.datetime
    is_resolved: bool

    class Config:
        orm_mode = True

class AILogBase(BaseModel):
    node_id: str
    model_name: str
    prediction: dict
    accuracy: Optional[float] = None

class AILogCreate(AILogBase):
    pass

class AILog(AILogBase):
    id: int
    timestamp: datetime.datetime

    class Config:
        orm_mode = True
