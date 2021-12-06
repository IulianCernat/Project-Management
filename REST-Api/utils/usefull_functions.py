import string
import random
import requests
from pathlib import Path
from utils.custom_exceptions import AuthFileCouldNotBeFound
from settings import FIREBASE_WEB_API_KEY


def generate_random_string(length):
    characters = list(string.ascii_letters)
    characters.extend(list(string.digits))
    characters.extend(list(string.punctuation))
    random.shuffle(characters)
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string


def send_firebase_reset_password_link(recipient_email):
    requests.post("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode",
                  params={"key": FIREBASE_WEB_API_KEY},
                  data={"email": recipient_email, "requestType": "PASSWORD_RESET"})
