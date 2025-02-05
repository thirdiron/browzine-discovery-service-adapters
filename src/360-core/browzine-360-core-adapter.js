browzine.serSol360Core = (function() {
  var libraryId = browzine.libraryId;
  var api = libraryIdOverride(urlRewrite(browzine.api));
  var apiKey = browzine.apiKey;

  function urlRewrite(url) {
    if (!url) {
      return;
    } else if (url.indexOf("staging-api.thirdiron.com") > -1) {
      return url;
    }

    return url.indexOf("public-api.thirdiron.com") > -1 ? url : url.replace("api.thirdiron.com", "public-api.thirdiron.com");
  };

  function libraryIdOverride(url) {
    var override = url;
    var libraryId = browzine.libraryId;

    if (libraryId) {
      var baseUrl = "https://public-api.thirdiron.com/public/v1/libraries/{libraryId}";
      override = baseUrl.replace(/{libraryId}/g, libraryId);
    }

    return override;
  };

  function getIssn(title) {
    if (title.identifiers) {
      var issnIdentifierArray = title.identifiers.filter(function(identifier) {
        if (identifier.type && identifier.value) {
          return identifier.type.toLowerCase() === "issn" && identifier.value.length > 0;
        }
      });

      if (issnIdentifierArray[0]) {
        return encodeURIComponent(issnIdentifierArray[0].value);
      };

      var eissnIdentifier = title.identifiers.filter(function(identifier) {
        if (identifier.type && identifier.value) {
          return identifier.type.toLowerCase() === "eissn" && identifier.value.length > 0;
        }
      }).pop();

      if (eissnIdentifier) {
        return encodeURIComponent(eissnIdentifier.value);
      }
    }

    return "";
  };

  function getJournalName(title) {
    return (title && title.title) ? title.title : '';
  };

  function getTarget(index) {
    var elements = $(".results-identifier").closest(".results-title-row");

    if (index >= elements.length) {
      var target = undefined;
    } else {
      var target = elements[index];
    }
    return target;
  };

  function getEndpoint(issn) {
    var endpoint = null;

    if (issn) {
      endpoint = api + "/search?issns=" + issn.trim().replace("-", "");
      endpoint += "&access_token=" + apiKey;
    }

    return endpoint;
  };

  function addTargets(titles) {
    var titlesToEnhance = [];
    titles.forEach(function(title, index) {
      var issn = getIssn(title);
      title.target = getTarget(index);
      title.endpoint = getEndpoint(issn);
      title.shouldEnhance = shouldEnhance(issn);

      if (title.shouldEnhance) {
        titlesToEnhance.push(title);
      }
    });

    return titlesToEnhance;
  };

  function getTitles(scope) {
    var titles = [];

    if (scope) {
      if (scope.searchResultsCtrl) {
        if (scope.searchResultsCtrl.titleData) {
          if (scope.searchResultsCtrl.titleData.titles) {
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

    if (data && data.browzineWebLink) {
      browzineWebLink = data.browzineWebLink;
    }

    return browzineWebLink;
  };

  function getCoverImageUrl(data) {
    var coverImageUrl = null;

    if (data && data.coverImageUrl) {
      coverImageUrl = data.coverImageUrl;
    }

    return coverImageUrl;
  };

  function getBrowZineEnabled(data) {
    var browzineEnabled = null;

    if (data && data.browzineEnabled) {
      browzineEnabled = data.browzineEnabled;
    }

    return browzineEnabled;
  };

  function isDefaultCoverImage(coverImageUrl) {
    var defaultCoverImage = false;

    if (coverImageUrl && coverImageUrl.toLowerCase().indexOf("default") > -1) {
      defaultCoverImage = true;
    }

    return defaultCoverImage;
  };

  function showJournalCoverImages() {
    var featureEnabled = false;
    var config = browzine.journalCoverImagesEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showJournalBrowZineWebLinkText() {
    var featureEnabled = false;
    var config = browzine.journalBrowZineWebLinkTextEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function shouldEnhance(issn) {
    return !!issn;
  };

  function transition(event, anchor) {
    // We’ve seen some discovery services intercept basic a href links, and have
    // been encouraged to intercept clicks more closely. We should continue
    // intercepting clicks like this unless we hear feedback from discovery
    // service vendors that this is no longer desired or necessary.
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

  function searchTitles(titles) {

    titles.forEach(title => {
      if (title) {
        $.getJSON(title.endpoint, function (response) {
          var data = getData(response);
          var browzineWebLink = getBrowZineWebLink(data);
          var coverImageUrl = getCoverImageUrl(data);
          var defaultCoverImage = isDefaultCoverImage(coverImageUrl);

          if (browzineWebLink && showJournalBrowZineWebLinkText()) {
            var template = browzineWebLinkTemplate(browzineWebLink);
            $(title.target).find(".results-identifier").append(template);
          }

          if (coverImageUrl && !defaultCoverImage && showJournalCoverImages()) {
            var resultsTitleImageContainerSelector = ".results-title-image-div";
            var resultsTitleImageSelector = ".results-title-image-div img.results-title-image";
            var boxShadow = "1px 1px 2px #ccc";

            if ($(title.target).find(resultsTitleImageSelector).length > 0) {
              $(title.target).find(resultsTitleImageSelector).attr("src", coverImageUrl).attr("ng-src", coverImageUrl).css("box-shadow", boxShadow);
            } else {
              $(title.target).find(resultsTitleImageContainerSelector).append("<img alt='Results Title Image' class='results-title-image'/>");
              $(title.target).find(resultsTitleImageSelector).attr("src", coverImageUrl).attr("ng-src", coverImageUrl).css("box-shadow", boxShadow);
            }
          }
        });
      }
     });
  };

  function adapter(searchResults) {
    var scope = getScope(searchResults);
    var titles = addTargets(getTitles(scope));

    if (titles.length === 0) {
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
  if (!browzine) {
    return;
  }

  var results = document;

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.target.querySelector && mutation.target.querySelector(".results-title-data")) {
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
