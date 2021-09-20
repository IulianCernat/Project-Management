FROM ubuntu:20.04
ENV GOOGLE_APPLICATION_CREDENTIALS=firebase-adminsdk.json
RUN apt-get update --yes && apt-get upgrade --yes && apt-get install --yes python3-venv python3-pip
WORKDIR /REST-Api
COPY requirements.txt requirements.txt
RUN pip install gunicorn
RUN pip install -r requirements.txt
COPY . .

