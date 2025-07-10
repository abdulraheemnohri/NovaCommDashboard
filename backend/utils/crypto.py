import hashlib

def generate_sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

# Placeholder for ECDSA signing/verification
async def verify_ecdsa_signature(data: bytes, signature: bytes, public_key: bytes) -> bool:
    print("Simulating ECDSA signature verification")
    return True

async def sign_data_ecdsa(data: bytes, private_key: bytes) -> bytes:
    print("Simulating ECDSA data signing")
    return b"simulated_signature"
