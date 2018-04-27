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

    if(result && result.pnx) {
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

    if(result && result.pnx) {
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

    if(result && result.pnx && result.pnx.addata) {
      if(result.pnx.addata.issn) {
        if(result.pnx.addata.issn.length > 1) {
          issn = result.pnx.addata.issn.join(",").trim().replace(/-/g, "");
        } else {
          if(result.pnx.addata.issn[0]) {
            issn = result.pnx.addata.issn[0].trim().replace("-", "");
          }
        }
      }

      if(result.pnx.addata.eissn && !issn) {
        if(result.pnx.addata.eissn.length > 1) {
          issn = result.pnx.addata.eissn.join(",").trim().replace(/-/g, "");
        } else {
          if(result.pnx.addata.eissn[0]) {
            issn = result.pnx.addata.eissn[0].trim().replace("-", "");
          }
        }
      }
    }

    return encodeURIComponent(issn);
  };

  function getDoi(scope) {
    var doi = "";
    var result = getResult(scope);

    if(result && result.pnx) {
      if(result.pnx.addata && result.pnx.addata.doi) {
        if(result.pnx.addata.doi[0]) {
          doi = result.pnx.addata.doi[0].trim().replace("-", "");
        }
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
    var data = {};

    if(Array.isArray(response.data)) {
      data = response.data.filter(function(journal) {
        return journal.browzineEnabled === true;
      }).pop();
    } else {
      data = response.data;
    }

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
    var bookIcon = "https://assets.thirdiron.com/images/integrations/browzine_open_book_icon.png";

    if(isJournal(scope)) {

      if(typeof browzine.primoJournalBrowZineWebLinkText !== 'undefined') {

        if(browzine.primoJournalBrowZineWebLinkText  === null || browzine.primoJournalBrowZineWebLinkText  === "") {
          // Var purposely empty in Primo JS file, service NOT wanted so set to empty string 
          browzineWebLinkText = "";
        } else {
          // Var exists in Primo JS file, CUSTOMIZED service wanted so set to var-string value
          browzineWebLinkText = browzine.journalBrowZineWebLinkText || browzine.primoJournalBrowZineWebLinkText;
        }
      } else {
        // Var not present in Primo JS file, DEFAULT service wanted so set to suggested string
        browzineWebLinkText = "View Journal Contents";
      }
    }

    if(isArticle(scope)) {

      if(typeof browzine.primoArticleBrowZineWebLinkText !== 'undefined') {

        if(browzine.primoArticleBrowZineWebLinkText  === null || browzine.primoArticleBrowZineWebLinkText  === "") {
          // Var purposely empty in Primo JS file, service NOT wanted so set to empty string  
          browzineWebLinkText = "";
        } else {
          // Var exists in Primo JS file, CUSTOMIZED service wanted so set to var-string value
          browzineWebLinkText = browzine.articleBrowZineWebLinkText || browzine.primoArticleBrowZineWebLinkText;
        }
      } else {
        // Var not present in Primo JS file, DEFAULT service wanted so set to suggested string
        browzineWebLinkText = "View Issue Contents";
      }
    }

    var template = "<!-- Browzine web link is turned off. -->";
    if(browzineWebLinkText !== "") {
      template = "<div class='browzine'>" +
                    "<a class='browzine-web-link' href='{browzineWebLink}' target='_blank' title='{browzineWebLinkText} in BrowZine'>" +
                        "<img src='{bookIcon}' class='browzine-book-icon'/> {browzineWebLinkText}" +
                    "</a>" +
                 "</div>";
   
      template = template.replace(/{browzineWebLink}/g, browzineWebLink);
      template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
      template = template.replace(/{bookIcon}/g, bookIcon);
    }

    return template;
  };

  function getElement(scope) {
    return scope.$element;
  };

  function getElementParent(element) {
    return element[0].offsetParent || element[0];
  };

  function getScope($scope) {
    return $scope && $scope.$ctrl && $scope.$ctrl.parentCtrl ? $scope.$ctrl.parentCtrl : undefined;
  };

  function searchResult($scope) {
    var scope = getScope($scope);

    if(!shouldEnhance(scope)) {
      return;
    }

    var endpoint = getEndpoint(scope);

    var request = new XMLHttpRequest();
    request.open("GET", endpoint, true);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
      if(request.readyState == XMLHttpRequest.DONE && request.status == 200) {
        var response = JSON.parse(request.response);

        var data = getData(response);
        var journal = getIncludedJournal(response);

        var browzineWebLink = getBrowZineWebLink(data);
        var coverImageUrl = getCoverImageUrl(scope, data, journal);
        var browzineEnabled = getBrowZineEnabled(scope, data, journal);
        var element = getElement(scope);

        if(browzineWebLink && browzineEnabled) {
          var template = buildTemplate(scope, browzineWebLink);
          element.append(template);
          $scope.$apply();
        }

        if(coverImageUrl && browzineEnabled) {
          setTimeout(function() {
            var elementParent = getElementParent(element);
            var coverImages = elementParent.querySelectorAll("prm-search-result-thumbnail-container img");

            Array.prototype.forEach.call(coverImages, function(coverImage) {
              coverImage.src = coverImageUrl;
              $scope.$apply();
            });

            $scope.$apply();
          }, 1000);
        }
      }
    };

    request.send();
  };

  return {
    searchResult: searchResult,
    urlRewrite: urlRewrite,
    getResult: getResult,
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
    getElement: getElement,
    getElementParent: getElementParent,
    getScope: getScope,
  };
}());
