describe("BrowZine Summon Adapter >", function() {
  var summon = {}, documentSummary = {};

  $("body").append("<div id='results'></div>");

  describe("search results journal >", function() {
    beforeEach(function() {
      summon = browzine.summon;

      documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

      inject(function ($compile, $rootScope) {
        $scope = $rootScope.$new();

        $scope.document = {
          content_type: "Journal",
          issns: ["0028-4793"]
        };

        documentSummary = $compile(documentSummary)($scope);
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

      summon.adapter(documentSummary);
    });

    afterEach(function() {

    });

    it("should have an enhanced browse journal in browzine option", function() {
      var template = documentSummary.find(".browzine");
      expect(template).toBeDefined();
      expect(template.text().trim()).toEqual("View the Journal: Browse Now");
      expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/10292");
      expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
      expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.png");
    });

    it("should have an enhanced browzine journal cover", function() {
      var coverImage = documentSummary.find(".coverImage img");
      expect(coverImage).toBeDefined();
      expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
    });
  });

  describe("search results article >", function() {
    describe("search results article with both browzine web link and direct to pdf link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1136/bmj.h2575"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        $.getJSON = function(endpoint, callback) {
          expect(endpoint).toMatch(/articles\/doi\/10.1136%2Fbmj.h2575/);

          return callback({
            "data": {
              "id": 55134408,
              "type": "articles",
              "title": "New England Journal of Medicine reconsiders relationship with industry",
              "date": "2015-05-12",
              "authors": "McCarthy, M.",
              "inPress": false,
              "availableThroughBrowzine": true,
              "startPage": "h2575",
              "endPage": "h2575",
              "browzineWebLink": "https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575",
              "fullTextFile": "https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file"
            },
            "included": [{
              "id": 18126,
              "type": "journals",
              "title": "theBMJ",
              "issn": "09598138",
              "sjrValue": 2.567,
              "coverImageUrl": "https://assets.thirdiron.com/images/covers/0959-8138.png",
              "browzineEnabled": true,
              "browzineWebLink": "https://develop.browzine.com/libraries/XXX/journals/18126"
            }]
          });
        };

        summon.adapter(documentSummary);
      });

      afterEach(function() {

      });

      it("should have an enhanced browse article in browzine option", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Complete Issue: Browse Now");
        expect(template.text().trim()).toContain("Article PDF: Download Now");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.png");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine-pdf-download-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
      });
    });

    describe("search results article with browzine web link and disabled direct to pdf link >", function() {
      beforeEach(function() {
        summon = browzine.summon;
        browzine.articlePDFDownloadLinkEnabled = false;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1136/bmj.h2575"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        $.getJSON = function(endpoint, callback) {
          expect(endpoint).toMatch(/articles\/doi\/10.1136%2Fbmj.h2575/);

          return callback({
            "data": {
              "id": 55134408,
              "type": "articles",
              "title": "New England Journal of Medicine reconsiders relationship with industry",
              "date": "2015-05-12",
              "authors": "McCarthy, M.",
              "inPress": false,
              "availableThroughBrowzine": true,
              "startPage": "h2575",
              "endPage": "h2575",
              "browzineWebLink": "https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575",
              "fullTextFile": "https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file"
            },
            "included": [{
              "id": 18126,
              "type": "journals",
              "title": "theBMJ",
              "issn": "09598138",
              "sjrValue": 2.567,
              "coverImageUrl": "https://assets.thirdiron.com/images/covers/0959-8138.png",
              "browzineEnabled": true,
              "browzineWebLink": "https://develop.browzine.com/libraries/XXX/journals/18126"
            }]
          });
        };

        summon.adapter(documentSummary);
      });

      afterEach(function() {
        delete browzine.articlePDFDownloadLinkEnabled;
      });

      it("should have an enhanced browse article in browzine option", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Complete Issue: Browse Now");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.png");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
      });
    });

    describe("search results article with no browzineWebLink >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["02.2016/bmj.h0830"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        $.getJSON = function(endpoint, callback) {
          expect(endpoint).toMatch(/articles\/doi\/02.2016%2Fbmj.h0830/);

          return callback({
            "data": {
              "id": 55134408,
              "type": "articles",
              "title": "Adefovir Dipivoxil for the Treatment of Hepatitis B e Antigen–Negative Chronic Hepatitis B",
              "date": "2015-05-12",
              "authors": "McCarthy, M.",
              "inPress": false,
              "availableThroughBrowzine": true,
              "startPage": "h2575",
              "endPage": "h2575"
            },
            "included": [{
              "id": 18126,
              "type": "journals",
              "title": "theBMJ",
              "issn": "09598138",
              "sjrValue": 2.567,
              "coverImageUrl": "https://assets.thirdiron.com/images/covers/0959-8138.png",
              "browzineEnabled": true,
              "browzineWebLink": "https://develop.browzine.com/libraries/XXX/journals/18126"
            }]
          });
        };

        summon.adapter(documentSummary);
      });

      it("should not have an enhanced browse article in browzine option", function() {
        var template = documentSummary.find(".browzine");
        expect(template.text().trim()).toEqual("");
      });
    });

    describe("search results article not browzineEnabled >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["02.2016/bmj.h0830"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        $.getJSON = function(endpoint, callback) {
          expect(endpoint).toMatch(/articles\/doi\/02.2016%2Fbmj.h0830/);

          return callback({
            "data": {
              "id": 55134408,
              "type": "articles",
              "title": "Adefovir Dipivoxil for the Treatment of Hepatitis B e Antigen–Negative Chronic Hepatitis B",
              "date": "2015-05-12",
              "authors": "McCarthy, M.",
              "inPress": false,
              "availableThroughBrowzine": false,
              "startPage": "h2575",
              "endPage": "h2575"
            },
            "included": [{
              "id": 18126,
              "type": "journals",
              "title": "theBMJ",
              "issn": "09598138",
              "sjrValue": 2.567,
              "coverImageUrl": "https://assets.thirdiron.com/images/covers/0959-8138.png",
              "browzineEnabled": false
            }]
          });
        };

        summon.adapter(documentSummary);
      });

      it("should not have an enhanced browse article in browzine link in search result", function() {
        var template = documentSummary.find(".browzine .browzine-web-link");
        expect(template.text().trim()).toEqual("");
      });

      it("should not have an enhanced direct to pdf link in search result", function() {
        var template = documentSummary.find(".browzine .browzine-direct-to-pdf-link");
        expect(template.text().trim()).toEqual("");
      });
    });
  });
});
