# Library Developers

## Overview
Use `browzine-summon-adapter` to enhance Summon search results with BrowZine data; Adds links to Journal and Article content in BrowZine; Uses BrowZine Journal covers.

## How to request your library API endpoint
Visit Third Iron support to request your library API endpoint - http://support.thirdiron.com/

## What source code to use?
Generally, use the source code found in `/dist/browzine-summon-adapter.js` because it has the broadest Internet Explorer support.

However, if your institution has discontinued support for Internet Explorer and has instead focused on Microsoft Edge support, then feel free to use the source code directly found in `/src/browzine-summon-adapter.js` as it uses the latest JavaScript es6 features.


# Contributors

## Installation

* `git clone https://github.com/thirdiron/browzine-summon-adapter.git` this repository
* change into the new directory
* `npm install`

## Running / Development

* `npm run compile` (Runs the sourcecode through babel and watches for changes)
* `npm run server` (Runs a local webserver, visit http://localhost:8080)
* `npm run tunnel` (Creates an ngrok tunnel, place this in the "Summon 2.0 External Script", e.g. https://9f9981c8.ngrok.io/dist/browzine-summon-adapter.js)

### Running Tests

* `npm test` (Runs the Karma automated acceptance tests)

### Deploying (Internal Use Only)

CircleCI executes deployments to S3 using the deploy-staging and deploy-production npm commands. Neither feature branches nor hotfix branches are deployed to S3.

The Summon/BrowZine adapter can be found here:

Staging
https://s3.amazonaws.com/browzine-adapters/summon-staging/browzine-summon-adapter.js

Production
https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js
