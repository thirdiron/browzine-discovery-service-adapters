// Define Angular module and whitelist URL of server with Node.js script
var app = angular.module("viewCustom", ["angularLoad"])
  .constant("api", browzine.api)
  .constant("apiKey", browzine.apiKey)
  // .config(["$sceDelegateProvider", "api", function($sceDelegateProvider, api) {
  //   var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
  //   urlWhitelist.push(api + "**");
  //   $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
  // }]);
  // .constant("api", "https://apiconnector.thirdiron.com/v1/libraries/1252")
  // .config(["$sceDelegateProvider", "api", function($sceDelegateProvider, api) {
  //   var urlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
  //   urlWhitelist.push(api + "**");
  //   $sceDelegateProvider.resourceUrlWhitelist(urlWhitelist);
  // }]);

// Add Article In Context & BrowZine Links
app.controller("prmSearchResultAvailabilityLineAfterController", function($scope, $http, $sce, api, apiKey) {
  console.log("prmSearchResultAvailabilityLineAfterController");
  console.log($scope);
  //console.log($sce);
  $scope.book_icon = "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png";

  if (this.parentCtrl.result.pnx.addata.doi && this.parentCtrl.result.pnx.display.type[0] == "article") {
    this.doi = this.parentCtrl.result.pnx.addata.doi[0] || "";
    var endpoint = api + "/articles/doi/" + this.doi + "?include=journal" + "&access_token=" + apiKey;
    console.log(endpoint);

    $http.get(endpoint).then(function(response) {
      console.log("response", response);
      $scope.article = response.data;
    }, function(error) {
      console.log("error1");
      console.log(error);
    });
  }

  if (this.parentCtrl.result.pnx.addata.issn && this.parentCtrl.result.pnx.display.type[0] == "journal") {
    this.issn = this.parentCtrl.result.pnx.addata.issn[0].replace("-", "") || "";
    var endpoint = api + "/search?issns=" + this.issn + "&access_token=" + apiKey;

    $http.get(endpoint).then(function(response) {
      $scope.journal = response.data;
    }, function(error) {
      console.log("error2");
      console.log(error);
    });
  }

});


// Below is where you can customize the wording that is displayed (as well as the hover over text) for the BrowZine links.
// St Olaf has chosen "View Journal Contents" for the "Journal Availability Link" but other great options include things such as "View Journal" or "View this Journal"
// St Olaf is using "View Issue Contents" for the "Article in Context" link but another great option is "View Complete Issue" or "View Article in Context".
// St Olaf also has added a hover over link that says "Via BrowZine" to emphasize the interaction being used.
app.component("prmSearchResultAvailabilityLineAfter", {
  bindings: {
    parentCtrl: "<"
  },
  controller: "prmSearchResultAvailabilityLineAfterController",
  template: '<div ng-if="article.data.browzineWebLink"><a href="{{ article.data.browzineWebLink }}" target="_blank" title="Via BrowZine"><img src="https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png" class="browzine-icon"> View Issue Contents <md-icon md-svg-icon="primo-ui:open-in-new" aria-label="icon-open-in-new" role="img" class="browzine-external-link"><svg id="open-in-new_cache29" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"></svg></md-icon></a></div><div ng-if="journal.data[0].browzineWebLink"><a href="{{ journal.data[0].browzineWebLink }}" target="_blank" title="Via BrowZine"><img src="https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png" class="browzine-icon"> View Journal Contents <md-icon md-svg-icon="primo-ui:open-in-new" aria-label="icon-open-in-new" role="img" class="browzine-external-link"><svg id="open-in-new_cache29" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"></svg></md-icon></a></div>'
});

// Add Journal Cover Images from BrowZine
app.controller("prmSearchResultThumbnailContainerAfterController", function($scope, $http, $sce, api, apiKey) {
  console.log("prmSearchResultThumbnailContainerAfterController");
  console.log($scope);
  newThumbnail = "";
  var _this = this;
  // checking for item property as this seems to impact virtual shelf browse (for reasons as yet unknown)
  if (this.parentCtrl.item && this.parentCtrl.item.pnx.addata.issn) {
    this.issn = this.parentCtrl.item.pnx.addata.issn[0].replace("-", "") || "";
    //var journalURL = api + "/journals?ISSN=" + this.issn;
    var endpoint = api + "/search?issns=" + this.issn + "&access_token=" + apiKey;
    console.log(endpoint);

    $http.get(endpoint).then(function(response) {
      if (response.data.data["0"] && response.data.data["0"].browzineEnabled) {
        newThumbnail = response.data.data["0"].coverImageUrl;
        console.log("newThumbnail", newThumbnail);
        // console.log("coverImageUrl", coverImageUrl);
        //
        // if (_this.parentCtrl.selectedThumbnailLink) {
        //   _this.parentCtrl.selectedThumbnailLink.linkURL = newThumbnail;
        // }
      }
    }, function(error) {
      console.log("error3");
      console.log(error);
    });
  }

  this.$doCheck = function (changes) {
    if (this.parentCtrl.selectedThumbnailLink) {
      if (newThumbnail != '') {
        this.parentCtrl.selectedThumbnailLink.linkURL = newThumbnail;
      }
    }
  };
});

app.component("prmSearchResultThumbnailContainerAfter", {
  bindings: {
    parentCtrl: "<"
  },
  controller: "prmSearchResultThumbnailContainerAfterController"
});

// Enhance no results
app.controller("prmNoSearchResultAfterController", [function() {
  this.getSearchTerm = getSearchTerm;

  function getSearchTerm() {
    return this.parentCtrl.term;
  }
}]);

app.component("prmNoSearchResultAfter", {
  bindings: {
    parentCtrl: "<"
  },
  controller: "prmNoSearchResultAfterController",
  template: '<md-card class="default-card zero-margin _md md-primoExplore-theme">\n\t\t\t\t\t<md-card-title>\n\t\t\t\t\t\t<md-card-title-text>\n\t\t\t\t\t\t\t<span translate="" class="md-headline ng-scope">No records found</span>\n\t\t\t\t\t\t</md-card-title-text>\n\t\t\t\t\t</md-card-title>\n\t\t\t\t\t<md-card-content>\n\t\t\t\t\t\n\t\t\t\t\t\t\n\t\t\t\t\t\t<p>\n\t\t\t\t\t\t<span>There are no results matching your search:\n\t\t\t\t\t\t<blockquote><i>{{$ctrl.getSearchTerm()}}</i>.</blockquote>\n\t\t\t\t\t\t<!-- Update to your domain and view code -->\n\t\t\t\t\t\t<a href="https://sandbox01-na.alma.exlibrisgroup.com/discovery/search?query=any,contains,{{$ctrl.getSearchTerm()}}&tab=Everything&search_scope=MyInst_and_CI&vid=01COLSCHL_INST:MINES&offset=0&sortby=rank&pcAvailability=true"><b>Try again and include items with no full text?</b></a>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t</p>\n\t\t\t\t\t\t<p><span translate="" class="bold-text ng-scope">Suggestions:</span></p>\n\t\t\t\t\t\t<ul><li translate="" class="ng-scope">Make sure that all words are spelled correctly.</li>\n\t\t\t\t\t\t<li translate="" class="ng-scope">Try a different search scope.</li>\n\t\t\t\t\t\t<li translate="" class="ng-scope">Try different search terms.</li>\n\t\t\t\t\t\t<li translate="" class="ng-scope">Try more general search terms.</li>\n\t\t\t\t\t\t<li translate="" class="ng-scope">Try fewer search terms.</li>\n\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t<!-- Other helpful links -->\n\t\t\t\t\t\t<p><b><a href="http://www.worldcat.org/">Search WorldCat</a></b></p>\n\t\t\t\t\t\t<p><b><a href="http://library.mines.edu/LIB-ask-librarian">Contact a Research Librarian for Assistance</a></b></p>\n\t\t\t\t\t</md-card-content>\n\t\t\t\t   </md-card>'
});
