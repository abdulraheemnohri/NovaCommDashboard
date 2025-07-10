from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON, LargeBinary, Text
from .database import Base
import datetime

class Node(Base):
    __tablename__ = "nodes"

    id = Column(Integer, primary_key=True, index=True)
    uuid = Column(String, unique=True, index=True) # Unique ID for the node
    name = Column(String, default="Unnamed Node")
    status = Column(String, default="offline")
    last_seen = Column(DateTime, default=datetime.datetime.utcnow)
    lat = Column(Float, nullable=True) # Renamed from latitude
    lng = Column(Float, nullable=True) # Renamed from longitude
    mode = Column(String, default="normal") # New field for node mode
    tx_power = Column(Integer, nullable=True)
    freq = Column(Float, nullable=True)
    bandwidth = Column(Float, nullable=True)
    ai_model = Column(String, nullable=True) # Current AI model deployed
    firmware = Column(String, nullable=True) # Current firmware version
    configuration = Column(JSON, nullable=True) # General JSON configuration

class Packet(Base):
    __tablename__ = "packets"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    payload = Column(String)
    snr = Column(Float)
    rssi = Column(Float)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    email = Column(String, unique=True, index=True, nullable=True)
    is_active = Column(Boolean, default=True)
    role = Column(String, default="viewer") # Renamed from is_admin
    password_reset_token = Column(String, nullable=True)
    password_reset_expires = Column(DateTime, nullable=True)

class OTATask(Base):
    __tablename__ = "ota_tasks"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, index=True)
    firmware_version = Column(String)
    status = Column(String, default="pending") # pending, in_progress, completed, failed
    progress = Column(Float, default=0.0)
    file_url = Column(String) # Path or URL to the firmware file
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime, nullable=True)

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, nullable=True) # Optional, for node-specific jobs
    job_type = Column(String) # e.g., "OTA", "Mode Switch", "Broadcast"
    schedule_time = Column(DateTime) # When the job is scheduled to run
    status = Column(String, default="scheduled") # scheduled, in_progress, completed, failed
    payload = Column(JSON, nullable=True) # Job-specific data (e.g., new mode, firmware version)

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, nullable=True) # Optional, if alert is node-specific
    level = Column(String) # e.g., "warning", "critical", "info"
    message = Column(Text)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    is_resolved = Column(Boolean, default=False)

class AILog(Base):
    __tablename__ = "ai_logs"

    id = Column(Integer, primary_key=True, index=True)
    node_id = Column(String, index=True)
    model_name = Column(String)
    prediction = Column(JSON) # Store prediction output as JSON
    accuracy = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)