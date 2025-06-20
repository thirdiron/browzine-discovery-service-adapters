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


## How to request your libraryId and apiKey
Visit Third Iron support to request your library Id and API Key - http://support.thirdiron.com/

You will receive your `libraryId` and your `apiKey`.


## Summon Adapter Installation

### BrowZine Summon Adapter Script
Update the following code snippet with your `libraryId` and `apiKey` values:

```
var browzine = {
  libraryId: "XXX",
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

e.g. You can customize "View the Journal", "View Complete Issue", "Browse Now" and whether to enable direct to PDF links. These customizations are optional and the defaults are shown below.

Please note a valid institutional email address is required to use the Unpaywall feature in LibKey Discovery.

BrowZine discovery service adapter script version 2 or greater allows the customer to override default text.

```
var browzine = {
  version: 2,

  libraryId: "XXX",
  apiKey: "ENTER API KEY",

  articlePDFDownloadLinkEnabled: true,
  articlePDFDownloadWording: "View Now",
  articlePDFDownloadLinkText: "PDF",

  articleLinkEnabled: true,
  articleLinkTextWording: "View Now",
  articleLinkText: "Article Page",

  articleWording: "View in Context",
  articleBrowZineWebLinkText: "Browse Journal",

  journalWording: "View the Journal",
  journalBrowZineWebLinkText: "Browse Now",

  printRecordsIntegrationEnabled: true,

  unpaywallEmailAddressKey: "info@thirdiron.com",

  articlePDFDownloadViaUnpaywallEnabled: true,
  articlePDFDownloadViaUnpaywallWording: "View Now (via Unpaywall)",
  articlePDFDownloadViaUnpaywallLinkText: "PDF",

  articleLinkViaUnpaywallEnabled: true,
  articleLinkViaUnpaywallWording: "View Now (via Unpaywall)",
  articleLinkViaUnpaywallLinkText: "Article Page",

  articleAcceptedManuscriptPDFViaUnpaywallEnabled: true,
  articleAcceptedManuscriptPDFViaUnpaywallWording: "View Now (Accepted Manuscript via Unpaywall)",
  articleAcceptedManuscriptPDFViaUnpaywallLinkText: "PDF",

  articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
  articleAcceptedManuscriptArticleLinkViaUnpaywallWording: "View Now (via Unpaywall)",
  articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText: "Article Page",

  articleRetractionWatchEnabled: true,
  articleRetractionWatchTextWording: "Retracted Article",
  articleRetractionWatchText: "More Info",

  articleExpressionOfConcernEnabled: true,
  articleExpressionOfConcernWording: "Expression of Concern",
  articleExpressionOfConcernText: "More Info",

  problematicJournalEnabled: true,
  problematicJournalWording: "Problematic Journal",
  problematicJournalText: "More Info",

  documentDeliveryFulfillmentWording: "Request Now",
  documentDeliveryFulfillmentText: "PDF",

  iconColor: "#639add",

  showFormatChoice: true,
  showLinkResolverLink: true,

  enableLinkOptimizer: true,
};
```



## 360 Core Adapter Installation


### BrowZine 360 Core Adapter Script
Update the following code snippet with your `libraryId` and `apiKey` values:
```
var browzine = {
  libraryId: "XXX",
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

### 360 Core Adapter Customizations

Customize the naming conventions for each type of search result - Journal - by changing the wording in the quotes below:

e.g. You can customize "View Journal in BrowZine" to be a different phrase.

```
var browzine = {
  libraryId: "XXX",
  apiKey: "ENTER API KEY",

  journalCoverImagesEnabled: true,

  journalBrowZineWebLinkTextEnabled: true,
  journalBrowZineWebLinkText: "View Journal in BrowZine",
};
```

## Primo Adapter Installation


### BrowZine Primo Adapter Script
Update the following code snippet with your `libraryId` and `apiKey` values:
```
(function () {
  "use strict";

  var app = angular.module('viewCustom', ['angularLoad']);

  // Load BrowZine Adapter
  window.browzine = {
    libraryId: "XXX",
    apiKey: "ENTER API KEY",
  };

  browzine.script = document.createElement("script");
  browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/primo/browzine-primo-adapter.js";
  document.head.appendChild(browzine.script);

  app.controller('prmSearchResultAvailabilityLineAfterController', function($scope) {
    window.browzine.primo.searchResult($scope);
  });

  app.component('prmSearchResultAvailabilityLineAfter', {
    bindings: { parentCtrl: '<' },
    controller: 'prmSearchResultAvailabilityLineAfterController'
  });
})();
```

### Adding Primo Custom Script

Upload this custom Primo package to your Primo view or add the contents of /js/custom.js to your existing customized Primo package. Then upload 01COLSCHL_INST-BRZN.zip in Primo at Configure Views > 01COLSCHL_INST:BRZNTEST.

Upload Steps:
```
Edit the 01COLSCHL_INST:BRZNTEST view.
Then go to Manage Customization Package.
Under Upload Package, select the Customization Package 01COLSCHL_INST-BRZN.zip.
Then click Upload.
Then in the View Configuration header click Save.
```

Here's a sample view package (if needed):
https://s3.amazonaws.com/browzine-adapters/primo/01COLSCHL_INST-BRZN.zip

But, if available, just download the Current View Customization Package under the Download Package section and use that as your starting package.

![Primo External Script](https://i.imgur.com/EcZDAaC.png "PrimoExternal Script")

### Primo Adapter Customizations

Customize the naming conventions for each type of search result - Journal/Article - by changing the wording in the quotes below:

e.g. You can customize "View Issue Contents" to be a different phrase.

Please note a valid institutional email address is required to use the Unpaywall feature in LibKey Discovery.

```
window.browzine = {
  libraryId: "XXX",
  apiKey: "ENTER API KEY",

  journalCoverImagesEnabled: true,

  journalBrowZineWebLinkTextEnabled: true,
  journalBrowZineWebLinkText: "View Journal Contents",

  articleBrowZineWebLinkTextEnabled: true,
  articleBrowZineWebLinkText: "View Issue Contents",

  articlePDFDownloadLinkEnabled: true,
  articlePDFDownloadLinkText: "Download PDF",

  articleLinkEnabled: true,
  articleLinkText: "Read Article",

  printRecordsIntegrationEnabled: true,

  unpaywallEmailAddressKey: "enter-your-email@your-institution-domain.edu",

  articlePDFDownloadViaUnpaywallEnabled: true,
  articlePDFDownloadViaUnpaywallText: "Download PDF (via Unpaywall)",

  articleLinkViaUnpaywallEnabled: true,
  articleLinkViaUnpaywallText: "Read Article (via Unpaywall)",

  articleAcceptedManuscriptPDFViaUnpaywallEnabled: true,
  articleAcceptedManuscriptPDFViaUnpaywallText: "Download PDF (Accepted Manuscript via Unpaywall)",

  articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled: true,
  articleAcceptedManuscriptArticleLinkViaUnpaywallText: "Read Article (Accepted Manuscript via Unpaywall)",

  articleRetractionWatchEnabled: true,
  articleRetractionWatchText: "Retracted Article",

  articleExpressionOfConcernEnabled: true,
  articleExpressionOfConcernText: "Expression of Concern",

  problematicJournalEnabled: true,
  problematicJournalText: "Problematic Journal",

  documentDeliveryFulfillmentText: "Request PDF",

  showFormatChoice: true,
  showLinkResolverLink: true,

  enableLinkOptimizer: true,
};
```


# Contributors

## Browser Compatibility and Support

Enhancements and Bugfixes should be developed against the ES5 standard and tested against evergreen browsers and IE11+.
Care should be taken to validate JavaScript features used are available in IE11+ and evergreen browsers to gain the widest customer base support as possible. See, https://caniuse.com/#feat=es5

## Installation

* `git clone https://github.com/thirdiron/browzine-discovery-service-adapters.git` this repository
* change into the new directory
* `npm install`

## Running / Development

* There are two ways to run code locally in order to test changes
  1. Copy code into a Google override.
    - When facing a customer problem with Primo for example, this is the easiest way to test changes to their custom.js file. This method is also used when determining problems that may
      stem from the code, such as when working on SerSol 360 problems.
      * To do this, open the dev tools in Chrome on the problem instance of Primo. Click the source tab and navigate either to the customer's custom.js file, or to the Amazon S3 file to see our code.
      * From here you can make changes to the code and press CTRL/CMD + S to save a local override. Note, you may need to enable local overrides by checking the box under the overrides tab ![seen here](<CleanShot 2024-12-17 at 15.30.21.png>)
  2. Uploading a Copy to the S3 Test Bucket
    - When making a code change and needing to test out new code functions, the easiest way to test is to upload a copy of the code to the S3 Test Bucket.
      * Once you've made changes to the code log into your TI S3 account.
      * Once in click S3 > browzine-adapters > primo-test
      * Here you can click upload, and drag your local copy of the browzine-primo-adapter.js into S3
      * Scroll down and uncollapse the permissions dropdown and check "Grant public read access". Everything else can stay as is.
      * In the custom.js we use for testing, change the S3 url to point to this test bucket and upload to our sandbox as normal.
      * The sandbox instance should now be pointing to code with your new changes!
      * You will need to repeat the process each time you make a change.

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
