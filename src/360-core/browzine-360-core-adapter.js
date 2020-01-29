browzine.serSol360Core = (function() {
  var libraryId = browzine.libraryId;
  var api = libraryIdOverride(urlRewrite(browzine.api));
  var apiKey = browzine.apiKey;

  function urlRewrite(url) {
    if(!url) {
      return;
    }

    return url.indexOf("public-api.thirdiron.com") > -1 ? url : url.replace("api.thirdiron.com", "public-api.thirdiron.com");
  };

  function libraryIdOverride(url) {
    var override = url;
    var libraryId = browzine.libraryId;

    if(libraryId) {
      var baseUrl = "https://public-api.thirdiron.com/public/v1/libraries/{libraryId}";
      override = baseUrl.replace(/{libraryId}/g, libraryId);
    }

    return override;
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
    var issn = getIssn(title).toLowerCase().trim();

    var element = $(".results-identifier").filter(function() {
      return $.trim($(this).text()).toLowerCase().indexOf(issn) > -1 && issn.length > 0;
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

  function isDefaultCoverImage(coverImageUrl) {
    var defaultCoverImage = false;

    if(coverImageUrl && coverImageUrl.toLowerCase().indexOf("default") > -1) {
      defaultCoverImage = true;
    }

    return defaultCoverImage;
  };

  function showJournalCoverImages() {
    var featureEnabled = false;
    var config = browzine.journalCoverImagesEnabled;

    if(typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showJournalBrowZineWebLinkText() {
    var featureEnabled = false;
    var config = browzine.journalBrowZineWebLinkTextEnabled;

    if(typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function shouldEnhance(issn) {
    return !!issn;
  };

  function transition(event, anchor) {
    event.preventDefault();
    event.stopPropagation();

    window.open(anchor.href, anchor.target);

    return false;
  };

  function browzineWebLinkTemplate(browzineWebLink) {
    var browzineWebLinkText = "";
    var bookIcon = "https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg";

    browzineWebLinkText = browzine.journalBrowZineWebLinkText || browzine.serSol360CoreJournalBrowZineWebLinkText || "View Journal in BrowZine";

    var template = "<div class='browzine' style='margin: 5px 0;'>" +
                     "<img alt='BrowZine Book Icon' class='browzine-book-icon' src='{bookIcon}' style='margin-top: -3px; display: inline;' width='16' height='15'/> " +
                     "<a class='browzine-web-link' href='{browzineWebLink}' target='_blank' style='font-weight: 300;' onclick='browzine.serSol360Core.transition(event, this)'>{browzineWebLinkText}</a>" +
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
        var defaultCoverImage = isDefaultCoverImage(coverImageUrl);

        if(browzineWebLink && showJournalBrowZineWebLinkText()) {
          var template = browzineWebLinkTemplate(browzineWebLink);
          $(title.target).find(".results-identifier").append(template);
        }

        if(coverImageUrl && !defaultCoverImage && showJournalCoverImages()) {
          var resultsTitleImageContainerSelector = ".results-title-image-div";
          var resultsTitleImageSelector = ".results-title-image-div img.results-title-image";
          var boxShadow = "1px 1px 2px #ccc";

          if($(title.target).find(resultsTitleImageSelector).length > 0) {
            $(title.target).find(resultsTitleImageSelector).attr("src", coverImageUrl).attr("ng-src", coverImageUrl).css("box-shadow", boxShadow);
          } else {
            $(title.target).find(resultsTitleImageContainerSelector).append("<img alt='Results Title Image' class='results-title-image'/>");
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
    transition: transition,
    browzineWebLinkTemplate: browzineWebLinkTemplate,
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
    isDefaultCoverImage: isDefaultCoverImage,
    searchTitles: searchTitles,
    urlRewrite: urlRewrite,
    libraryIdOverride: libraryIdOverride,
    showJournalCoverImages: showJournalCoverImages,
    showJournalBrowZineWebLinkText: showJournalBrowZineWebLinkText,
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
