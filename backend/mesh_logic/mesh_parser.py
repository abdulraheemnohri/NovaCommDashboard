def parse_mesh_packet(raw_data: bytes) -> dict:
    print(f"Simulating parsing mesh packet: {raw_data}")
    # In a real system, this would parse the binary LoRa packet
    return {"source": "node_X", "destination": "gateway", "payload": raw_data.decode()}
