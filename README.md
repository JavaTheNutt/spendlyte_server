# SpendLyte Server

_A finance tracker backend built with NodeJS, Express, Typescript and Firebase-Admin_

Name | URL
:---: | :---:
Application | [https://spendlyte.com](https://spendlyte.com)
Report Repo | [https://github.com/JavaTheNutt/spendlyte_reports](https://github.com/JavaTheNutt/spendlyte_reports)
Client Repo | [https://github.com/JavaTheNutt/spendlyte_client01](https://github.com/JavaTheNutt/spendlyte_client01)

## Outline

This is a backend infrastructure built for deployment to [Firebase Cloud Functions](https://firebase.google.com/docs/functions/). It is primarily designed to save items to a database and perform financial aggregations on this data. This acts as the server for [the client application]()

This application is a RESTful API built using the [Express](https://expressjs.com/) framework for [NodeJS](https://nodejs.org). It is built using [Typescript](https://www.typescriptlang.org/) for static type checking and ES+ transpilation.

This application is built into three seperate "apps". These apps are little more than collections of API endpoints which scale independently of one another. The apps are `finance` (legacy and deprecated), `items` and `tags`. 

## Authentication
Authentication in this applicaiton is handled by Firebase. In this case a token is sent to the server with each request. Since the actual authentication workflow happens on the client, this is a requirement for every request to every endpoint. This token is then decrypted to verify the identity of the user. If the token is valid the users details are added to the request to be used later on in the request lifecycle. If the token is invalid, or does not exist, the server returns a `403 Forbidden` error.

## Building
### Environment Setup
In order to build this project, you will need to create a new [Firebase App](https://console.firebase.google). Then create a file in the root of this project called `.firebaserc`. This file specifies which project should be used when deploying the cloud functions. Simply paste the snippet below and replace `<PROJECT_ID_HERE>` with your project ID. Your project ID can be found on the settings page of your Firebase console of the project you wish to use. You will also need to install [firebase-tools](https://www.npmjs.com/package/firebase-tools) globally using the command `npm i -g firebase-tools`. Then run `firebase login` to login to your Firebase account. This will allow your functions to be initialized with the proper credentials, without the need for environment variables. 

```json
{
  "projects": {
    "default": "<PROJECT_ID_HERE>"
  }
}
``` 
### Development Build
This project requires both [NodeJS](https://nodejs.org)(&gt; v6.0.0) and [NPM](https://npmjs.com)(&gt; v3.0.0). The `package.json` for this project comes with several scripts to speed up development workflow. To see these scripts, use `npm run` with no arguments. This should give an output similar to the following:

```bash
Lifecycle scripts included in functions:
  start
    npm run shell
  test
    mocha -r ts-node/register src/**/*.spec.ts

available via `npm run-script`:
  lint
    tslint -p tslint.json
  build
    tsc
  serve
    npm run build && cross-env NODE_ENV=development firebase serve --only functions
  serve:no-build
    cross-env NODE_ENV=development firebase serve --only functions
  shell
    npm run build && firebase experimental:functions:shell
  deploy
    firebase deploy --only functions
  logs
    firebase functions:log
  dev
    nodemon --watch lib --exec npm run serve:no-build
  compile:watch
    tsc -w
  compile
    tsc
```
In order to run this server in development mode, first run `npm run compile:watch` to start the typescript service in watch mode. This will watch your `.ts` files for changes and convert them to Javascript. Then open a new terminal and run `npm run dev`. This will watch the directory where your transpiled Javascript is, and restart the server when this changes. 

_Note: If you find that having a watcher on both Typescript and Javascript is overkill, you can skip the first step and use_ `npm run compile` _when you want to trigger a rebuild._

### Production Build
The production build step here is quite small, since server side code requires far less optimisation than client-side code. In order to build this application for production, just use `npm run build` (or `npm run compile`, which is an alias for `build`). This will compile the Typescript to Javascript.

### Deployment
To deploy this application, use `npm run deploy`. This will deploy the application to production. The application should be built before deployment, but as this happens continuously during development, it will most likely already be built at deploy time.

## Technology Overview

### Application
Category | Choice | Description
---: | :---: | :---
Runtime | [NodeJS](https://nodejs.org) | Javascript runtime for the server
Application Framework | [Express](https://firebase.google.com/docs/functions/) | NodeJS framework for building web applications
Language Framework | [Typescript](https://www.typescriptlang.org/) | Static type checking and ES+ features
Database | [Cloud Firestore](https://firebase.google.com/docs/firestore/) | NoSQL, scalable, collection-based database.
Authentication | [Firebase Auth](https://firebase.google.com/docs/auth) | Authentication services from Firebase

### Testing
Category | Choice | Description
---: | :---: | :---
Test Runner | [Mocha](https://mochajs.org/) | Javascript test runner
Assertion Framework | [Chai](http://www.chaijs.com/) | Assertion library for test assertions
Mocks \ Stubs | [Sinon](http://sinonjs.org/) | Javascript Stubbing and Mocking utility

