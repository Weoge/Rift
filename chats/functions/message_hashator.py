import hashlib
import os
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
import base64

def generate_key_salt():
    key = os.urandom(32)
    salt = os.urandom(16)
    return key, salt

def r2hm_encrypt(message: str, key: bytes, salt: bytes):
    binary_data = message.encode('utf-8')
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted = cipher.encrypt(pad(binary_data, AES.block_size))
    return base64.b64encode(salt + iv + encrypted).decode()

def r2hm_decrypt(encrypted_message: str, key: bytes, salt: bytes):
    decoded = base64.b64decode(encrypted_message)
    stored_salt = decoded[:16]
    iv = decoded[16:32]
    encrypted_data = decoded[32:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    decrypted = unpad(cipher.decrypt(encrypted_data), AES.block_size)
    return decrypted.decode('utf-8')

def encrypt_message_for_chat(message: str, chat, sender):
    from .crypto_storage import get_chat_keys, save_chat_keys, get_user_keys
    from .key_exchange import encrypt_key_for_user, decrypt_key_from_user
    
    encrypted_key, salt = get_chat_keys(chat, sender)
    
    if not encrypted_key:
        key, salt = generate_key_salt()
        _, pub1 = get_user_keys(chat.first_user)
        _, pub2 = get_user_keys(chat.second_user)
        
        if not pub1 or not pub2:
            return message
        
        enc1 = encrypt_key_for_user(key, pub1)
        enc2 = encrypt_key_for_user(key, pub2)
        save_chat_keys(chat, key, salt, enc1, enc2)
        encrypted_key = enc1 if sender == chat.first_user else enc2
    
    priv, _ = get_user_keys(sender)
    if not priv:
        return message
    
    key = decrypt_key_from_user(encrypted_key, priv)
    return r2hm_encrypt(message, key, salt)

def decrypt_message_from_chat(encrypted_message: str, chat, receiver):
    from .crypto_storage import get_chat_keys, get_user_keys
    from .key_exchange import decrypt_key_from_user
    
    try:
        encrypted_key, salt = get_chat_keys(chat, receiver)
        if not encrypted_key:
            return encrypted_message
        
        priv, _ = get_user_keys(receiver)
        if not priv:
            return encrypted_message
        
        key = decrypt_key_from_user(encrypted_key, priv)
        return r2hm_decrypt(encrypted_message, key, salt)
    except:
        return encrypted_message
