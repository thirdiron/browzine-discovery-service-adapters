angular.module('summonApp.directives').directive("documentSummary", () => {
    return {
        link: (scope) => {
            console.log("scope object in documentSummary directive:");
            console.dir(scope);
            console.log("Hello, World!");
        }
    }
});

console.log("Hello World!");
