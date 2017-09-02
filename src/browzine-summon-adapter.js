angular.module('summonApp.directives')
.constant("api", "https://apiconnector.thirdiron.com/v1/libraries/118")
.directive("documentSummary", ["$http", "$sce", "api", ($http, $sce, api) => {
  function isArticle(scope) {
    return scope.document.content_type.trim() === "Journal Article";
  };

  function isJournal(scope) {
    return scope.document.content_type.trim() === "Journal";
  };

  function getIssn(scope) {
    let issn = "";

    if(typeof scope.document.eissns !== "undefined" && scope.document.eissns !== null) {
      issn = scope.document.eissns[0].trim().replace('-', '');
    }

    return encodeURIComponent(issn);
  };

  function getDoi(scope) {
    let doi = "";

    if(typeof scope.document.dois !== "undefined" && scope.document.dois !== null) {
      doi = scope.document.dois[0].trim();
    }

    return encodeURIComponent(doi);
  };

  function getEndpoint(scope) {
    let endpoint = "";

    if(isArticle(scope)) {
      const doi = getDoi(scope);
      endpoint = `${api}/articles?DOI=${doi}`;
    } else if(isJournal(scope)) {
      const issn = getIssn(scope);
      endpoint = `${api}/journals?ISSN=${issn}`;
    }

    return endpoint;
  };

  function shouldEnhance(scope) {
    return (isJournal(scope) && getIssn(scope)) || (isArticle(scope) && getDoi(scope));
  };

  return {
    link: (scope, element, attributes) => {
      if(!shouldEnhance(scope)) {
        return;
      }

      const endpoint = getEndpoint(scope);

      $http.get($sce.trustAsResourceUrl(endpoint)).then((response) => {
        console.log("endpoint", endpoint);
        console.dir(response);
      });
    }
  };
}]);
