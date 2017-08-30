"use strict";

angular.module('summonApp.directives').directive("documentSummary", function () {
    return {
        link: function link(scope) {
            console.log("scope object in documentSummary directive:");
            console.dir(scope);
            console.log("Hello, World!");
        }
    };
});

console.log("Hello World!");