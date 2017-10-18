browzine.search = (function() {
  var api = browzine.api;
  var apiKey = browzine.apiKey;

  function isArticle(data) {
    var result = false;

    if(data.document) {
      if(data.document.content_type) {
        var contentType = data.document.content_type.trim();
        result = (contentType === "Journal Article");
      }
    }

    if(data.type) {
      result = (data.type === "articles");
    }

    return result;
  };

  function isJournal(data) {
    var result = false;

    if(data.document) {
      if(data.document.content_type) {
        var contentType = data.document.content_type.trim();
        result = (contentType === "Journal" || contentType === "eJournal");
      }
    }

    if(data.type) {
      result = (data.type === "journals");
    }

    return result;
  };

  function getIssn(scope) {
    var issn = "";

    if(scope.document) {
      if(scope.document.issns) {
        issn = scope.document.issns[0].trim().replace('-', '');
      }

      if(scope.document.eissns && issn === "") {
        issn = scope.document.eissns[0].trim().replace('-', '');
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
    } else if(isJournal(scope)) {
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
    return Array.isArray(response.included) ? response.included[0] : response.included;
  };

  function getBrowZineWebLink(data) {
    var browzineWebLink = null;

    if(data.browzineWebLink) {
      browzineWebLink = data.browzineWebLink;
    }

    return browzineWebLink;
  };

  function getCoverImageUrl(data, response) {
    var coverImageUrl = null;

    if(isJournal(data)) {
      if(data.coverImageUrl) {
        coverImageUrl = data.coverImageUrl;
      }
    }

    if(isArticle(data)) {
      if(response.included) {
        var journal = getIncludedJournal(response);

        if(journal.coverImageUrl) {
          coverImageUrl = journal.coverImageUrl;
        }
      }
    }

    return coverImageUrl;
  };

  function buildTemplate(data, browzineWebLink) {
    var wording = "";
    var browzineWebLinkText = "";
    var bookIcon = "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png";

    if(isJournal(data)) {
      wording = browzine.journalWording || "View the Journal";
      browzineWebLinkText = browzine.journalBrowZineWebLinkText || "Browse Now";
    }

    if(isArticle(data)) {
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

  function resultsWithBrowZine(documentSummary) {
    var scope = getScope(documentSummary);

    if(!shouldEnhance(scope)) {
      return;
    }

    var endpoint = getEndpoint(scope);

    $.getJSON(endpoint, function(response) {
      var data = getData(response);
      var browzineWebLink = getBrowZineWebLink(data);
      var coverImageUrl = getCoverImageUrl(data, response);

      if(browzineWebLink) {
        var template = buildTemplate(data, browzineWebLink);
        $(documentSummary).find(".docFooter .row:eq(0)").append(template);
      }

      if(coverImageUrl) {
        $(documentSummary).find(".coverImage img").attr("src", coverImageUrl);
      }
    });
  };

  return {
    resultsWithBrowZine: resultsWithBrowZine,
    getScope: getScope,
    shouldEnhance: shouldEnhance,
    getEndpoint: getEndpoint,
    getData: getData,
    getBrowZineWebLink: getBrowZineWebLink,
    getCoverImageUrl: getCoverImageUrl,
    buildTemplate: buildTemplate,
  };
}());

$(function() {
  if(!browzine) {
    return;
  }

  var results = document.querySelector("#results");
  var config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  };

  //Enhance any documentSummary elements present before the observer starts
  var documentSummaries = results.querySelectorAll(".documentSummary");

  Array.prototype.forEach.call(documentSummaries, function(documentSummary) {
    browzine.search.resultsWithBrowZine(documentSummary);
  });

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.attributeName === "document-summary") {
        var documentSummary = mutation.target;
        browzine.search.resultsWithBrowZine(documentSummary);
      }
    });
  });

  observer.observe(results, config);
});
