describe("BrowZine SerSol 360 Core Adapter >", function() {
  var serSol360Core = {}, searchResults = {};
  var results = "<div ui-view='searchResults'><div class='results-title-data'><div class='results-title-row'><div class='results-title-image-div'></div><div class='results-title-details'><div class='results-title'>The New England journal of medicine</div><div class='results-identifier'>ISSN: 0028-4793</div></div></div></div></div>";

  $("body").append(results);

  beforeEach(function() {
    serSol360Core = browzine.serSol360Core;

    searchResults = $("div[ui-view='searchResults']");

    inject(function ($compile, $rootScope) {
      $scope = $rootScope.$new();

      $scope.searchResultsCtrl = {
        titleData: {
          titles: [
            {
              title: "The New England journal of medicine",
              syndeticsImageUrl: "https://secure.syndetics.com/index.aspx?isbn=/mc.gif&issn=0028-4793&client=mistatesum",
              identifiers: [{type: "ISSN", value: "0028-4793"}, {type: "eISSN", value: "1533-4406"}]
            }
          ]
        }
      };

      searchResults = $compile(searchResults)($scope);
    });

    $.getJSON = function(endpoint, callback) {
      expect(endpoint).toMatch(/search\?issns=00284793/);

      return callback({
        "data": [{
          "id": 10292,
          "type": "journals",
          "title": "New England Journal of Medicine (NEJM)",
          "issn": "00284793",
          "sjrValue": 14.619,
          "coverImageUrl": "https://assets.thirdiron.com/images/covers/0028-4793.png",
          "browzineEnabled": true,
          "browzineWebLink": "https://browzine.com/libraries/XXX/journals/10292"
        }]
      });
    };

    serSol360Core.adapter(searchResults);
  });

  describe("search results journal >", function() {
    it("should have an enhanced view journal in browzine option", function() {
      var template = searchResults.find(".browzine");
      expect(template).toBeDefined();
      expect(template.text().trim()).toEqual("View Journal in BrowZine");
      expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/10292");
      expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
      expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine-open-book-icon.svg");
    });

    it("should have an enhanced browzine journal cover", function() {
      var coverImage = searchResults.find("img.results-title-image");
      expect(coverImage).toBeDefined();
      expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
      expect(coverImage.attr("ng-src")).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
    });
  });
});
