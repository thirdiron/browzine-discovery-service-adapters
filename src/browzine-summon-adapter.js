angular.module('summonApp.directives')
.constant("api", "https://apiconnector.thirdiron.com/v1/libraries/118")
.constant("bookIcon", "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png")
.directive("documentSummary", ["$http", "$sce", "api", "bookIcon", ($http, $sce, api, bookIcon) => {
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
        console.log("element", element);
        //console.log(response.data);
        const data = response.data;

        const type = data.data[0].type;
        const browzineWebLink = data.data[0].browzineWebLink;

        element.find(".docFooter .row:first").append(`
          <div>View Complete Issue: <a href='${browzineWebLink}' target='_blank'>Browse Now</a> <img src='${bookIcon}'/></div>
        `);

        //element.find(".docFooter .row:first").append("<a>Hello World!</a>");
        //console.log(element.find(".docFooter .row:first"));
      });
    }
  };
}]);
