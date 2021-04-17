from firebase_admin import auth
import firebase_admin

# credentials are stored in an environment variable called GOOGLE_APPLICATION_CREDENTIALS
firebase_app = firebase_admin.initialize_app()

def verify_id_token(jwt):
    return auth.verify_id_token(jwt, firebase_app)
