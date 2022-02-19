# Projects Manager

Projects Manager is a web application for teachers and students which borrows functionalities from Jira and customizes them for the academic environment.

# Features

-   Accounts administration (creation, password reset), an admin user creates teacher accounts (for security reasons)
-   SCRUM role system: teacher - Product Owner, team leader - SCRUM Master, team member - Developer
-   Product Owners can:
    -   create projects;
    -   asign teams with SCRUM Masters;
    -   Change SCRUM Masters;
-   SCRUM Masters and Product Owners can:
    -   manage a Backlog with issues (tasks, stories and bugs) which can be sorted and filtered;
    -   plan Sprints;
-   SCRUM Masters can:
    -   Manage his team (add code repository, create a Trello Board, add/delete Developers, send messages);
    -   Copy issues from current started sprint to Trello;
-   Changes in issues (cards) from Trello are seen in real time in application;

# Applications

Each application has it's own README.md file which describes it's setup and running steps.

## Client

Client is a Single Page Application which implements the UI of all features described above.

### Tech stack

-   `React`, `React-hooks`, `Create-React-App`
-   `Firebase` (Auth, Storage): cloud service for creating a secure account management system
-   `Material UI`: library of React UI components
-   `Formik`: helps in creating and validating forms in React more easily

## REST-Api

REST-Api, as the name implies, implements the REST paradigm.\
Features:

-   Defines database models using ORM
-   Creates endpoints for collections and resources
-   Authorizes calls by checking JWTs using Firebase
-   Interacts with Trello Rest API
-   Documents the API using Swagger (/api)
-   Receives and processes Trello data and sends it forward to RealTimeUpdatesFeeder

### Tech stack

-   `Python`, `Flask`
-   `RESTX`: offers suppport for creating REST APIs more easily and helps generating Swagger documentation
-   `SQLAlchemy ORM`: maps the SQL tables into python objects

## RealTimeUpdatesFeeder

It's a hybrid between a simple REST service and a Websockets server.
Receives Trello Card properties that need to be presented on Client's UI in real time.

### Tech stack

-   `Node.js`
-   `ws`: server Websockets implementation

## exposeDomainOverInternet

It's used for testing purposes. \
It exposes an endpoint of REST-Api which will act as a callback used by Trello to send Card changes (Trello Webhook).

### Tech stack

-   `localtunnel`

# Docker

The application can be run using Docker Containers, both in development and production mode.
These containers are configured and orchestrated using Docker Compose which uses base instructions
specified in Dockerfiles of every sub-applicatios for development and production.

For building app in production mode run:

```sh
docker-compose -f docker-compose.production.yml build
```

For running the containers use:

```sh
docker-compose -f docker-compos.production.yml up
```
