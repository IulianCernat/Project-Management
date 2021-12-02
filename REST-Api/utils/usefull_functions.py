import string
import random
import yagmail


def generate_random_string(length):
    characters = list(string.ascii_letters)
    characters.extend(list(string.digits))
    characters.extend(list(string.punctuation))
    random.shuffle(characters)
    random_string = ''.join(random.choice(characters) for _ in range(length))
    return random_string


def send_email(recipient_email, subject, contents):
    return
    # yag = yagmail.SMTP()
    # yag.send(recipient_email, subject, contents)
