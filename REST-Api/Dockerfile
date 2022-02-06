# FROM ubuntu:20.04
# ENV GOOGLE_APPLICATION_CREDENTIALS=firebase-adminsdk.json
# RUN apt-get update --yes && apt-get upgrade --yes && apt-get install --yes python3-venv python3-pip
# WORKDIR /REST-Api
# COPY requirements.txt requirements.txt
# RUN pip install -r requirements.txt
# COPY . .

FROM archlinux:latest
ENV GOOGLE_APPLICATION_CREDENTIALS=firebase-adminsdk.json
RUN pacman --noconfirm -Syu 
RUN pacman --noconfirm -S python-virtualenv python-pip
WORKDIR /REST-Api
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .