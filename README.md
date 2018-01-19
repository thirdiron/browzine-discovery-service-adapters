# Library Developers

## Overview
Use `browzine-summon-adapter` to enhance Summon or 360 Core search results with BrowZine data; Adds links to Journal and Article content in BrowZine; Uses BrowZine Journal covers. The BrowZine Summon adapter supports IE11+ and evergreen browsers (Chrome, Firefox, Safari, Microsoft Edge).

_Summon Search Results_

![Summon Journal Search Results](https://i.imgur.com/B34LEec.png "Summon Journal Search Results")

_360 Core Search Results_

![360 Core Journal Search Results](https://i.imgur.com/UrxxYwf.png "360 Core Journal Search Results")


## How to request your library API endpoint
Visit Third Iron support to request your library API endpoint - http://support.thirdiron.com/

You will receive your `api` endpoint and your `apiKey`, update the following code snippet with these values and add to your Summon Custom Script:

_BrowZine Summon Adapter Script_

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
};

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js";
document.head.appendChild(browzine.script);
```

_BrowZine 360 Core Adapter Script_

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
};

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/360-core/browzine-360-core-adapter.js";
document.head.appendChild(browzine.script);
```

_Adding Summon Custom Script_

Summon Custom Scripts are added in the Summon 2.0 External Script portion of the Summon Editor Settings:
![Summon 2.0 Editor Link](https://i.imgur.com/HJFpDGm.png "Summon 2.0 Editor Link")

As a Custom Script Url:
![Summon 2.0 External Script](https://i.imgur.com/piLMSic.png "Summon 2.0 External Script")


_Adding 360 Core Custom Script_

360 Core custom scripts are added in 360 Core > Administration Console > E-Journal Portal 2.0 > Branding Options > Reference External JavaScript > JavaScript file url:
![360 Core 2.0 External Script](https://i.imgur.com/c24Tlh5.png "360 Core 2.0 External Script")
![360 Core 2.0 External Script](https://i.imgur.com/fj5mbyM.png "360 Core 2.0 External Script")

## Customize The BrowZine Enhancement

Customize the naming conventions for each type of search result - Journal/Article - by changing the wording in the quotes below:

E.g. You can customize "View the Journal" and "View Complete Issue" or "Browse Now". These customizations are optional and the defaults are shown below.

_Summon Customizations_

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
  summonJournalWording: "View the Journal",
  summonArticleWording: "View Complete Issue",
  summonJournalBrowZineWebLinkText: "Browse Now",
  summonArticleBrowZineWebLinkText: "Browse Now",
};
```

_360 Core Customizations_

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
  serSol360CoreJournalBrowZineWebLinkText: "View Journal in BrowZine",
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


### Deploying

CircleCI executes deployments to S3 using the deploy-staging and deploy-production npm commands. Neither feature branches nor hotfix branches are deployed to S3.

The Summon/BrowZine adapter can be found here:

Staging
https://s3.amazonaws.com/browzine-adapters/summon-staging/browzine-summon-adapter.js

Production
https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js
