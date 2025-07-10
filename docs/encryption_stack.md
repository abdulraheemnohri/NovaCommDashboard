# NovaComm Encryption Stack

This document describes the encryption and security layers of the NovaComm protocol.

## 1. Security Layers

| Layer | Technology |
|---|---|
| Encryption | AES256-GCM |
| Auth | ECC-based (Curve25519) |
| Obfuscation | RF Pattern Noise Injection |
| Replay Protection | Nonce with Timestamp |
| Identity | ECDSA Signed Node ID |

## 2. Encryption

### AES256-GCM

All data transmitted over the NovaComm network is encrypted using AES256 in Galois/Counter Mode (GCM). This provides both confidentiality (encryption) and authenticity (authentication). A unique initialization vector (IV) is used for each packet to ensure that identical plaintext packets do not result in identical ciphertext.

## 3. Authentication

### ECC-based Authentication

Nodes authenticate to the network using Elliptic Curve Cryptography (ECC) with the Curve25519 curve. Each node has a unique public/private key pair. All communication is signed with the node's private key, and the signature is verified by the receiver using the node's public key.

### Key Management

-   **Key Generation:** Public/private key pairs are generated for each node during the provisioning process.
-   **Key Storage:** Private keys are stored securely on the node, preferably in a hardware security module (HSM) or a secure element if available. Public keys are stored on the gateway.
-   **Key Distribution:** Public keys are distributed to the gateways during the node registration process.

## 4. Replay Protection

A nonce (a random number used once) and a timestamp are included in each packet to prevent replay attacks. The gateway keeps track of the nonces and timestamps it has received from each node and rejects any packets with a nonce or timestamp that has already been used.

## 5. Obfuscation

To make the RF signal less predictable, a layer of noise is injected into the RF pattern. This makes it more difficult for an attacker to analyze the signal and identify patterns.