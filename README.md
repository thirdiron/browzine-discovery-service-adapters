# Library Developers

## Overview
Use `browzine-summon-adapter` to enhance Summon search results with BrowZine data; Adds links to Journal and Article content in BrowZine; Uses BrowZine Journal covers. The BrowZine Summon adapter supports IE11+ and evergreen browsers (Chrome, Firefox, Safari, Microsoft Edge).


![Article in Context links in Summon results](https://i.imgur.com/B34LEec.png "Article in Context links in Summon results")

## How to request your library API endpoint
Visit Third Iron support to request your library API endpoint - http://support.thirdiron.com/

You will receive your `api` endpoint and your `apiKey`, update the following code snippet with these values and add to your Summon Custom Script:

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
};

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js";
document.head.appendChild(browzine.script);
```

Summon Custom Scripts are added in the Summon 2.0 External Script portion of the Summon Editor Settings:
![Summon 2.0 Editor Link](https://i.imgur.com/HJFpDGm.png "Summon 2.0 Editor Link")

As a Custom Script Url:
![Summon 2.0 External Script](https://i.imgur.com/piLMSic.png "Summon 2.0 External Script")

## Customize The BrowZine Enhancement

Customize the naming conventions for each type of search result - Journal/Article - by changing the wording in the quotes below:

E.g. You can customize "View the Journal" and "View Complete Issue" or "Browse Now". These customizations are optional and the defaults are shown below.

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
  journalWording: "View the Journal",
  articleWording: "View Complete Issue",
  journalBrowZineWebLinkText: "Browse Now",
  articleBrowZineWebLinkText: "Browse Now",
};
```

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

### Deploying

CircleCI executes deployments to S3 using the deploy-staging and deploy-production npm commands. Neither feature branches nor hotfix branches are deployed to S3.

The Summon/BrowZine adapter can be found here:

Staging
https://s3.amazonaws.com/browzine-adapters/summon-staging/browzine-summon-adapter.js

Production
https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js
