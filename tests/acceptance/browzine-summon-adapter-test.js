describe("BrowZine Summon Adapter", function() {
  var compile, scope, documentSummaryElement, httpBackend;

  function getCompiledDocumentSummaryDirective() {
    var compiledDirective = compile(angular.element("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>"))(scope);
    scope.$digest();
    return compiledDirective;
  }

  describe("search results journal", function() {
    beforeEach(function() {
      module('summonApp.directives');

      inject(function ($compile, $rootScope, $httpBackend) {
        compile = $compile;
        scope = $rootScope.$new();
        httpBackend = $httpBackend;

        scope.document = {
          content_type: "Journal",
          issns: ["0028-4793"]
        };

        httpBackend.whenGET(/journals\?ISSN=00284793/).respond({
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
      });

      documentSummaryElement = getCompiledDocumentSummaryDirective();
    });

    it("should have an enhanced browse journal in browzine option", function() {
      httpBackend.flush();

      var template = documentSummaryElement.find(".browzine");
      expect(template).toBeDefined();
      expect(template.text().trim()).toEqual("View the Journal: Browse Now");
      expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/10292");
      expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
      expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png");
    });

    it("should have an enhanced browzine journal cover", function() {
      httpBackend.flush();

      var coverImage = documentSummaryElement.find(".coverImage img");
      expect(coverImage).toBeDefined();
      expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
    });
  });

  describe("search results article", function() {
    beforeEach(function() {
      module('summonApp.directives');

      inject(function ($compile, $rootScope, $httpBackend) {
        compile = $compile;
        scope = $rootScope.$new();
        httpBackend = $httpBackend;

        scope.document = {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        };

        httpBackend.whenGET(/articles\?DOI=10.1136%2Fbmj.h2575/).respond({
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
            "browzineWebLink": "https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575"
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
      });

      documentSummaryElement = getCompiledDocumentSummaryDirective();
    });

    it("should have an enhanced browse article in browzine option", function() {
      httpBackend.flush();

      var template = documentSummaryElement.find(".browzine");
      expect(template).toBeDefined();
      expect(template.text().trim()).toEqual("View Complete Issue: Browse Now");
      expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
      expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
      expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png");
    });

    it("should have an enhanced browzine journal cover", function() {
      httpBackend.flush();

      var coverImage = documentSummaryElement.find(".coverImage img");
      expect(coverImage).toBeDefined();
      expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
    });
  });

  describe("search results article with no browzineWebLink", function() {
    beforeEach(function() {
      module('summonApp.directives');

      inject(function ($compile, $rootScope, $httpBackend) {
        compile = $compile;
        scope = $rootScope.$new();
        httpBackend = $httpBackend;

        scope.document = {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        };

        httpBackend.whenGET(/articles\?DOI=10.1136%2Fbmj.h2575/).respond({
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
      });

      documentSummaryElement = getCompiledDocumentSummaryDirective();
    });

    it("should not have an enhanced browse article in browzine option", function() {
      httpBackend.flush();

      var template = documentSummaryElement.find(".browzine");
      expect(template.text().trim()).toEqual("");
    });
  });
});
