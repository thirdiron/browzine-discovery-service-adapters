#browzine-summon-adapter

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

### Deploying

CircleCI executes deployments to S3 using the deploy-staging and deploy-production npm commands. Neither feature branches nor hotfix branches are deployed to S3.

The Summon/BrowZine adapter can be found here:

Staging
https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js

Production
https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js
