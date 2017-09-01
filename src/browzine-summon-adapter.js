angular.module('summonApp.directives')
.config(["$sceDelegateProvider", ($sceDelegateProvider) => {
  // console.log("$sceDelegateProvider");
  // $sceDelegateProvider.resourceUrlWhitelist([
  //   'self',
  //   'https://apiconnector.thirdiron.com/**'
  // ]);
  // console.dir($sceDelegateProvider.resourceUrlWhitelist());
  //
  // let whitelist = $sceDelegateProvider.resourceUrlWhitelist();
  // console.log("whitelist");
  // console.dir(whitelist);
  // //whitelist.push("https://apiconnector.thirdiron.com/**");
  // whitelist.push("/^htt(p|ps):\/\/.*(-|\.)apiconnector(-|\.)thirdiron(-|\.)com((\..*){0,}\/.*$/");
  // $sceDelegateProvider.resourceUrlWhitelist(whitelist);
  //
  // console.dir($sceDelegateProvider);
  // console.dir($sceDelegateProvider.resourceUrlWhitelist());
}])
.directive("documentSummary", ["$http", "$sce", ($http, $sce) => {
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
      endpoint = `https://apiconnector.thirdiron.com/v1/libraries/118/articles?DOI=${doi}`;
    } else if(isJournal(scope)) {
      const issn = getIssn(scope);
      endpoint = `https://apiconnector.thirdiron.com/v1/libraries/118/journals?ISSN=${issn}`;
    }

    //scope.trustSrc = $sce.trustAsResourceUrl(endpoint);
    // let resourceUrlWhitelist = $sceDelegateProvider.resourceUrlWhitelist();
    // resourceUrlWhitelist.push(endpoint);
    // $sceDelegateProvider.resourceUrlWhitelist(resourceUrlWhitelist);

    return endpoint;
  };

  function shouldEnhance(scope) {
    // console.log("(isJournal(scope) && getIssn(scope))", isJournal(scope), getIssn(scope));
    // console.log("(isArticle(scope) && getDoi(scope))", isArticle(scope), getDoi(scope));
    // console.log("---------");
    return (isJournal(scope) && getIssn(scope)) || (isArticle(scope) && getDoi(scope));
  };

  /*async function f1() {
    var x = await resolveAfter2Seconds(10);
    console.log(x);
  };*/

  return {
    link: (scope, element, attributes) => {
      if(!shouldEnhance(scope)) {
        //console.log("!shouldEnhance", scope);
        return;
      }

      console.log("scope object in documentSummary directive:");
      console.dir(scope);
      console.dir(element);
      //console.dir(attributes);

      const endpoint = getEndpoint(scope);
      console.log("endpoint", endpoint);

      //console.dir($http);
      //console.log("$sce.getTrustedResourceUrl(endpoint)", $sce.getTrustedResourceUrl(endpoint));

      $http.jsonp($sce.trustAsResourceUrl(endpoint), {jsonpCallbackParam: 'callback'}).then((response) => {
         console.dir(response);
      }, function errorCallback(response) {
        console.log("http-error", response);
      });

      // $http.get($sce.trustAsResourceUrl(endpoint)).then((response) => {
      //    console.dir(response);
      // });

      // $http({
      //   method: 'GET',
      //   jsonpCallbackParam: 'callback',
      //   url: $sce.trustAsResourceUrl(endpoint)
      // }).then(function successCallback(response) {
      //   console.log(response.data);
      // }, function errorCallback(response) {
      // });
    }
  };
}]);

/*angular.module('summonApp.directives').directive("availabilityDocs", ["$http", function ($http) {
    return {
        template: "<p ng-repeat='resource in resources'>"
                 +"  <b>{{resource.name}}:</b>"
                 +"  <span ng-bind-html='resource.msg'></span>"
                 +"</p>",
        link:  function (scope, iElement, iAttrs, controller, transcludeFn) {
            scope.$watch("type", function (type) {
                console.dir(type);
            });
        }
    }
}])*/

//console.log("Hello World!");
