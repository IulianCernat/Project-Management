The database which needs to be installed is `MariaDB`. \
If the Dockerfile is used then no installation process has to be done.\
Here are included also some python scripts for building mockup data.

## Scripts Setup

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
python generatePeople.py
```

Generates profiles in `profiles.json`

```sh
python populateDB.py
```

Populates database through REST API calls
