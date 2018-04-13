//window.name = "NG_ENABLE_DEBUG_INFO";

browzine.primo = (function() {
  var api = urlRewrite(browzine.api);
  var apiKey = browzine.apiKey;

  function urlRewrite(url) {
    return url.indexOf("public-api.thirdiron.com") > 0 ? url : url.replace("api.thirdiron.com", "public-api.thirdiron.com");
  };

  function getResult(scope) {
    return scope.result || scope.item;
  };

  function isArticle(scope) {
    var validation = false;
    var result = getResult(scope);

    if(result.pnx) {
      if(result.pnx.display && result.pnx.display.type) {
        var contentType = result.pnx.display.type[0].trim().toLowerCase();

        if(contentType === "article") {
          validation = true;
        }
      }
    }

    return validation;
  };

  function isJournal(scope) {
    var validation = false;
    var result = getResult(scope);

    if(result.pnx) {
      if(result.pnx.display && result.pnx.display.type) {
        var contentType = result.pnx.display.type[0].trim().toLowerCase();

        if(contentType === "journal") {
          validation = true;
        }
      }
    }

    return validation;
  };

  function getIssn(scope) {
    var issn = "";
    var result = getResult(scope);

    if(result.pnx) {
      if(result.pnx.addata && result.pnx.addata.issn) {
        if(result.pnx.addata.issn.length > 1) {
          issn = result.pnx.addata.issn.join(",").trim().replace(/-/g, "");
        } else {
          issn = result.pnx.addata.issn[0].trim().replace("-", "");
        }
      }
    }

    return encodeURIComponent(issn);
  };

  function getDoi(scope) {
    var doi = "";
    var result = getResult(scope);

    if(result.pnx) {
      if(result.pnx.addata && result.pnx.addata.doi) {
        doi = result.pnx.addata.doi[0].trim().replace("-", "");
      }
    }

    return encodeURIComponent(doi);
  };

  function getEndpoint(scope) {
    var endpoint = "";

    if(isArticle(scope)) {
      var doi = getDoi(scope);
      endpoint = api + "/articles/doi/" + doi + "?include=journal";
    }

    if(isJournal(scope)) {
      var issn = getIssn(scope);
      endpoint = api + "/search?issns=" + issn;
    }

    endpoint += "&access_token=" + apiKey;

    return endpoint;
  };

  function shouldEnhance(scope) {
    return !!((isJournal(scope) && getIssn(scope)) || (isArticle(scope) && getDoi(scope)));
  };

  function getData(response) {
    //return Array.isArray(response.data) ? response.data[0] : response.data;
    var data = {};

    if(Array.isArray(response.data)) {
      data = response.data.filter(function(journal) {
        return journal.browzineEnabled === true;
      }).pop();
    } else {
      data = response.data;
    }

    //console.log("data", data);

    return data;
  };

  function getIncludedJournal(response) {
    var journal = null;

    if(response.included) {
      journal = Array.isArray(response.included) ? response.included[0] : response.included;
    }

    return journal;
  };

  function getBrowZineWebLink(data) {
    var browzineWebLink = null;

    if(data && data.browzineWebLink) {
      browzineWebLink = data.browzineWebLink;
    }

    return browzineWebLink;
  };

  function getCoverImageUrl(scope, data, journal) {
    var coverImageUrl = null;

    if(isJournal(scope)) {
      if(data && data.coverImageUrl) {
        coverImageUrl = data.coverImageUrl;
      }
    }

    if(isArticle(scope)) {
      if(journal && journal.coverImageUrl) {
        coverImageUrl = journal.coverImageUrl;
      }
    }

    return coverImageUrl;
  };

  function getBrowZineEnabled(scope, data, journal) {
    var browzineEnabled = false;

    if(isJournal(scope)) {
      if(data && data.browzineEnabled) {
        browzineEnabled = data.browzineEnabled;
      }
    }

    if(isArticle(scope)) {
      if(journal && journal.browzineEnabled) {
        browzineEnabled = journal.browzineEnabled;
      }
    }

    return browzineEnabled;
  };

  function buildTemplate(scope, browzineWebLink) {
    var browzineWebLinkText = "";
    var bookIcon = "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png";

    if(isJournal(scope)) {
      browzineWebLinkText = browzine.journalBrowZineWebLinkText || browzine.primoJournalBrowZineWebLinkText || "View Journal Contents";
    }

    if(isArticle(scope)) {
      browzineWebLinkText = browzine.articleBrowZineWebLinkText || browzine.primoArticleBrowZineWebLinkText || "View Issue Contents";
    }

    var template = "<div class='browzine'>" +
                      "<a href='{browzineWebLink}' target='_blank' title='{browzineWebLinkText} in BrowZine'>" +
                          "<img src='{bookIcon}' class='browzine-icon'/> {browzineWebLinkText}" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{browzineWebLink}/g, browzineWebLink);
    template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
    template = template.replace(/{bookIcon}/g, bookIcon);

    return template;
  };

  function getElement(scope) {
    return scope.$element;
  };

  function getScope($scope) {
    return $scope && $scope.$ctrl && $scope.$ctrl.parentCtrl ? $scope.$ctrl.parentCtrl : undefined;
  };

  // if (!Element.prototype.matches) Element.prototype.matches = Element.prototype.msMatchesSelector;
  // if (!Element.prototype.closest) Element.prototype.closest = function (selector) {
  //     var el = this;
  //     while (el) {
  //         if (el.matches(selector)) {
  //             return el;
  //         }
  //         el = el.parentElement;
  //     }
  // };

  //function addSearchResultLink($scope) {
  function searchResult($scope) {
    //console.log("$scope - addSearchResultLink", $scope);

    var scope = getScope($scope);

    if(!shouldEnhance(scope)) {
      return;
    }

    var endpoint = getEndpoint(scope);
    //console.log("endpoint", endpoint);

    var request = new XMLHttpRequest();
    request.open("GET", endpoint, true);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
      if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
        var response = JSON.parse(request.response);
        //console.log("response", response);

        var data = getData(response);
        var journal = getIncludedJournal(response);

        var browzineWebLink = getBrowZineWebLink(data);
        var coverImageUrl = getCoverImageUrl(scope, data, journal);
        var browzineEnabled = getBrowZineEnabled(scope, data, journal);
        //console.log(browzineWebLink, coverImageUrl, browzineEnabled);

        var element = getElement(scope);
        //console.log("element", element);

        if(browzineWebLink && browzineEnabled) {
          var template = buildTemplate(scope, browzineWebLink);
          //console.log("template", template);
          //$(documentSummary).find(".docFooter .row:eq(0)").append(template);
          element.append(template);
          $scope.$apply();
        }

        if(coverImageUrl && browzineEnabled) {
          console.log("coverImageUrl && browzineEnabled");

          setTimeout(function() {
            //console.log("$scope - setTimeout", $scope);
            var coverImages = element[0].offsetParent.querySelectorAll("prm-search-result-thumbnail-container img");
            //console.log("coverImages", coverImages);

            Array.prototype.forEach.call(coverImages, function(coverImage) {
              coverImage.src = coverImageUrl;
              coverImage["ng-src"] = coverImageUrl;
              $scope.$apply();
            });

            $scope.$apply();
          }, 1000);
        }
      }
    };

    request.send();
  };

  // function addJournalCoverImage($scope) {
  //   return 0;
  //   console.log("$scope - addJournalCoverImage", $scope);
  //   //window.browzine.primo.coverImageUrl = "";
  //
  //   var scope = getScope($scope);
  //
  //   if(!shouldEnhance(scope)) {
  //     //console.log("!shouldEnhance");
  //     return;
  //   }
  //
  //   var endpoint = getEndpoint(scope);
  //   console.log("endpoint", endpoint);
  //
  //   // $scope.$doCheck = function() {
  //   //   console.log("$scope.$doCheck browzine");
  //   // };
  //
  //   var request = new XMLHttpRequest();
  //   request.open("GET", endpoint, true);
  //   request.setRequestHeader("Content-type", "application/json");
  //
  //   request.onload = function() {
  //     if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
  //       var response = JSON.parse(request.response);
  //       console.log("response", response);
  //
  //       var data = getData(response);
  //       var journal = getIncludedJournal(response);
  //
  //       //var browzineWebLink = getBrowZineWebLink(data);
  //       var coverImageUrl = getCoverImageUrl(scope, data, journal);
  //       var browzineEnabled = getBrowZineEnabled(scope, data, journal);
  //       //console.log(browzineWebLink, coverImageUrl, browzineEnabled);
  //
  //       //var element = getElement(scope);
  //       //console.log("element", element);
  //
  //       if(coverImageUrl && browzineEnabled) {
  //         console.log("coverImageUrl && browzineEnabled");
  //
  //         //window.browzine.primo.coverImageUrl = coverImageUrl;
  //
  //         //console.log("$controller", $controller);
  //
  //         setTimeout(function() {
  //           if(scope.selectedThumbnailLink) {
  //             if(coverImageUrl) {
  //               scope.selectedThumbnailLink.linkURL = coverImageUrl;
  //               $scope.$apply();
  //             }
  //           }
  //         }, 1750);
  //
  //
  //         //console.log("setting image1", scope.selectedThumbnailLink);
  //         //console.log("setting image2", $scope.selectedThumbnailLink);
  //         //console.log("$element", $element);
  //         //console.log("find", $element.find("img"));
  //         //scope.selectedThumbnailLink.linkURL = coverImageUrl;
  //
  //         //$element.find("img").src = coverImageUrl;
  //
  //         //scope.$apply();
  //         //$(documentSummary).find(".coverImage img").attr("src", coverImageUrl).attr("ng-src", coverImageUrl).css("box-shadow", "1px 1px 2px #ccc");
  //         //$element.offsetParent.find("img")[0].attr("src", coverImageUrl).attr("ng-src", coverImageUrl);
  //         //console.log(element[0].offsetParent);
  //         //console.log(jQuery, $);
  //         //console.log(element[0].offsetParent.querySelector(".result-item-image img"));
  //         //element[0].offsetParent.querySelector(".result-item-image img").src = coverImageUrl;
  //
  //         //$scope.$ctrl.parentCtrl.selectedThumbnailLink.linkURL = coverImageUrl;
  //         // $scope.$ctrl.parentCtrl = {
  //         //   selectedThumbnailLink: {
  //         //     linkURL: coverImageUrl
  //         //   }
  //         // };
  //
  //         //$scope.$ctrl.selectedThumbnailLink.linkURL = coverImageUrl;
  //         // $scope.$ctrl.selectedThumbnailLink = {
  //         //   linkURL: coverImageUrl
  //         // };
  //         // console.log("$scope.$ctrl.selectedThumbnailLink.linkURL", $scope.$ctrl.selectedThumbnailLink.linkURL);
  //         //$scope.apply();
  //         //$scope.$apply();
  //         //scope.$apply();
  //
  //         //var coverImageElement = element[0].offsetParent.querySelector("prm-search-result-thumbnail-container");
  //         //var coverImageElement = element[0].offsetParent.querySelectorAll("img");
  //         //console.log("coverImageElement", coverImageElement);
  //         //coverImageElement.src = coverImageUrl;
  //
  //       }
  //     }
  //   };
  //
  //   request.send();
  // };

  return {
    // addSearchResultLink: addSearchResultLink,
    // addJournalCoverImage: addJournalCoverImage,
    searchResult: searchResult,
    urlRewrite: urlRewrite,
    isArticle: isArticle,
    isJournal: isJournal,
    getIssn: getIssn,
    getDoi: getDoi,
    getEndpoint: getEndpoint,
    shouldEnhance: shouldEnhance,
    getData: getData,
    getIncludedJournal: getIncludedJournal,
    getBrowZineWebLink: getBrowZineWebLink,
    getCoverImageUrl: getCoverImageUrl,
    getBrowZineEnabled: getBrowZineEnabled,
    buildTemplate: buildTemplate,
    getScope: getScope,
  };
}());

// window.onload = function() {
//   if(!browzine) {
//     return;
//   }
//
//   console.log("window.name", window.name);
//
//   if(!JSON.parse(localStorage.getItem("debugInfoEnabled"))) {
//     localStorage.setItem("debugInfoEnabled", JSON.stringify(true));
//     angular.reloadWithDebugInfo();
//     // window.name = 'NG_ENABLE_DEBUG_INFO!' + window.name;
//     // window.location.reload();
//   }
//
//   // if(!(/^NG_ENABLE_DEBUG_INFO!/.test(window.name))) {
//   //   angular.reloadWithDebugInfo();
//   // }
//
//   //angular.reloadWithDebugInfo();
//   //window.name = "NG_ENABLE_DEBUG_INFO";
//
//   //var results = document;
//   console.log("results", document.querySelector(".results-container"));
//   var results = document;
//
//   var observer = new MutationObserver(function(mutations) {
//     mutations.forEach(function(mutation) {
//       console.log("mutation1", mutation);
//       if(mutation.target.querySelector && mutation.target.querySelector(".results-container")) {
//         console.log("mutation2", mutation);
//         var searchResults = mutation.target;
//         browzine.primo.adapter(searchResults);
//       }
//     });
//   });
//
//   observer.observe(results, {
//     attributes: true,
//     childList: true,
//     characterData: true,
//     subtree: true,
//   });
// };



/*// Define Angular module and whitelist URL of server with Node.js script
var app = angular.module('viewCustom', ['angularLoad'])
  .constant("api", browzine.api)
  .constant("apiKey", browzine.apiKey)

// Add Article In Context & BrowZine Links
app.controller('prmSearchResultAvailabilityLineAfterController', function($scope, $http, api, apiKey) {
  var vm = this;
  api = api.indexOf("public-api.thirdiron.com") > 0 ? api : api.replace("api.thirdiron.com", "public-api.thirdiron.com");
  $scope.primoJournalBrowZineWebLinkText = browzine.primoJournalBrowZineWebLinkText || "View Journal Contents";
  $scope.primoArticleBrowZineWebLinkText = browzine.primoArticleBrowZineWebLinkText || "View Issue Contents";
  $scope.book_icon = "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png";
  if (vm.parentCtrl.result.pnx.addata.doi && vm.parentCtrl.result.pnx.display.type[0] == 'article') {
    vm.doi = vm.parentCtrl.result.pnx.addata.doi[0] || '';
    var endpoint = api + "/articles/doi/" + vm.doi + "?include=journal" + "&access_token=" + apiKey;
    $http.get(endpoint).then(function(response) {
      $scope.article = response.data;
    }, function(error) {
      console.log(error);
    });
  }
  if (vm.parentCtrl.result.pnx.addata.issn && vm.parentCtrl.result.pnx.display.type[0] == 'journal') {
    vm.issn = vm.parentCtrl.result.pnx.addata.issn[0].replace("-", "") || '';
    var endpoint = api + "/search?issns=" + vm.issn + "&access_token=" + apiKey;
    $http.get(endpoint).then(function(response) {
      $scope.journal = response.data;
    }, function(error) {
      console.log(error);
    });
  }
});


// Below is where you can customize the wording that is displayed (as well as the hover over text) for the BrowZine links.
// St Olaf has chosen "View Journal Contents" for the "Journal Availability Link" but other great options include things such as "View Journal" or "View this Journal"
// St Olaf is using "View Issue Contents" for the "Article in Context" link but another great option is "View Complete Issue" or "View Article in Context".
// St Olaf also has added a hover over link that says "Via BrowZine" to emphasize the interaction being used.

app.component('prmSearchResultAvailabilityLineAfter', {
  bindings: {
    parentCtrl: '<'
  },
  controller: 'prmSearchResultAvailabilityLineAfterController',
  template: '<div ng-if="article.data.browzineWebLink"><a href="{{ article.data.browzineWebLink }}" target="_blank" title="Via BrowZine"><img src="https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png" class="browzine-icon"> {{}} <md-icon md-svg-icon="primo-ui:open-in-new" aria-label="icon-open-in-new" role="img" class="browzine-external-link"><svg id="open-in-new_cache29" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"></svg></md-icon></a></div><div ng-if="journal.data[0].browzineWebLink"><a href="{{ journal.data[0].browzineWebLink }}" target="_blank" title="Via BrowZine"><img src="https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png" class="browzine-icon"> {{primoJournalBrowZineWebLinkText}} <md-icon md-svg-icon="primo-ui:open-in-new" aria-label="icon-open-in-new" role="img" class="browzine-external-link"><svg id="open-in-new_cache29" width="100%" height="100%" viewBox="0 0 24 24" y="504" xmlns="http://www.w3.org/2000/svg" fit="" preserveAspectRatio="xMidYMid meet" focusable="false"></svg></md-icon></a></div>'
});

// Add Journal Cover Images from BrowZine
app.controller('prmSearchResultThumbnailContainerAfterController', function($scope, $http, api, apiKey) {
  var vm = this;
  api = api.replace("api.thirdiron.com", "public-api.thirdiron.com");
  var newThumbnail = '';
  // checking for item property as this seems to impact virtual shelf browse (for reasons as yet unknown)
  if (vm.parentCtrl.item && vm.parentCtrl.item.pnx.addata.issn) {
    vm.issn = vm.parentCtrl.item.pnx.addata.issn[0].replace("-", "") || '';
    var endpoint = api + "/search?issns=" + vm.issn + "&access_token=" + apiKey;
    $http.get(endpoint).then(function(response) {
      if (response.data.data["0"] && response.data.data["0"].browzineEnabled) {
        newThumbnail = response.data.data["0"].coverImageUrl;
      }
    }, function(error) {
      console.log(error); //
    });
  }
  vm.$doCheck = function(changes) {
    if (vm.parentCtrl.selectedThumbnailLink) {
      if (newThumbnail != '') {
        vm.parentCtrl.selectedThumbnailLink.linkURL = newThumbnail;
      }
    }
  };
});

app.component('prmSearchResultThumbnailContainerAfter', {
  bindings: {
    parentCtrl: '<'
  },
  controller: 'prmSearchResultThumbnailContainerAfterController'
});*/
