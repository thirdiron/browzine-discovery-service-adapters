browzine.serSol360Core = (function() {
  var api = browzine.api;
  var apiKey = browzine.apiKey;

  function getQueryVariable(url, key) {
    var query = url.split("?")[1];
    var parameters = query.split("&");
    var value = "";

    for(var i = 0; i < parameters.length; i++) {
      var pair = parameters[i].split("=");

      if(pair[0] == key) {
        value = pair[1];
        return value;
      }
    }

    return value;
  }

  function getIssn(title) {
    var issn = "";

    //Using the base image url, if an issn exists, then the issn query parameter will be the issn.
    //However, if only an eissn exists, then the issn query parameter value will be the eissn.
    //This way we're able to account for both issn and eissn journal identifiers.
    //e.g. "History matters (Boone, N.C.)"
    if(title.syndeticsImageUrl) {
      issn = getQueryVariable(title.syndeticsImageUrl, "issn");
    }

    return encodeURIComponent(issn);
  };

  function getTarget(issn) {
    var element = $(".results-identifier:contains('" + issn + "')").closest(".results-title-row");
    var target = element.length > 0 ? element[0] : undefined;

    return target;
  };

  function getEndpoint(issn) {
    var endpoint = null;

    if(issn) {
      endpoint = api + "/search?issns=" + issn.trim().replace("-", "");
      endpoint += "&access_token=" + apiKey;
    }

    return endpoint;
  };

  function shouldEnhance(issn) {
    return !!issn;
  };

  function addTargets(titles) {
    var titlesToEnhance = [];

    titles.forEach(function(title) {
      var issn = getIssn(title);
      title.target = getTarget(issn);
      title.endpoint = getEndpoint(issn);
      title.shouldEnhance = shouldEnhance(issn);

      if(title.shouldEnhance) {
        titlesToEnhance.push(title);
      }
    });

    return titlesToEnhance;
  };

  function getTitles(scope) {
    var titles = [];

    if(scope) {
      if(scope.searchResultsCtrl) {
        if(scope.searchResultsCtrl.titleData) {
          if(scope.searchResultsCtrl.titleData.titles) {
            titles = angular.copy(scope.searchResultsCtrl.titleData.titles);
          }
        }
      }
    }

    return titles;
  };

  function getScope(searchResults) {
    return angular.element(searchResults).scope();
  };

  function getData(response) {
    return Array.isArray(response.data) ? response.data[0] : response.data;
  };

  function getBrowZineWebLink(data) {
    var browzineWebLink = null;

    if(data.browzineWebLink) {
      browzineWebLink = data.browzineWebLink;
    }

    return browzineWebLink;
  };

  function getCoverImageUrl(data) {
    var coverImageUrl = null;

    if(data.coverImageUrl) {
      coverImageUrl = data.coverImageUrl;
    }

    return coverImageUrl;
  };

  function buildTemplate(browzineWebLink) {
    var browzineWebLinkText = "";
    var bookIcon = "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png";

    browzineWebLinkText = browzine.serSol360CoreJournalBrowZineWebLinkText || "View Journal in BrowZine";

    var template = "<div class='browzine' style='margin: 5px 0;'>" +
                     "<img class='browzine-book-icon' src='{bookIcon}' style='margin-top: -3px;'/> " +
                     "<a class='browzine-web-link' href='{browzineWebLink}' target='_blank' style='font-weight: 300;'>{browzineWebLinkText}</a>" +
                   "</div>";

    template = template.replace(/{browzineWebLink}/g, browzineWebLink);
    template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
    template = template.replace(/{bookIcon}/g, bookIcon);

    return template;
  };

  function searchTitles(titles, callback) {
    var title = titles.shift();

    if(title) {
      $.getJSON(title.endpoint, function(response) {
        var data = getData(response);
        var browzineWebLink = getBrowZineWebLink(data);
        var coverImageUrl = getCoverImageUrl(data);

        if(browzineWebLink) {
          var template = buildTemplate(browzineWebLink);
          $(title.target).find(".results-identifier").append(template);
        }

        if(coverImageUrl) {
          $(title.target).find("img.results-title-image").attr("src", coverImageUrl).attr("ng-src", coverImageUrl);
        }

        if(titles.length > 0) {
          searchTitles(titles, callback);
        } else {
          if(callback) {
            return callback();
          }
        }
      });
    }
  };

  function adapter(searchResults) {
    var scope = getScope(searchResults);
    var titles = addTargets(getTitles(scope));

    if(titles.length === 0) {
      return;
    }

    searchTitles(titles);
  };

  return {
    adapter: adapter,
    buildTemplate: buildTemplate,
    getCoverImageUrl: getCoverImageUrl,
    getBrowZineWebLink: getBrowZineWebLink,
    getData: getData,
    getScope: getScope,
    getTitles: getTitles,
    addTargets: addTargets,
    shouldEnhance: shouldEnhance,
    getEndpoint: getEndpoint,
    getTarget: getTarget,
    getIssn: getIssn,
    getQueryVariable: getQueryVariable,
    searchTitles: searchTitles,
  };
}());

$(function() {
  if(!browzine) {
    return;
  }

  var results = document;

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.target.querySelector && mutation.target.querySelector(".results-title-data")) {
        var searchResults = mutation.target;
        browzine.serSol360Core.adapter(searchResults);
      }
    });
  });

  observer.observe(results, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  });
});
