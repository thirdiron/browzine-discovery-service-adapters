"use strict";

angular.module('summonApp.directives').constant("api", "https://apiconnector.thirdiron.com/v1/libraries/118").constant("bookIcon", "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png").directive("documentSummary", ["$http", "$sce", "api", "bookIcon", function ($http, $sce, api, bookIcon) {
  function isArticle(scope) {
    return scope.document.content_type.trim() === "Journal Article";
  };

  function isJournal(scope) {
    return scope.document.content_type.trim() === "Journal";
  };

  function getIssn(scope) {
    var issn = "";

    if (typeof scope.document.eissns !== "undefined" && scope.document.eissns !== null) {
      issn = scope.document.eissns[0].trim().replace('-', '');
    }

    return encodeURIComponent(issn);
  };

  function getDoi(scope) {
    var doi = "";

    if (typeof scope.document.dois !== "undefined" && scope.document.dois !== null) {
      doi = scope.document.dois[0].trim();
    }

    return encodeURIComponent(doi);
  };

  function getEndpoint(scope) {
    var endpoint = "";

    if (isArticle(scope)) {
      var doi = getDoi(scope);
      endpoint = api + "/articles?DOI=" + doi;
    } else if (isJournal(scope)) {
      var issn = getIssn(scope);
      endpoint = api + "/journals?ISSN=" + issn;
    }

    return endpoint;
  };

  function shouldEnhance(scope) {
    return isJournal(scope) && getIssn(scope) || isArticle(scope) && getDoi(scope);
  };

  return {
    link: function link(scope, element, attributes) {
      if (!shouldEnhance(scope)) {
        return;
      }

      var endpoint = getEndpoint(scope);

      $http.get($sce.trustAsResourceUrl(endpoint)).then(function (response) {
        console.log("endpoint", endpoint);
        console.dir(response);
        console.log("element", element);
        //console.log(response.data);
        var data = response.data;

        var type = data.data[0].type;
        var browzineWebLink = data.data[0].browzineWebLink;

        element.find(".docFooter .row:first").append("\n          <div>View Complete Issue: <a href='" + browzineWebLink + "' target='_blank'>Browse Now</a> <img src='" + bookIcon + "'/></div>\n        ");

        //element.find(".docFooter .row:first").append("<a>Hello World!</a>");
        //console.log(element.find(".docFooter .row:first"));
      });
    }
  };
}]);