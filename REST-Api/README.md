This project requires python 3.7 +

## Setup

Requires an '.env' files with the following variables

```
TRELLO_API_KEY=
GOOGLE_APPLICATION_CREDENTIALS=[path of firebase-adminsdk.json file]
PROJECTS_MANAGER_DEV_DB_URI=
FIREBASE_APP_ADMIN_EMAIL=
TRELLO_API_URL=https://api.trello.com/1
TUNNELED_API_ADDRESS=https://fdgnvbngjhtkorestapitunnel.loca.lt
REALTIME_UPDATES_SERVICE_URL=http://localhost:3001/updatesFeeder
FIREBASE_WEB_API_KEY=
```

```sh
python -m venv env
```

Creates a virtual environment

```sh
(Windows) env\scripts\activate
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
