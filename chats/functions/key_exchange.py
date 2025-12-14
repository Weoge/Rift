from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
import base64

def generate_keypair():
    key = RSA.generate(2048)
    private_key = key.export_key()
    public_key = key.publickey().export_key()
    return private_key, public_key

def encrypt_key_for_user(symmetric_key: bytes, public_key_pem: bytes):
    public_key = RSA.import_key(public_key_pem)
    cipher = PKCS1_OAEP.new(public_key)
    encrypted = cipher.encrypt(symmetric_key)
    return base64.b64encode(encrypted).decode()

def decrypt_key_from_user(encrypted_key: str, private_key_pem: bytes):
    private_key = RSA.import_key(private_key_pem)
    cipher = PKCS1_OAEP.new(private_key)
    encrypted = base64.b64decode(encrypted_key)
    return cipher.decrypt(encrypted)
