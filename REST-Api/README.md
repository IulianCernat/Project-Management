## Setup

Requires `firebase-adminsdk.json` to be present in this folder or it's path can
be specified via environment variable `GOOGLE_APPLICATION_CREDENTIALS`.\
`FIREBASE_WEB_API_KEY` is another environment variable which needs to be set beforehand.\
This project requires python 3.7 +

```sh
python -m venv env
```

Creates a virtual environment

```sh
(Windows) venv\scripts\activate
```

Selects env

```sh
pip install -r requirements.txt
```

Installs all the necessary packages

```sh
python app.py
```

Runs project in development mode

```
waitress-serve --listen=[address:port] app:app
```

Runs project in production mode
