from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from jose import JWTError, jwt
import json
import secrets
import os
import asyncio
import threading

from .db import engine, Base, crud, schemas
from .api import auth, nodes, packets, mesh, ota, jobs, users
from .websocket_handler import manager, broadcast_update
from .utils.token import ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from .mqtt_bridge import start_mqtt_bridge # Import the MQTT bridge function

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NovaComm++ Dashboard API",
    description="API for the NovaComm LoRa Mesh Gateway and Dashboard",
    version="1.0.0",
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(nodes.router, prefix="/api/nodes", tags=["Nodes"])
app.include_router(packets.router, prefix="/api/packets", tags=["Packets"])
app.include_router(mesh.router, prefix="/api/mesh", tags=["Mesh"])
app.include_router(ota.router, prefix="/api/ota", tags=["OTA"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])

# OAuth2 setup
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

# Dependency to get the DB session
def get_db():
    db = crud.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Function to authenticate user
def authenticate_user(db: Session, username: str, password: str):
    user = crud.get_user_by_username(db, username=username)
    if not user or not crud.verify_password(password, user.hashed_password):
        return False
    return user

# Get SECRET_KEY from environment variable
# IMPORTANT: Set this environment variable in your deployment environment!
SECRET_KEY = os.environ.get("NOVCOMM_SECRET_KEY", "super-secret-default-key-please-change-me")
if SECRET_KEY == "super-secret-default-key-please-change-me":
    print("WARNING: NOVCOMM_SECRET_KEY environment variable not set. Using a default key. \n"
          "This is INSECURE for production. Please set NOVCOMM_SECRET_KEY to a strong, random value.")

# Dependency to get current user
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

@app.get("/")
def read_root():
    return {"message": "Welcome to the NovaComm++ Dashboard API"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # You can add logic here to process incoming WebSocket messages if needed
            # await manager.send_personal_message(f"You wrote: {data}", websocket)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print("Client disconnected")

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.on_event("startup")
async def startup_event():
    # Start MQTT bridge in a separate thread/task
    print("Starting MQTT bridge on startup...")
    # Use a separate thread for the MQTT client loop to avoid blocking FastAPI's event loop
    mqtt_thread = threading.Thread(target=lambda: asyncio.run(start_mqtt_bridge()))
    mqtt_thread.daemon = True # Allow main program to exit even if thread is running
    mqtt_thread.start()

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down MQTT bridge...")
    # You might need to add a way to gracefully stop the MQTT client here