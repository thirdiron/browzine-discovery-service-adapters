"use strict";

angular.module('summonApp.directives').directive("documentSummary", ["$http", function ($http) {
  function isArticle(scope) {
    return scope.document.content_type.trim() === "Journal Article";
  };

  function isJournal(scope) {
    return scope.document.content_type.trim() === "Journal";
  };

  function getIssn(scope) {
    var issn = "";

    if (typeof scope.document.eissns !== "undefined" && scope.document.eissns !== null) {
      issn = scope.document.eissns[0].trim();
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
      endpoint = "https://apiconnector.thirdiron.com/v1/libraries/118/articles?DOI=" + doi;
    } else if (isJournal(scope)) {
      var issn = getIssn(scope);
      endpoint = "https://apiconnector.thirdiron.com/v1/libraries/118/journals?ISSN=" + issn;
    }

    return endpoint;
  };

  function shouldEnhance(scope) {
    console.log("(isJournal(scope) && getIssn(scope))", isJournal(scope), getIssn(scope));
    console.log("(isArticle(scope) && getDoi(scope))", isArticle(scope), getDoi(scope));
    console.log("---------");
    return isJournal(scope) && getIssn(scope) || isArticle(scope) && getDoi(scope);
  };

  return {
    link: function link(scope, element, attributes) {
      if (!shouldEnhance(scope)) {
        return;
      }

      console.log("scope object in documentSummary directive:");
      console.dir(scope);
      console.dir(element);
      console.dir(attributes);

      var endpoint = getEndpoint(scope);
      console.log("endpoint", endpoint);

      //Only do the updates when our endpoint returns data
    }
  };
}]);

angular.module('summonApp.directives').directive("availabilityDocs", ["$http", function ($http) {
  return {
    template: "<p ng-repeat='resource in resources'>" + "  <b>{{resource.name}}:</b>" + "  <span ng-bind-html='resource.msg'></span>" + "</p>",
    link: function link(scope, iElement, iAttrs, controller, transcludeFn) {
      scope.$watch("type", function (type) {
        console.dir(type);
      });
    }
  };
}]);

//console.log("Hello World!");