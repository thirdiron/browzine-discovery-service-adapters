# Library Developers

## Overview
Use `browzine-summon-adapter` to enhance Summon search results with BrowZine data; Adds links to Journal and Article content in BrowZine; Uses BrowZine Journal covers.

![Article in Context links in Summon results](https://i.imgur.com/B34LEec.png "Article in Context links in Summon results")

## How to request your library API endpoint
Visit Third Iron support to request your library API endpoint - http://support.thirdiron.com/

You will receive your `api` endpoint and your `apiKey`, update the Summon script with these values.

## What source code to use?
Use `/src/browzine-summon-adapter.js`, we support IE10+ and evergreen browsers (Chrome, Firefox, Safari, Microsoft Edge).


# Contributors

## Installation

* `git clone https://github.com/thirdiron/browzine-summon-adapter.git` this repository
* change into the new directory
* `npm install`

## Running / Development

* `npm run server` (Runs a local webserver, visit http://localhost:8080)
* `npm run tunnel` (Creates an ngrok tunnel, place this in the "Summon 2.0 External Script", e.g. https://9f9981c8.ngrok.io/src/browzine-summon-adapter.js)

### Running Tests

* `npm test` (Runs the Karma automated acceptance tests)

### Before Submitting Pull Requests

Contributors should:

- Make the needed changes in `/src/browzine-summon-adapter.js`.
- Add a test for the change in `/tests/browzine-summon-adapter.js`.

### Deploying (Internal Use Only)

CircleCI executes deployments to S3 using the deploy-staging and deploy-production npm commands. Neither feature branches nor hotfix branches are deployed to S3.

The Summon/BrowZine adapter can be found here:

Staging
https://s3.amazonaws.com/browzine-adapters/summon-staging/browzine-summon-adapter.js

Production
https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js
