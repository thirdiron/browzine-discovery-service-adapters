browzine.serSol360Core = (function() {
  var api = urlRewrite(browzine.api);
  var apiKey = browzine.apiKey;

  function urlRewrite(url) {
    return url.indexOf("public-api.thirdiron.com") > 0 ? url : url.replace("api.thirdiron.com", "public-api.thirdiron.com");
  };

  function getIssn(title) {
    if(title.identifiers) {
      var issnIdentifier = title.identifiers.filter(function(identifier) {
        if(identifier.type && identifier.value) {
          return identifier.type.toLowerCase() === "issn" && identifier.value.length > 0;
        }
      }).pop();

      if(issnIdentifier) {
        return encodeURIComponent(issnIdentifier.value);
      }

      var eissnIdentifier = title.identifiers.filter(function(identifier) {
        if(identifier.type && identifier.value) {
          return identifier.type.toLowerCase() === "eissn" && identifier.value.length > 0;
        }
      }).pop();

      if(eissnIdentifier) {
        return encodeURIComponent(eissnIdentifier.value);
      }
    }

    return "";
  };

  function getJournalName(title) {
    return (title && title.title) ? title.title : '';
  };

  function getTarget(title) {
    var journalName = getJournalName(title);

    var element = $(".results-title").filter(function() {
      return $.trim($(this).text()) === journalName;
    }).closest(".results-title-row");

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
      title.target = getTarget(title);
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

    if(data && data.browzineWebLink) {
      browzineWebLink = data.browzineWebLink;
    }

    return browzineWebLink;
  };

  function getCoverImageUrl(data) {
    var coverImageUrl = null;

    if(data && data.coverImageUrl) {
      coverImageUrl = data.coverImageUrl;
    }

    return coverImageUrl;
  };

  function getBrowZineEnabled(data) {
    var browzineEnabled = null;

    if(data && data.browzineEnabled) {
      browzineEnabled = data.browzineEnabled;
    }

    return browzineEnabled;
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
        var browzineEnabled = getBrowZineEnabled(data);

        if(browzineWebLink) {
          var template = buildTemplate(browzineWebLink);
          $(title.target).find(".results-identifier").append(template);
        }

        if(coverImageUrl && browzineEnabled) {
          var resultsTitleImageContainerSelector = ".results-title-image-div";
          var resultsTitleImageSelector = ".results-title-image-div img.results-title-image";
          var boxShadow = "1px 1px 2px #ccc";

          if($(title.target).find(resultsTitleImageSelector).length > 0) {
            $(title.target).find(resultsTitleImageSelector).attr("src", coverImageUrl).attr("ng-src", coverImageUrl).css("box-shadow", boxShadow);
          } else {
            $(title.target).find(resultsTitleImageContainerSelector).append("<img class='results-title-image'/>");
            $(title.target).find(resultsTitleImageSelector).attr("src", coverImageUrl).attr("ng-src", coverImageUrl).css("box-shadow", boxShadow);
          }
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
    getJournalName: getJournalName,
    getTarget: getTarget,
    getIssn: getIssn,
    getBrowZineEnabled: getBrowZineEnabled,
    searchTitles: searchTitles,
    urlRewrite: urlRewrite,
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
