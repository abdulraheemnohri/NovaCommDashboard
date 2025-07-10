# NovaComm Hardware Guide

This document details the hardware requirements and setup for NovaComm nodes and gateways.

## 1. Node Hardware

### Minimum Node Requirements

| Component | Details |
|---|---|
| MCU | `STM32L0x` / `ATmega328P` / `ESP32-S3` |
| Radio | `Semtech SX1262` (Preferred), `SX1276` (Fallback) |
| Antenna | 868/915 MHz LoRa Antenna (Rubber Duck or PCB Antenna) |
| Power | Li-Po Battery 3.7V (1000mAh–5000mAh) |
| Sensors | Optional (Temp, GPS, Accelerometer, etc.) |
| Flash | 4MB External Flash (W25Q32) for logs + firmware |
| Optional | Solar Panel + Charge Controller (for energy harvesting nodes) |

### Node Assembly

1.  Connect the LoRa module to the MCU via SPI.
2.  Connect the antenna to the LoRa module.
3.  Connect the battery to the MCU's power input.
4.  (Optional) Connect sensors to the MCU's I2C, SPI, or ADC pins.

## 2. Gateway Hardware

### Gateway Requirements

| Component | Details |
|---|---|
| MCU | Raspberry Pi 4B / ESP32 Gateway Board |
| LoRa Module | RAK2245 (with GPS), SX1302 or SX1308 concentrator |
| Internet | Wi-Fi or Ethernet uplink |
| Storage | SD Card 32GB+ |
| Software | NovaComm Mesh Server, MQTT Broker (optional), Node Monitor Dashboard |

### Gateway Setup (Raspberry Pi)

1.  **Install Raspberry Pi OS:** Flash a 32GB or larger SD card with the latest version of Raspberry Pi OS.
2.  **Connect the LoRa Concentrator:** Connect the RAK2245 or other LoRa concentrator to the Raspberry Pi's GPIO header.
3.  **Install Gateway Software:**
    ```bash
    # Clone the NovaComm repository
    git clone https://github.com/your-username/NovaComm.git
    cd NovaComm/firmware/gateway

    # Install Python dependencies
    pip install -r requirements.txt
    ```
4.  **Configure the Gateway:** Edit the `config/mesh_config.yaml` file to set the mesh ID and other parameters.
5.  **Run the Gateway Server:**
    ```bash
    python server.py
    ```