# NovaComm Protocol Specification

This document outlines the NovaComm communication protocol.

## 1. Core Principles

- **Energy Efficiency:** The protocol is designed for low-power nodes, enabling long battery life.
- **Scalability:** The mesh network can support a large number of nodes over a wide area.
- **Security:** All communication is encrypted and authenticated.
- **Adaptability:** AI-driven optimization allows the network to adapt to changing conditions.

## 2. Packet Format

The NovaComm packet format is designed to be flexible and efficient.

`[PREAMBLE][SYNC][HEADER][DATA][CRC][SIGNATURE][SLEEP_FLAG]`

### Packet Fields

- **PREAMBLE (8 bytes):** A sequence of alternating 0s and 1s used by the receiver to synchronize with the incoming transmission.
- **SYNC (2 bytes):** A unique 16-bit word that identifies the start of a NovaComm frame, preventing confusion with other signals.
- **HEADER (16 bytes):** Contains critical metadata for packet routing and handling.
  - `source_addr (4 bytes)`: Unique address of the originating node.
  - `dest_addr (4 bytes)`: Address of the destination node. Can be a broadcast address.
  - `packet_id (2 bytes)`: A unique ID for the packet to detect duplicates.
  - `ttl (1 byte)`: Time-to-Live for mesh routing. Decremented at each hop.
  - `hop_count (1 byte)`: Number of hops the packet has taken.
  - `packet_type (1 byte)`: Defines the type of payload (e.g., sensor data, command, acknowledgement).
  - `payload_len (2 bytes)`: Length of the DATA field.
  - `reserved (1 byte)`: Reserved for future use.
- **DATA (Variable Length):** The payload of the packet. The maximum length is determined by the LoRa configuration.
- **CRC (2 bytes):** A 16-bit Cyclic Redundancy Check (CRC-16-CCITT) to ensure data integrity.
- **SIGNATURE (64 bytes):** An ECDSA signature generated using the node's private key to authenticate the packet.
- **SLEEP_FLAG (1 byte):** A flag indicating if the node will enter a low-power sleep mode after this transmission. The gateway can use this to schedule downlink messages.

## 3. Communication Flow

1.  **Node Wake-up:** A node wakes up from sleep mode based on a timer or an external interrupt (e.g., a sensor reading).
2.  **AI Optimization:** The node's AI controller analyzes the current conditions (SNR, battery level) and determines the optimal transmission parameters (spreading factor, bandwidth, power).
3.  **Packet Construction:** The node constructs a packet with the sensor data, header, and security features.
4.  **Transmission:** The node transmits the packet.
5.  **Mesh Forwarding:** Neighboring nodes receive the packet. If the packet is not addressed to them, they check the TTL and forward it if necessary, decrementing the TTL.
6.  **Gateway Reception:** The gateway receives the packet, verifies the signature and CRC, and processes the data.
7.  **Downlink Scheduling:** If the gateway has a message for the node, it schedules it for transmission based on the node's sleep schedule.