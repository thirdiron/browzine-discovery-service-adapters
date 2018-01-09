var browzine = {
  api: "https://api.thirdiron.com/public/v1/libraries/118",
  apiKey: "9445d61e-9601-48fa-b29e-4faa00f73bf1",
};

// browzine.script = document.createElement("script");
// browzine.script.src = "https://s3.amazonaws.com/browzine-adapters/summon/browzine-summon-adapter.js";
// document.head.appendChild(browzine.script);

browzine.search = (function() {
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

  function resultsWithBrowZine(documentSummary) {
    var scope = getScope(documentSummary);
    console.log("scope", scope);

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
    resultsWithBrowZine: resultsWithBrowZine,
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

$(function() {

  //http://underscorejs.org/#debounce
  var debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = Date.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = Date.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  if(!browzine) {
    return;
  }

  // $(document).on('DOMNodeInserted', function(e) {
  //   //console.log(e.target);
  //   if ($(e.target).hasClass('results-title-data') && !$(e.target).hasClass('ng-scope') && e.target.id === "results-data-with-results") {
  //     console.log(e.target);
  //     var documentSummary = e.target;
  //     browzine.search.resultsWithBrowZine(documentSummary);
  //   }
  // });

  // document.addEventListener("DOMNodeInserted", function (e) {
  //   if ($(e.target).hasClass('results-title-data') && !$(e.target).hasClass('ng-scope') && e.target.id === "results-data-with-results") {
  //     console.log(e.target);
  //     var documentSummary = e.target;
  //     browzine.search.resultsWithBrowZine(documentSummary);
  //   }
  // }, false);

  var results = document.querySelector("#results") || document;

  //Enhance any documentSummary elements present before the observer starts
  // var documentSummaries = results.querySelectorAll(".documentSummary") || results.querySelectorAll(".results-title-row");
  //
  // Array.prototype.forEach.call(documentSummaries, function(documentSummary) {
  //   browzine.search.resultsWithBrowZine(documentSummary);
  // });

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      //console.log("mutation", mutation, mutation.target, $(mutation.target).attr('id'));
      if(mutation.attributeName === "document-summary") {
        var documentSummary = mutation.target;
        browzine.search.resultsWithBrowZine(documentSummary);
      }

      //if(mutation.target.classList.contains("results-title-data") && !mutation.target.classList.contains("ng-scope") && mutation.target.id === "results-data-with-results") {
      //if ($(mutation.target).hasClass('results-title-data') && !$(mutation.target).hasClass('ng-scope') && $(mutation.target).attr('id') === "results-data-with-results") {
      // if ($(mutation.target).hasClass('results-title-data') && $(mutation.target).attr('id') === "results-data-with-results") {
      //   //console.log("SerSol Mutation", mutation.target);
      //   //var documentSummary = mutation.target;
      //   //browzine.search.resultsWithBrowZine(documentSummary);
      //
      //   (debounce(function() {
      //     var documentSummary = mutation.target;
      //     console.log("SerSol 360", documentSummary);
      //     browzine.search.resultsWithBrowZine(documentSummary);
      //   }, 3000))();
      // }

      // if(mutation.target.querySelector && mutation.target.querySelector(".results-title-details")) {
      //   //console.log("SerSol 360", mutation);
      //   var documentSummary = mutation.target;
      //   //console.log(debounce);
      //
      //   (debounce(function() {
      //     console.log("SerSol 360", documentSummary);
      //     browzine.search.resultsWithBrowZine(documentSummary);
      //   }, 3000))();
      // }

      if(mutation.target.querySelector && mutation.target.querySelector(".results-title-data")) {
        //console.log("SerSol 360", mutation);
        var documentSummary = mutation.target;
        console.log("SerSol 360", documentSummary);
        browzine.search.resultsWithBrowZine(documentSummary);
      }

      // if(mutation.attributeName === "ui-view") {
      //   var documentSummary = mutation.target;
      //   console.log("SerSol 360", documentSummary);
      //   browzine.search.resultsWithBrowZine(documentSummary);
      // }

      //row results-title-row
    });
  });

  console.log("results", results);

  observer.observe(results, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  });
});
