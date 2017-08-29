"use strict";

/*angular.module('summonApp.directives')
.directive("availabilityAdditionalInfo", ["$http", ($http) => {
  return {
    template: `<p ng-repeat='resource in resources'>
                <b>{{resource.name}}:</b>
                <span ng-bind-html='resource.msg'></span>
               </p>`,
    link: (scope, iElement, iAttrs, controller, transcludeFn) => {
      console.log("scope", scope);
      console.log("iElement", iElement);
      console.log("iAttrs", iAttrs);
      console.log("controller", controller);
      console.log("transcludeFn", transcludeFn);

      scope.$watch("type", (type) => {
        console.log("type", type);
      });
    }
  }
}]);*/

/*angular.module('summonApp.directives').directive("documentSummary", () => {
    return {
        link: (scope) => {
            console.log("scope object in documentSummary directive:");
            console.dir(scope);
        }
    }
});*/

console.log("Hello World!");