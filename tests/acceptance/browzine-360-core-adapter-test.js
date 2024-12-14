describe("BrowZine SerSol 360 Core Adapter >", function () {
  var serSol360Core = {}, searchResults = {};
  results = "<div ui-view='searchResultsForCoreAdapterTest'><div class='results-title-data'><div class='results-title-row'><div class='results-title-image-div'></div><div class='results-title-details'><div class='results-title'>The New England journal of medicine</div><div class='results-identifier'>ISSN: 0028-4793</div></div></div></div></div>";

  $("body").append(results);

  describe("search results journal >", function() {
    describe("search results journal with configuration flags disabled >", function() {
      beforeEach(function() {
        serSol360Core = browzine.serSol360Core;
        browzine.journalCoverImagesEnabled = false;
        browzine.journalBrowZineWebLinkTextEnabled = false;

        searchResults = $("div[ui-view='searchResultsForCoreAdapterTest']");

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

      afterEach(function() {
        delete browzine.journalCoverImagesEnabled;
        delete browzine.journalBrowZineWebLinkTextEnabled;
      });

      it("should not have an browzine web issue link", function() {
        var template = searchResults.find(".browzine-web-link");
        expect(template.length).toEqual(0);
      });

      it("should not have an enhanced browzine journal cover", function() {
        var coverImage = searchResults.find("img.results-title-image");
        expect(coverImage.attr("src")).not.toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
      });
    });

    describe("search results journal with browzine web link >", function() {
      beforeEach(function () {
        serSol360Core = browzine.serSol360Core;

        searchResults = $("div[ui-view='searchResultsForCoreAdapterTest']");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.searchResultsCtrl = {
            titleData: {
              titles: [
                {
                  title: "The New England journal of medicine",
                  syndeticsImageUrl: "https://secure.syndetics.com/index.aspx?isbn=/mc.gif&issn=0028-4793&client=mistatesum",
                  identifiers: [{type: "ISSN", value: "0028-4793"}, {type: "eISSN", value: "1533-4406"}]
                },
                {
                  title: "The New England journal of medicine",
                  syndeticsImageUrl: "https://secure.syndetics.com/index.aspx?isbn=/mc.gif&issn=0028-4794&client=mistatesum",
                  identifiers: [{type: "ISSN", value: "0028-4794"}, {type: "eISSN", value: "1533-4407"}]
                },
                {
                  title: "The New England journal of medicine",
                  syndeticsImageUrl: "https://secure.syndetics.com/index.aspx?isbn=/mc.gif&issn=0028-4795&client=mistatesum",
                  identifiers: [{type: "ISSN", value: "0028-4795"}, {type: "eISSN", value: "1533-4408"}]
                }
              ]
            }
          };

          searchResults = $compile(searchResults)($scope);
        });

        $.getJSON = function(endpoint, callback) {
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

      it("should have an enhanced view journal in browzine option", function() {
        var template = searchResults.find(".browzine");
        expect(template).toBeDefined();

        expect(template.text().trim()).toEqual("View Journal in BrowZine");
        expect((template.text().trim().match(/View Journal in BrowZine/g) || []).length).toEqual(1);

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/10292");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = searchResults.find("img.results-title-image");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
        expect(coverImage.attr("ng-src")).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        searchResults.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://browzine.com/libraries/XXX/journals/10292", "_blank");
      });
    });

    describe("multiple search results for journals with the same issn with browzine web links >", function () {
      var serSol360Core = {}, searchResultsSameIssn = {};
      beforeEach(function () {

        const testData =
          `<div ui-view="searchResultsMultipleJournalsSameIssnTest">
            <div class="results-title-data">
              <div class="results-title-row">
                <div class="results-title-image-div"></div>
                <div class="results-title-details">
                  <div class="results-title">The New England Journal of Medicine (NEJM)</div>
                  <div class="results-identifier">ISSN: 0028-4793</div>
                </div>
              </div>
              <div class="results-title-row">
                <div class="results-title-details">
                  <div class="results-title">The New England Journal of Medicine - international ED</div>
                  <div class="results-identifier">ISSN: 0028-4793</div>
                </div>
              </div>
              <div class="results-title-row">
                <div class="results-title-details">
                  <div class="results-title">The New England Journal of Medicine in Espanol</div>
                  <div class="results-identifier">ISSN: 0028-4793</div>
                </div>
              </div>
            </div>
          </div>`

        var multipleResultsSameIssn = testData;
        // $("body").remove(results);
        $("body").append(multipleResultsSameIssn);

        serSol360Core = browzine.serSol360Core;

        // searchResults = "";
        searchResultsSameIssn = $("div[ui-view='searchResultsMultipleJournalsSameIssnTest']");


        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.searchResultsCtrl = {
            titleData: {
              titles: [
                {
                  title: "New England Journal of Medicine (NEJM)",
                  syndeticsImageUrl: "https://secure.syndetics.com/index.aspx?isbn=/mc.gif&issn=0028-4793&client=mistatesum",
                  identifiers: [{type: "ISSN", value: "0028-4793"}, {type: "eISSN", value: ""}]
                },
                {
                  title: "The New England Journal of Medicine - international ED",
                  syndeticsImageUrl: "https://secure.syndetics.com/index.aspx?isbn=/mc.gif&issn=0028-4793&client=mistatesum",
                  identifiers: [{type: "ISSN", value: "0028-4793"}, {type: "eISSN", value: ""}]
                },
                {
                  title: "The New England Journal of Medicine in Espanol",
                  syndeticsImageUrl: "https://secure.syndetics.com/index.aspx?isbn=/mc.gif&issn=0028-4793&client=mistatesum",
                  identifiers: [{type: "ISSN", value: "0028-4793"}, {type: "eISSN", value: ""}]
                }
              ]
            }
          };

          searchResultsSameIssn = $compile(searchResultsSameIssn)($scope);
        });

        $.getJSON = function(endpoint, callback) {
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
              },
              {
              "id": 10293,
              "type": "journals",
              "title": "The New England Journal of Medicine - international ED",
              "issn": "00284793",
              "sjrValue": 14.619,
              "coverImageUrl": "https://assets.thirdiron.com/images/covers/0028-4793.png",
              "browzineEnabled": true,
              "browzineWebLink": "https://browzine.com/libraries/XXX/journals/10293"
              },
              {
                "id": 10294,
              "type": "journals",
              "title": "The New England Journal of Medicine in Espanol",
              "issn": "00284793",
              "sjrValue": 14.619,
              "coverImageUrl": "https://assets.thirdiron.com/images/covers/0028-4793.png",
              "browzineEnabled": true,
              "browzineWebLink": "https://browzine.com/libraries/XXX/journals/10294"
              }
            ]
          });
        };

        serSol360Core.adapter(searchResultsSameIssn);
      });

      /* NOTE to Karl:
        Essentially what i've tried to do is fully seperate this test from the others, but the code seems to refuse to recognize the data that i've set up
        I've added logs so you can run locally and see what i'm seeing, but it seems like it's not recognizing the data
        Previously I tried using 'searchResults' instead of 'searchResultsSameIssn' but then I was getting data from the core test again
      */
      it("should have enhanced view journal in browzine options", function() {
        var template = searchResultsSameIssn.find(".browzine");
        console.log(template, 'our template in our new tests');
        expect(template).toBeDefined();

        expect(template.text().trim()).toEqual("View Journal in BrowZine");
        expect((template.text().trim().match(/View Journal in BrowZine/g) || []).length).toEqual(1);

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/10292");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
      });
    })
  });
});
