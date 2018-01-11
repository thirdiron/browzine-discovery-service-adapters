browzine.summon = (function() {
  var api = browzine.api;
  var apiKey = browzine.apiKey;

  function isArticle(scope) {
    var result = false;

    if(scope.document) {
      if(scope.document.content_type) {
        var contentType = scope.document.content_type.trim().toLowerCase();
        if(contentType === "journal article") {
          result = true;
        }
      }
    }

    return result;
  };

  function isJournal(scope) {
    var result = false;

    if(scope.document) {
      if(scope.document.content_type) {
        var contentType = scope.document.content_type.trim().toLowerCase();
        if(contentType === "journal" || contentType === "ejournal") {
          result = true;
        }
      }
    }

    return result;
  };

  function getIssn(scope) {
    var issn = "";

    if(scope.document) {
      if(scope.document.issns) {
        issn = scope.document.issns[0].trim().replace("-", "");
      }

      if(scope.document.eissns && !issn) {
        issn = scope.document.eissns[0].trim().replace("-", "");
      }
    }

    return encodeURIComponent(issn);
  };

  function getDoi(scope) {
    var doi = "";

    if(scope.document) {
      if(scope.document.dois) {
        doi = scope.document.dois[0].trim();
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
    return Array.isArray(response.data) ? response.data[0] : response.data;
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

    if(data.browzineWebLink) {
      browzineWebLink = data.browzineWebLink;
    }

    return browzineWebLink;
  };

  function getCoverImageUrl(scope, data, journal) {
    var coverImageUrl = null;

    if(isJournal(scope)) {
      if(data.coverImageUrl) {
        coverImageUrl = data.coverImageUrl;
      }
    }

    if(isArticle(scope)) {
      if(journal) {
        if(journal.coverImageUrl) {
          coverImageUrl = journal.coverImageUrl;
        }
      }
    }

    return coverImageUrl;
  };

  function buildTemplate(scope, browzineWebLink) {
    var wording = "";
    var browzineWebLinkText = "";
    var bookIcon = "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png";

    if(isJournal(scope)) {
      wording = browzine.journalWording || "View the Journal";
      browzineWebLinkText = browzine.journalBrowZineWebLinkText || "Browse Now";
    }

    if(isArticle(scope)) {
      wording = browzine.articleWording || "View Complete Issue";
      browzineWebLinkText = browzine.articleBrowZineWebLinkText || "Browse Now";
    }

    var template = "<div class='browzine'>" +
                     "{wording}: <a class='browzine-web-link' href='{browzineWebLink}' target='_blank' style='text-decoration: underline; color: #333;'>{browzineWebLinkText}</a> " +
                     "<img class='browzine-book-icon' src='{bookIcon}'/>" +
                   "</div>";

    template = template.replace(/{wording}/g, wording);
    template = template.replace(/{browzineWebLink}/g, browzineWebLink);
    template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
    template = template.replace(/{bookIcon}/g, bookIcon);

    return template;
  };

  function getScope(documentSummary) {
    return angular.element(documentSummary).scope();
  };

  function adapter(documentSummary) {
    var scope = getScope(documentSummary);

    if(!shouldEnhance(scope)) {
      return;
    }

    var endpoint = getEndpoint(scope);

    $.getJSON(endpoint, function(response) {
      var data = getData(response);
      var journal = getIncludedJournal(response);

      var browzineWebLink = getBrowZineWebLink(data);
      var coverImageUrl = getCoverImageUrl(scope, data, journal);

      if(browzineWebLink) {
        var template = buildTemplate(scope, browzineWebLink);
        $(documentSummary).find(".docFooter .row:eq(0)").append(template);
      }

      if(coverImageUrl) {
        $(documentSummary).find(".coverImage img").attr("src", coverImageUrl);
      }
    });
  };

  return {
    adapter: adapter,
    getScope: getScope,
    shouldEnhance: shouldEnhance,
    getEndpoint: getEndpoint,
    getData: getData,
    getIncludedJournal: getIncludedJournal,
    getBrowZineWebLink: getBrowZineWebLink,
    getCoverImageUrl: getCoverImageUrl,
    buildTemplate: buildTemplate,
  };
}());

browzine.serSol360Core = (function() {
  var api = browzine.api;
  var apiKey = browzine.apiKey;

  function getIssn(title) {
    var issn = "";

    title.identifiers.forEach(function(identifier) {
      if(identifier.type === "ISSN" && identifier.value) {
        issn = identifier.value
      }
    });

    return encodeURIComponent(issn);
  };

  function getTarget(issn) {
    var element = $(".results-identifier:contains('" + issn + "')").closest(".results-title-row");
    var target = element.length > 0 ? element[0] : undefined;
    return target;
  };

  function getEndpoint(issn) {
    var endpoint = api + "/search?issns=" + issn.trim().replace("-", "");
    endpoint += "&access_token=" + apiKey;

    return endpoint;
  };

  function addTargets(titles) {
    titles.forEach(function(title) {
      var issn = getIssn(title);
      title.target = getTarget(issn);
      title.endpoint = getEndpoint(issn);
    });

    return titles;
  };

  function getTitles(scope) {
    var titles = [];

    if(scope.searchResultsCtrl) {
      if(scope.searchResultsCtrl.titleData) {
        if(scope.searchResultsCtrl.titleData.titles) {
          titles = angular.copy(scope.searchResultsCtrl.titleData.titles);
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

  function adapter(searchResults) {
    var scope = getScope(searchResults);
    console.log("scope", scope);

    var titles = addTargets(getTitles(scope));
    //console.log("titles", titles);

    (function poll(titles) {
      var title = titles.shift();

      $.getJSON(title.endpoint, function(response) {
        //console.log("response", response);
        var data = getData(response);
        console.log("data", data);
        var browzineWebLink = getBrowZineWebLink(data);
        var coverImageUrl = getCoverImageUrl(data);

        if(browzineWebLink) {
          var template = buildTemplate(browzineWebLink);
          $(title.target).find(".results-identifier").append(template);
        }

        if(coverImageUrl) {

        }

        if(titles.length > 0) {
          poll(titles);
        }
      });
    }(titles));
  };

  return {
    adapter: adapter,
    getScope: getScope,
    getTitles: getTitles,
    addTargets: addTargets,
    getTarget: getTarget,
    getIssn: getIssn,
    getEndpoint: getEndpoint,
  };
}());

$(function() {
  if(!browzine) {
    return;
  }

  var results = document.querySelector("#results") || document;

  //Enhance any documentSummary elements present before the observer starts
  var documentSummaries = results.querySelectorAll(".documentSummary");

  Array.prototype.forEach.call(documentSummaries, function(documentSummary) {
    browzine.summon.adapter(documentSummary);
  });

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.attributeName === "document-summary") {
        var documentSummary = mutation.target;
        browzine.summon.adapter(documentSummary);
      }

      if(mutation.target.querySelector && mutation.target.querySelector(".results-title-data")) {
        var searchResults = mutation.target;
        console.log("SerSol 360", searchResults);
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
