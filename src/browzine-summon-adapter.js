angular.module('summonApp.directives')
.constant("api", "https://apiconnector.thirdiron.com/v1/libraries/118")
.constant("bookIcon", "https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png")
.directive("documentSummary", ["$http", "$sce", "api", "bookIcon", ($http, $sce, api, bookIcon) => {
  function isArticle(data) {
    if(typeof data.document !== "undefined" && data.document !== null) {
      return data.document.content_type.trim() === "Journal Article";
    } else {
      return data.type === "articles";
    }
  };

  function isJournal(data) {
    if(typeof data.document !== "undefined" && data.document !== null) {
      return data.document.content_type.trim() === "Journal";
    } else {
      return data.type === "journals";
    }
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

  function getData(response) {
    return Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
  };

  function getBrowZineWebLink(data) {
    let browzineWebLink = null;

    if(typeof data.browzineWebLink !== "undefined" && data.browzineWebLink !== null) {
      browzineWebLink = data.browzineWebLink;
    }

    return browzineWebLink;
  };

  function buildTemplate(data, browzineWebLink, bookIcon) {
    let assetPrefix = "";

    if(isJournal(data)) {
      assetPrefix = "View the Journal";
    }

    if(isArticle(data)) {
      assetPrefix = "View Complete Issue";
    }

    return `<div>${assetPrefix}: <a href='${browzineWebLink}' target='_blank' style='text-decoration: underline; color:#333'>Browse Now</a> <img src='${bookIcon}'/></div>`;
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

        const data = getData(response);
        const browzineWebLink = getBrowZineWebLink(data);

        if(browzineWebLink) {
          const template = buildTemplate(data, browzineWebLink, bookIcon);
          element.find(".docFooter .row:first").append(template);
        }
      });
    }
  };
}]);
