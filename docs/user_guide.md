# NovaComm Project: Complete A-Z Guide

NovaComm is a simulated next-generation LoRa-inspired long-range communication system with a modernized protocol, mesh support, security, and adaptive AI layers. This guide will walk you through setting up and running all components of the project.

## 1. Project Overview

The NovaComm project consists of three main parts:

*   **Node Firmware (Simulated C):** Represents the embedded software running on individual LoRa nodes. It simulates sensor data collection, AI-driven transmission parameter selection, and mesh networking.
*   **Gateway Backend (FastAPI/Python):** A central server that receives data from nodes, stores it in a database, and provides a REST API and WebSocket for the dashboard. It also handles simulated remote commands and configuration for nodes.
*   **Web Dashboard (React/Tailwind CSS):** A user interface for monitoring the network, visualizing node locations and packet data, managing users, and sending simulated commands/configurations to nodes.
*   **Node Simulation Script (Python):** A utility to simulate multiple nodes sending data to the gateway, useful for testing the backend and frontend without physical hardware.

## 2. Project Structure

The project is organized as follows:

```
NovaCommDashboard/
├── backend/
│   ├── main.py                    # FastAPI app entry
│   ├── websocket_handler.py       # Real-time mesh bridge
│   ├── ota_manager.py             # OTA upload + push
│   ├── mesh_logic/
│   │   ├── mode_switcher.py
│   │   ├── mesh_parser.py
│   │   └── routing_ai.py
│   ├── db/
│   │   ├── models.py              # SQLAlchemy models
│   │   ├── schemas.py             # Pydantic schemas
│   │   └── database.py            # DB connection
│   ├── api/
│   │   ├── auth.py                # JWT auth
│   │   ├── nodes.py               # Node control routes
│   │   ├── mesh.py                # Mesh health/route API
│   │   ├── ota.py                 # OTA endpoints
│   │   ├── jobs.py                # Scheduled tasks
│   │   └── users.py               # Admin/user management
│   └── utils/
│       ├── token.py               # JWT token tools
│       ├── logger.py              # Logging
│       └── crypto.py              # AES/ECDSA tools
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── NodeCard.jsx
│       │   ├── MeshGraph.jsx
│       │   ├── OTAUploader.jsx
│       │   ├── ModeSwitcher.jsx
│       │   └── SchedulerPanel.jsx
│       ├── pages/
│       │   ├── Dashboard.jsx
│       │   ├── NodeDetails.jsx
│       │   ├── OTA.jsx
│       │   ├── Jobs.jsx
│       │   └── Login.jsx
│       ├── App.jsx
│       ├── index.js
│       └── api/
│           └── apiClient.js       # Axios wrapper with token
├── ai_models/
│   └── mode_predictor.tflite
├── docs/
│   ├── api_docs.md
│   ├── mesh_protocol.md
│   ├── user_manual.pdf
│   └── user_guide.md
├── scripts/
│   └── simulate_nodes.py
├── install/
│   └── flash_tool.sh
└── LICENSE
```

## 3. Prerequisites

Before you begin, ensure you have the following installed on your system:

*   **Python 3.8+:** For the Gateway Backend and Node Simulation Script.
    *   Download: [https://www.python.org/downloads/](https://www.python.org/downloads/)
*   **pip:** Python's package installer (usually comes with Python).
*   **Node.js 18+ & npm:** For the React Frontend.
    *   Download: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
*   **Git:** For cloning the repository (if applicable).
    *   Download: [https://git-scm.com/downloads](https://git-scm.com/downloads)
*   **GCC (or a C compiler):** For compiling the Node Firmware (e.g., MinGW on Windows, build-essential on Linux, Xcode Command Line Tools on macOS).

## 4. Setup and Installation

Follow these steps to set up each component of the NovaComm project.

### 4.1. Gateway Backend Setup

The backend uses FastAPI and SQLAlchemy with a SQLite database.

1.  **Navigate to the Gateway directory:**
    ```bash
    cd NovaCommDashboard/backend
    ```

2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Create an initial admin user (Important!):**
    The dashboard requires authentication. You'll need to create at least one admin user to log in. You can do this by running a small Python script or using a tool like Postman/Insomnia to send a POST request.

    **Option A: Using a Python script (Recommended for first user)**
    Create a file named `create_admin.py` in the `NovaCommDashboard/backend` directory with the following content:
    ```python
    from db.database import SessionLocal, engine, Base
    from db.models import User
    from db.crud import get_password_hash
    import os

    # Ensure all tables are created
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # Check if admin user already exists
        if db.query(User).filter(User.username == "admin").first():
            print("Admin user 'admin' already exists.")
        else:
            admin_user = User(
                username="admin",
                hashed_password=get_password_hash("admin"), # Change 'admin' to a strong password!
                email="admin@novacomm.com",
                is_active=True,
                role="admin" # Set role to admin
            )
            db.add(admin_user)
            db.commit()
            db.refresh(admin_user)
            print("Admin user 'admin' created successfully!")
    except Exception as e:
        print(f"Error creating admin user: {e}")
        db.rollback()
    finally:
        db.close()
    ```
    Then run it from the `NovaCommDashboard/backend` directory:
    ```bash
    python create_admin.py
    ```
    This will create a user with username `admin` and password `admin`. **Remember to change the password in the script for production use!**

    **Option B: Using a POST request (after the server is running)**
    Once the server is running (see step 4), you can send a POST request to `http://127.0.0.1:8000/api/users/` with the following JSON body:
    ```json
    {
      "username": "your_username",
      "email": "your_email@example.com",
      "password": "your_password"
    }
    ```
    This method requires the server to be running and is typically used for creating additional users after the initial admin is set up.

4.  **Start the Gateway Server:**
    ```bash
    uvicorn main:app --reload
    ```
    The server will start, typically accessible at `http://127.0.0.1:8000`. Keep this terminal open.

### 4.2. Frontend Dashboard Setup

The dashboard is a React application built with Tailwind CSS.

1.  **Navigate to the Frontend directory:**
    ```bash
    cd NovaCommDashboard/frontend
    ```

2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    ```bash
    npm start
    ```
    This will open the dashboard in your default web browser, usually at `http://localhost:3000`.

### 4.3. Node Firmware (Simulated C) Setup

This part simulates the embedded software.

1.  **Navigate to the Node Firmware directory:**
    ```bash
    cd NovaCommDashboard/firmware/node
    ```

2.  **Compile the firmware:**
    ```bash
    make
    ```
    This will compile `main.c`, `lora_mesh.c`, `ai_controller.c`, and `radio_driver.c` into an executable named `novacomm_node`.

### 4.4. Node Simulation Script Setup

This script sends simulated data to your running Gateway Backend.

1.  **Navigate to the Scripts directory:**
    ```bash
    cd NovaCommDashboard/scripts
    ```

2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the Simulation Script:**
    ```bash
    python simulate_nodes.py
    ```
    This script will start sending simulated node data to your gateway. Keep this terminal open.

## 5. Running the Entire System

To see the NovaComm system in action, you'll need three separate terminal windows (or processes):

1.  **Terminal 1: Gateway Backend**
    ```bash
    cd NovaCommDashboard/backend
    uvicorn main:app --reload
    ```

2.  **Terminal 2: Frontend Dashboard**
    ```bash
    cd NovaCommDashboard/frontend
    npm start
    ```

3.  **Terminal 3: Node Simulation**
    ```bash
    cd NovaCommDashboard/scripts
    python simulate_nodes.py
    ```

Once all three are running:
*   Open your web browser to `http://localhost:3000`.
*   Log in with the admin credentials you created (default: `admin`/`admin`).
*   You should start seeing simulated nodes appear on the dashboard, their locations on the map, and packet data flowing in real-time.
*   Explore the "Nodes" page to see the list of simulated nodes, register new ones, and use the "Node Detail" page to send simulated commands or update configurations.
*   Check the "Historical Data" page to filter and visualize past packet data.
*   Use the "User Management" page to create new users or toggle admin status (requires admin login).

## 6. Key Features Implemented

*   **Modular Project Structure:** Clear separation of concerns for firmware, backend, and frontend.
*   **Simulated Node Firmware:** C-based simulation of LoRa nodes with AI-driven parameter selection, power management, and basic mesh routing.
*   **FastAPI Gateway Backend:**
    *   REST API for nodes, packets, and users.
    *   WebSocket for real-time updates to the dashboard.
    *   SQLite database for persistent storage.
    *   User authentication with JWT (simulated token).
*   **React Web Dashboard:**
    *   Responsive UI with Tailwind CSS.
    *   Real-time data visualization (node status, packet flow, map).
    *   Historical data charting with filtering.
    *   User authentication and basic user management (create, list, toggle admin status).
    *   Simulated remote node control (reboot, firmware update, configuration, delete).
*   **Node Simulation Script:** Python script to generate realistic simulated node data for testing.

## 7. Benefits of NovaComm++ Dynamic Control System

The NovaComm++ Dashboard System offers a powerful and intuitive platform for managing your LoRa mesh network, providing significant benefits:

*   **Real-time Network Visibility:** Gain immediate insights into node status, location, and data flow through live updates and interactive visualizations. This allows for proactive monitoring and rapid response to network events.
*   **Centralized Control & Management:** Remotely manage individual nodes, including sending commands, updating configurations, and initiating firmware updates, all from a single, unified interface. This streamlines operations and reduces the need for physical intervention.
*   **Enhanced Operational Efficiency:** Automate tasks like OTA firmware deployment and job scheduling, reducing manual effort and ensuring consistent network performance. The ability to dynamically adjust node parameters optimizes resource utilization.
*   **Improved Network Reliability & Performance:** AI-driven insights and dynamic routing capabilities contribute to a more resilient and efficient mesh network. Real-time alerts and historical data analysis enable quick identification and resolution of issues.
*   **Scalable & Secure Architecture:** Built with a modular FastAPI backend and a robust React frontend, the system is designed for scalability to accommodate growing networks. JWT authentication and role-based access control ensure secure operations.
*   **User-Friendly Interface:** The intuitive web dashboard, with its responsive design and clear visualizations, makes complex network management tasks accessible to a wide range of users, from administrators to field technicians.
*   **Future-Proof Design:** The modular architecture and use of modern technologies (FastAPI, React, WebSockets, MQTT) provide a flexible foundation for future enhancements, such as advanced AI integration, real hardware deployment, and mobile PWA support.

## 8. Future Enhancements

This project provides a strong foundation. Here are some areas for future development:

*   **Robust Mesh Routing:** Implement a more sophisticated mesh routing protocol (e.g., AODV, OLSR) in the node firmware.
*   **Real LoRa Hardware Integration:** Adapt the node firmware to run on actual LoRa-enabled microcontrollers (e.g., ESP32, STM32).
*   **Advanced User Management:** Implement password reset, user roles beyond admin, and more secure token management.
*   **Remote Firmware Updates:** Develop a robust over-the-air (OTA) firmware update mechanism.
*   **Comprehensive Testing:** Add unit, integration, and end-to-end tests for all components.
*   **Deployment:** Containerize the backend and frontend for easier deployment (e.g., Docker).
*   **Notifications:** Implement real-time alerts for critical events (e.g., node offline, low battery).