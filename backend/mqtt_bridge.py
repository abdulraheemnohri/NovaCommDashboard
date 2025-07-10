import paho.mqtt.client as mqtt
import json
import asyncio
import threading
import time
import os

from db.database import SessionLocal
from db import crud, schemas
from websocket_handler import broadcast_update

# MQTT Broker settings
MQTT_BROKER_HOST = os.environ.get("MQTT_BROKER_HOST", "localhost")
MQTT_BROKER_PORT = int(os.environ.get("MQTT_BROKER_PORT", 1883))
MQTT_TOPIC_RX = os.environ.get("MQTT_TOPIC_RX", "novacomm/+/rx") # Wildcard for node_uuid

def on_connect(client, userdata, flags, rc):
    print(f"Connected to MQTT broker with result code {rc}")
    client.subscribe(MQTT_TOPIC_RX)

def on_message(client, userdata, msg):
    print(f"MQTT message received on topic {msg.topic}: {msg.payload.decode()}")
    try:
        # Assuming payload is JSON, e.g., {"uuid": "node_X", "payload": "data", "snr": 10.5, "rssi": -70, ...}
        packet_data = json.loads(msg.payload.decode())
        
        node_uuid = packet_data.get("uuid")
        if not node_uuid:
            # Try to extract uuid from topic if not in payload
            topic_parts = msg.topic.split('/')
            if len(topic_parts) >= 2: # e.g., novacomm/node_X/rx
                node_uuid = topic_parts[1]
            else:
                print("Could not determine node_uuid from topic or payload.")
                return
        
        db = SessionLocal()
        try:
            # Create or update node status and details
            node = crud.get_node_by_uuid(db, uuid=node_uuid)
            if not node:
                # Create new node with initial data
                node_create_data = {
                    "uuid": node_uuid,
                    "name": packet_data.get("name", f"Node {node_uuid}"),
                    "lat": packet_data.get("lat"),
                    "lng": packet_data.get("lng"),
                    "mode": packet_data.get("mode", "normal"),
                    "tx_power": packet_data.get("tx_power"),
                    "freq": packet_data.get("freq"),
                    "bandwidth": packet_data["bandwidth"],
                    "ai_model": packet_data.get("ai_model"),
                    "firmware": packet_data.get("firmware"),
                    "configuration": packet_data.get("configuration", {})
                }
                node = crud.create_node(db, schemas.NodeCreate(**node_create_data))
            else:
                # Update existing node's last_seen, status, and other dynamic fields
                node_update_data = {
                    "last_seen": datetime.datetime.utcnow(),
                    "status": "online",
                    "lat": packet_data.get("lat", node.lat),
                    "lng": packet_data.get("lng", node.lng),
                    "mode": packet_data.get("mode", node.mode),
                    "tx_power": packet_data.get("tx_power", node.tx_power),
                    "freq": packet_data.get("freq", node.freq),
                    "bandwidth": packet_data.get("bandwidth", node.bandwidth),
                    "ai_model": packet_data.get("ai_model", node.ai_model),
                    "firmware": packet_data.get("firmware", node.firmware),
                    "configuration": packet_data.get("configuration", node.configuration)
                }
                crud.update_node(db, node_uuid, node_update_data)
            
            # Create packet entry
            packet_schema = schemas.PacketCreate(
                node_id=node_uuid, # Use uuid here as node_id in Packet model
                payload=packet_data.get("payload", ""),
                snr=packet_data.get("snr", 0.0),
                rssi=packet_data.get("rssi", 0.0)
            )
            crud.create_packet(db, packet_schema)
            
            # Create AI Log if relevant data is present
            if "ai_prediction" in packet_data:
                ai_log_schema = schemas.AILogCreate(
                    node_id=node_uuid,
                    model_name=packet_data.get("ai_model_name", "unknown"),
                    prediction=packet_data["ai_prediction"],
                    accuracy=packet_data.get("ai_accuracy")
                )
                crud.create_ai_log(db, ai_log_schema)

        except Exception as e:
            print(f"Error processing MQTT message: {e}")
            db.rollback()
        finally:
            db.close()

    except json.JSONDecodeError:
        print(f"Received non-JSON MQTT message: {msg.payload.decode()}")

async def start_mqtt_bridge():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    try:
        client.connect(MQTT_BROKER_HOST, MQTT_BROKER_PORT, 60)
        client.loop_forever() # Blocking call that processes network traffic, dispatches callbacks and handles reconnecting.
    except Exception as e:
        print(f"Failed to connect to MQTT broker: {e}")

if __name__ == "__main__":
    # This part is for standalone testing of the MQTT bridge
    # In the full system, it will be run as part of the main FastAPI app startup
    print("Starting MQTT Bridge (standalone mode)...")
    asyncio.run(start_mqtt_bridge())