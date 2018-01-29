# Library Developers

## Overview
Use `browzine-discovery-service-adapters` to enhance Summon, 360 Core or Primo search results with BrowZine data.

`browzine-discovery-service-adapters` adds links to Journal and Article content in BrowZine, and displays BrowZine Journal covers. The BrowZine Summon adapter supports IE11+ and evergreen browsers (Chrome, Firefox, Safari, Microsoft Edge).

* [Summon Installation Instructions](#summon-adapter-installation)
* [360 Core Installation Instructions](#360-core-adapter-installation)
* [Primo Installation Instructions](#primo-adapter-installation)


_Summon Search Results Example_

![Summon Journal Search Results](https://i.imgur.com/B34LEec.png "Summon Journal Search Results")

_360 Core Search Results Example_

![360 Core Journal Search Results](https://i.imgur.com/UFUASU7.png "360 Core Journal Search Results")

_Primo Search Results Example_

![Primo Journal Search Results](https://i.imgur.com/pckF1VT.png "Primo Journal Search Results")


## How to request your library API endpoint
Visit Third Iron support to request your library API endpoint - http://support.thirdiron.com/

You will receive your `api` endpoint and your `apiKey`.

## Summon Adapter Installation


### BrowZine Summon Adapter Script
Update the following code snippet with the `api` endpoint and `apiKey` values:

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
};

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js";
document.head.appendChild(browzine.script);
```

### Adding Summon Custom Script

Summon Custom Scripts are added in the Summon 2.0 External Script portion of the Summon Editor Settings:
![Summon 2.0 Editor Link](https://i.imgur.com/HJFpDGm.png "Summon 2.0 Editor Link")

As a Custom Script Url:
![Summon 2.0 External Script](https://i.imgur.com/piLMSic.png "Summon 2.0 External Script")

### Summon Adapter Customizations

Customize the naming conventions for each type of search result - Journal/Article - by changing the wording in the quotes below:

e.g. You can customize "View the Journal", "View Complete Issue", "Browse Now". These customizations are optional and the defaults are shown below.

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



## 360 Core Adapater Installation


### BrowZine 360 Core Adapter Script
Update the following code snippet with the `api` endpoint and `apiKey` values:
```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
};

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/360-core/browzine-360-core-adapter.js";
document.head.appendChild(browzine.script);
```

### Adding 360 Core Custom Script

360 Core custom scripts are added in 360 Core > Administration Console > E-Journal Portal 2.0 > Branding Options > Reference External JavaScript > JavaScript file url:
![360 Core 2.0 External Script](https://i.imgur.com/c24Tlh5.png "360 Core 2.0 External Script")
![360 Core 2.0 External Script](https://i.imgur.com/l53rUL8.png "360 Core 2.0 External Script")

### 360 Core Adapater Customizations

Customize the naming conventions for each type of search result - Journal - by changing the wording in the quotes below:

e.g. You can customize "View Journal in BrowZine" to be a different phrase.

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
  serSol360CoreJournalBrowZineWebLinkText: "View Journal in BrowZine",
};
```

## Primo Adapater Installation


### BrowZine Primo Adapter Script
Update the following code snippet with the `api` endpoint and `apiKey` values:
```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
};

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
document.head.appendChild(browzine.script);
```

### Adding Primo Custom Script

Upload this custom Primo package to your Primo view or add the contents of /js/custom.js to your existing customized Primo package.

https://s3.amazonaws.com/browzine-adapters/primo/01COLSCHL_INST-BRZN.zip

![Primo External Script](https://i.imgur.com/EcZDAaC.png "PrimoExternal Script")

### Primo Adapater Customizations

Customize the naming conventions for each type of search result - Journal/Article - by changing the wording in the quotes below:

e.g. You can customize "View Issue Contents" to be a different phrase.

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
  primoJournalBrowZineWebLinkText: "View Issue Contents",
};
```

## Non-standard Installation

### Loading Multiple Discovery Service Adapters

If you have multiple discovery services blended into one webpage, you can attach them both using this:

```
var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/XXX",
  apiKey: "ENTER API KEY",
};

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js";
document.head.appendChild(browzine.script);

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/360-core/browzine-360-core-adapter.js";
document.head.appendChild(browzine.script);

browzine.script = document.createElement("script");
browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
document.head.appendChild(browzine.script);
```



# Contributors

## Installation

* `git clone https://github.com/thirdiron/browzine-discovery-service-adapters.git` this repository
* change into the new directory
* `npm install`

## Running / Development

* `npm run server` (Runs a local webserver, visit http://localhost:8080)
* `npm run tunnel` (Creates an ngrok tunnel, place this in the "Summon 2.0 External Script", e.g. https://9f9981c8.ngrok.io/src/summon/browzine-summon-adapter.js)

### Running Tests

* `npm test` (Runs the Karma automated acceptance tests)


### Deploying

CircleCI executes deployments to S3 using the deploy-staging and deploy-production npm commands. Neither feature branches nor hotfix branches are deployed to S3.

The BrowZine Summon Adapter adapter can be found here:

Staging
https://s3.amazonaws.com/browzine-adapters/summon/staging/browzine-summon-adapter.js

Production
https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js

The BrowZine 360 Core Adapter adapter can be found here:

Staging
https://s3.amazonaws.com/browzine-adapters/360-core/staging/browzine-360-core-adapter.js

Production
https://s3.amazonaws.com/browzine-adapters/360-core/browzine-360-core-adapter.js

The BrowZine Primo Adapter adapter can be found here:

Staging
https://s3.amazonaws.com/browzine-adapters/primo/staging/browzine-primo-adapter.js

Production
https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js
