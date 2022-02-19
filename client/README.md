## Firebase and Trello keys configuration

There has to be a file called `.env.local` which contains:

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
REACT_APP_TRELLO_API_KEY=
```

## Available Scripts

In the project directory, you can run the following scripts:

```sh
npm init
```

Installs locally all the dependencies

```sh
npm start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The REST api path is stored in .env.development.
The page will reload if you make edits.\
You will also see any lint errors in the console.

```sh
npm run build
```

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

```sh
serve -s build -l [port]
```

Runs the app in production mode.
The REST api path is stored in .env.production
