describe("BrowZine Summon Adapter >", function() {
  var summon = {}, documentSummary = {};

  $("body").append("<div id='results'></div>");

  describe("search results journal >", function() {
    describe("search results journal with browzine web link >", function() {
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

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
          })
        });

        expect(request.url).toMatch(/search\?issns=00284793/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browse journal in browzine option", function() {
        var template = documentSummary.find(".browzine");
        expect(template).toBeDefined();
        expect(template.text().trim()).toEqual("View the Journal Browse Now");
        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/10292");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
      });
    });

    describe("search results journal with configuration flags disabled >", function() {
      beforeEach(function() {
        summon = browzine.summon;
        browzine.journalCoverImagesEnabled = false;
        browzine.journalBrowZineWebLinkTextEnabled = false;
        browzine.printRecordsIntegrationEnabled = false;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal",
            issns: ["0028-4793"],
            is_print: true
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        if (!request) return;

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
          })
        });

        expect(request.url).toMatch(/search\?issns=00284793/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.journalCoverImagesEnabled;
        delete browzine.journalBrowZineWebLinkTextEnabled;
        delete browzine.printRecordsIntegrationEnabled;
      });

      it("should not have an browzine web issue link", function() {
        var template = documentSummary.find(".browzine-web-link");
        expect(template.length).toEqual(0);
      });

      it("should not have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage.attr("src")).not.toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
      });

      it("should not enhance a print record when print record integration is disabled", function() {
        var template = documentSummary.find(".browzine-web-link");
        expect(template.length).toEqual(0);
      });
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

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1136%2Fbmj.h2575/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browse article in browzine option", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Complete Issue Browse Now");
        expect(template.text().trim()).toContain("Article PDF Download Now");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
      });

      it("should open a new window when a direct to pdf link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575", "_blank");
      });
    });

    describe("search results article with a journal issn but no article doi >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            issns: ["0028-4793"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
          })
        });

        expect(request.url).toMatch(/search\?issns=00284793/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
      });
    });

    describe("search results article with no direct to pdf link and an article link >", function() {
      beforeEach(function() {
        browzine.articleLinkEnabled = true;
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

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
              "fullTextFile": "",
              "contentLocation": "https://develop.browzine.com/libraries/XXX/articles/55134408"
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
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1136%2Fbmj.h2575/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.articleLinkEnabled;
      });

      it("should enhance the search result with an article link", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Complete Issue Browse Now");
        expect(template.text().trim()).toContain("Article Link Read Article");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
      });
    });

    describe("search results article with an article in context link but no direct to pdf link and no article link >", function() {
      beforeEach(function() {
        browzine.articleLinkEnabled = true;
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

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
              "fullTextFile": "",
              "contentLocation": ""
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
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1136%2Fbmj.h2575/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.articleLinkEnabled;
      });

      it("should not enhance the search result with an article in context link", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).not.toContain("Article PDF Download Now");
        expect(template.text().trim()).not.toContain("Article Link Read Article");
        expect(template.text().trim()).not.toContain("View Complete Issue Browse Now");
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

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1136%2Fbmj.h2575/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.articlePDFDownloadLinkEnabled;
      });

      it("should have an enhanced browse article in browzine option", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Complete Issue Browse Now");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
      });
    });

    describe("search results article with configuration flags disabled >", function() {
      beforeEach(function() {
        summon = browzine.summon;
        browzine.journalCoverImagesEnabled = false;
        browzine.articleBrowZineWebLinkTextEnabled = false;
        browzine.articlePDFDownloadLinkEnabled = false;
        browzine.printRecordsIntegrationEnabled = false;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1136/bmj.h2575"],
            is_print: true
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        if (!request) return;

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1136%2Fbmj.h2575/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.journalCoverImagesEnabled;
        delete browzine.articleBrowZineWebLinkTextEnabled;
        delete browzine.articlePDFDownloadLinkEnabled;
        delete browzine.printRecordsIntegrationEnabled;
      });

      it("should not have a browzine direct to pdf link", function() {
        var template = documentSummary.find(".browzine-direct-to-pdf-link");
        expect(template.length).toEqual(0);
      });

      it("should not have an article in browzine context web link", function() {
        var template = documentSummary.find(".browzine-web-link");
        expect(template.length).toEqual(0);
      });

      it("should not have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage.attr("src")).not.toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
      });

      it("should not enhance a print record when print record integration is disabled", function() {
        var template = documentSummary.find(".browzine-web-link");
        expect(template.length).toEqual(0);
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

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
          })
        });

        expect(request.url).toMatch(/articles\/doi\/02.2016%2Fbmj.h0830/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
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

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
          })
        });

        expect(request.url).toMatch(/articles\/doi\/02.2016%2Fbmj.h0830/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
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

    describe("search results article with no doi and journal not browzineEnabled >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            issns: ["1543687X"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
            "data": [{
              "id": 47087,
              "type": "journals",
              "title": "Biotech business week",
              "issn": "1543687X",
              "sjrValue": 0,
              "coverImageUrl": "https://assets.thirdiron.com/default-journal-cover.png",
              "browzineEnabled": false,
              "externalLink": "https://onesearch.library.rice.edu/discovery/search?query=issn,exact,1543-687X,OR&query=issn,exact,,AND&pfilter=rtype,exact,journals,AND&tab=Everything&search_scope=MyInst_and_CI&vid=01RICE_INST:RICE&lang=en&mode=advanced&offset=0"
            }]
          })
        });

        expect(request.url).toMatch(/search\?issns=1543687X/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
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

    describe("search results article with no browzine results that calls unpaywall >", function() {
      beforeEach(function() {
        browzine.unpaywallEmailAddressKey = "info@thirdiron.com";
        browzine.articlePDFDownloadViaUnpaywallEnabled = true;
        browzine.articleLinkViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

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

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 404
        });
      });

      afterEach(function() {
        delete browzine.unpaywallEmailAddressKey;
        delete browzine.articlePDFDownloadViaUnpaywallEnabled;
        delete browzine.articleLinkViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;

        jasmine.Ajax.uninstall();
      });

      describe("unpaywall best open access location host type publisher and version publishedVersion and has a pdf url >", function() {
        it("should enhance the article with an unpaywall article pdf", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "open (via free pdf)",
                "host_type": "publisher",
                "is_best": true,
                "license": "cc-by-nc-nd",
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2019-10-11T20:52:04.790279",
                "url": "http://jaha.org.ro/index.php/JAHA/article/download/142/119-do-not-use",
                "url_for_landing_page": "https://doi.org/10.14795/j.v2i4.142",
                "url_for_pdf": "http://jaha.org.ro/index.php/JAHA/article/download/142/119",
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article PDF Download Now (via Unpaywall)");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
        });

        it("should not show an unpaywall article pdf when articlePDFDownloadViaUnpaywallEnabled is false", function() {
          browzine.articlePDFDownloadViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "open (via free pdf)",
                "host_type": "publisher",
                "is_best": true,
                "license": "cc-by-nc-nd",
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2019-10-11T20:52:04.790279",
                "url": "http://jaha.org.ro/index.php/JAHA/article/download/142/119-do-not-use",
                "url_for_landing_page": "https://doi.org/10.14795/j.v2i4.142",
                "url_for_pdf": "http://jaha.org.ro/index.php/JAHA/article/download/142/119",
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toEqual("");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual(undefined);
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual(undefined);
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual(undefined);
        });
      });

      describe("unpaywall best open access location host type publisher and version publishedVersion and does not have a pdf url >", function() {
        it("should enhance the article with an unpaywall article link", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa journal (via observed oa rate)",
                "host_type": "publisher",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T00:58:09.389993",
                "url": "https://doi.org/10.1098/rstb.1986.0056-do-not-use",
                "url_for_landing_page": "https://doi.org/10.1098/rstb.1986.0056",
                "url_for_pdf": null,
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article Link Read Article (via Unpaywall)");
          expect(template.find("a.unpaywall-article-link").attr("href")).toEqual("https://doi.org/10.1098/rstb.1986.0056");
          expect(template.find("a.unpaywall-article-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");
        });

        it("should not show an unpaywall article link when articleLinkViaUnpaywallEnabled is false", function() {
          browzine.articleLinkViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa journal (via observed oa rate)",
                "host_type": "publisher",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T00:58:09.389993",
                "url": "https://doi.org/10.1098/rstb.1986.0056-do-not-use",
                "url_for_landing_page": "https://doi.org/10.1098/rstb.1986.0056",
                "url_for_pdf": null,
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toEqual("");
          expect(template.find("a.unpaywall-article-link").attr("href")).toEqual(undefined);
          expect(template.find("a.unpaywall-article-link").attr("target")).toEqual(undefined);
          expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual(undefined);
        });
      });

      describe("unpaywall best open access location host type repository and version acceptedVersion and has a pdf url >", function() {
        it("should enhance the article with an unpaywall manuscript article pdf", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "e32e740fde0998433a4",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": "cc0",
                "pmh_id": "oai:diposit.ub.edu:2445/147225",
                "repository_institution": "Universitat de Barcelona - Dipòsit Digital de la Universitat de Barcelona",
                "updated": "2020-02-20T17:30:21.829852",
                "url": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf-do-not-use",
                "url_for_landing_page": "http://hdl.handle.net/2445/147225",
                "url_for_pdf": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf",
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article PDF Download Now (Accepted Manuscript via Unpaywall)");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
        });

        it("should not show an unpaywall manuscript article pdf when articleAcceptedManuscriptPDFViaUnpaywallEnabled is false", function() {
          browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "e32e740fde0998433a4",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": "cc0",
                "pmh_id": "oai:diposit.ub.edu:2445/147225",
                "repository_institution": "Universitat de Barcelona - Dipòsit Digital de la Universitat de Barcelona",
                "updated": "2020-02-20T17:30:21.829852",
                "url": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf-do-not-use",
                "url_for_landing_page": "http://hdl.handle.net/2445/147225",
                "url_for_pdf": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf",
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toEqual("");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual(undefined);
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual(undefined);
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual(undefined);
        });
      });

      describe("unpaywall best open access location host type repository and version acceptedVersion and does not have a pdf url >", function() {
        it("should enhance the article with an unpaywall manuscript article link", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa repository (via pmcid lookup)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T01:10:19.539950",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472",
                "url_for_pdf": null,
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article Link Read Article (Accepted Manuscript via Unpaywall)");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");
        });

        it("should not show an unpaywall manuscript article link when articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled is false", function() {
          browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa repository (via pmcid lookup)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T01:10:19.539950",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472",
                "url_for_pdf": null,
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toEqual("");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("href")).toEqual(undefined);
          expect(template.find("a.unpaywall-manuscript-article-link").attr("target")).toEqual(undefined);
          expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual(undefined);
        });
      });

      describe(`unpaywall best open access location host type repository and version null and has a pdf url from nih.gov or europepmc.org >`, function() {
        it("should enhance the article with an unpaywall article pdf", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "pubmedcentral.nih.gov",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": "oai:pubmedcentral.nih.gov:1386933",
                "repository_institution": "pubmedcentral.nih.gov",
                "updated": "2017-10-21T12:10:36.827576",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933",
                "url_for_pdf": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf",
                "version": null
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article PDF Download Now (via Unpaywall)");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
        });
      });

      describe(`unpaywall best open access location host type repository and version null and has a pdf url not from nih.gov or europepmc.org >`, function() {
        it("should enhance the article with an unpaywall manuscript article pdf", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "pubmedcentral.nih.gov",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": "oai:pubmedcentral.nih.gov:1386933",
                "repository_institution": "pubmedcentral.nih.gov",
                "updated": "2017-10-21T12:10:36.827576",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933",
                "url_for_pdf": "https://google.com/pmc/articles/PMC1386933/pdf",
                "version": null
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article PDF Download Now (Accepted Manuscript via Unpaywall)");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("https://google.com/pmc/articles/PMC1386933/pdf");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
        });
      });

      describe("unpaywall no best open access location >", function() {
        it("should not enhance the article with an unpaywall link", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": null
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template.length).toEqual(0);
        });
      });
    });

    describe("search results article with browzine results but no pdf url that calls unpaywall >", function() {
      beforeEach(function() {
        browzine.unpaywallEmailAddressKey = "info@thirdiron.com";
        browzine.articlePDFDownloadViaUnpaywallEnabled = true;
        browzine.articleLinkViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

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

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
            "data": {
              "id": 55134408,
              "type": "articles",
              "title": "New England Journal of Medicine reconsiders relationship with industry",
              "date": "2015-05-12",
              "authors": "McCarthy, M.",
              "inPress": false,
              "availableThroughBrowzine": true,
              "contentLocation": "",
              "startPage": "h2575",
              "endPage": "h2575",
              "browzineWebLink": "",
              "fullTextFile": ""
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
          })
        });
      });

      afterEach(function() {
        delete browzine.unpaywallEmailAddressKey;
        delete browzine.articlePDFDownloadViaUnpaywallEnabled;
        delete browzine.articleLinkViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;

        jasmine.Ajax.uninstall();
      });

      describe("unpaywall best open access location host type publisher and version publishedVersion and has a pdf url >", function() {
        it("should enhance the article with an unpaywall article pdf", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "open (via free pdf)",
                "host_type": "publisher",
                "is_best": true,
                "license": "cc-by-nc-nd",
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2019-10-11T20:52:04.790279",
                "url": "http://jaha.org.ro/index.php/JAHA/article/download/142/119-do-not-use",
                "url_for_landing_page": "https://doi.org/10.14795/j.v2i4.142",
                "url_for_pdf": "http://jaha.org.ro/index.php/JAHA/article/download/142/119",
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article PDF Download Now (via Unpaywall)");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
        });

        it("should not show an unpaywall article pdf when articlePDFDownloadViaUnpaywallEnabled is false", function() {
          browzine.articlePDFDownloadViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "open (via free pdf)",
                "host_type": "publisher",
                "is_best": true,
                "license": "cc-by-nc-nd",
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2019-10-11T20:52:04.790279",
                "url": "http://jaha.org.ro/index.php/JAHA/article/download/142/119-do-not-use",
                "url_for_landing_page": "https://doi.org/10.14795/j.v2i4.142",
                "url_for_pdf": "http://jaha.org.ro/index.php/JAHA/article/download/142/119",
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toEqual("");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual(undefined);
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual(undefined);
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual(undefined);
        });
      });

      describe("unpaywall best open access location host type publisher and version publishedVersion and does not have a pdf url >", function() {
        it("should enhance the article with an unpaywall article link", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa journal (via observed oa rate)",
                "host_type": "publisher",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T00:58:09.389993",
                "url": "https://doi.org/10.1098/rstb.1986.0056-do-not-use",
                "url_for_landing_page": "https://doi.org/10.1098/rstb.1986.0056",
                "url_for_pdf": null,
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article Link Read Article (via Unpaywall)");
          expect(template.find("a.unpaywall-article-link").attr("href")).toEqual("https://doi.org/10.1098/rstb.1986.0056");
          expect(template.find("a.unpaywall-article-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");
        });

        it("should not show an unpaywall article link when articleLinkViaUnpaywallEnabled is false", function() {
          browzine.articleLinkViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa journal (via observed oa rate)",
                "host_type": "publisher",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T00:58:09.389993",
                "url": "https://doi.org/10.1098/rstb.1986.0056-do-not-use",
                "url_for_landing_page": "https://doi.org/10.1098/rstb.1986.0056",
                "url_for_pdf": null,
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toEqual("");
          expect(template.find("a.unpaywall-article-link").attr("href")).toEqual(undefined);
          expect(template.find("a.unpaywall-article-link").attr("target")).toEqual(undefined);
          expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual(undefined);
        });
      });

      describe("unpaywall best open access location host type repository and version acceptedVersion and has a pdf url >", function() {
        it("should enhance the article with an unpaywall manuscript article pdf", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "e32e740fde0998433a4",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": "cc0",
                "pmh_id": "oai:diposit.ub.edu:2445/147225",
                "repository_institution": "Universitat de Barcelona - Dipòsit Digital de la Universitat de Barcelona",
                "updated": "2020-02-20T17:30:21.829852",
                "url": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf-do-not-use",
                "url_for_landing_page": "http://hdl.handle.net/2445/147225",
                "url_for_pdf": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf",
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article PDF Download Now (Accepted Manuscript via Unpaywall)");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
        });

        it("should not show an unpaywall manuscript article pdf when articleAcceptedManuscriptPDFViaUnpaywallEnabled is false", function() {
          browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "e32e740fde0998433a4",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": "cc0",
                "pmh_id": "oai:diposit.ub.edu:2445/147225",
                "repository_institution": "Universitat de Barcelona - Dipòsit Digital de la Universitat de Barcelona",
                "updated": "2020-02-20T17:30:21.829852",
                "url": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf-do-not-use",
                "url_for_landing_page": "http://hdl.handle.net/2445/147225",
                "url_for_pdf": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf",
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toEqual("");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual(undefined);
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual(undefined);
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual(undefined);
        });
      });

      describe("unpaywall best open access location host type repository and version acceptedVersion and does not have a pdf url >", function() {
        it("should enhance the article with an unpaywall manuscript article link", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa repository (via pmcid lookup)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T01:10:19.539950",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472",
                "url_for_pdf": null,
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article Link Read Article (Accepted Manuscript via Unpaywall)");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");
        });

        it("should not show an unpaywall manuscript article link when articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled is false", function() {
          browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa repository (via pmcid lookup)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T01:10:19.539950",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472",
                "url_for_pdf": null,
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toEqual("");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("href")).toEqual(undefined);
          expect(template.find("a.unpaywall-manuscript-article-link").attr("target")).toEqual(undefined);
          expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual(undefined);
        });
      });

      describe(`unpaywall best open access location host type repository and version null and has a pdf url from nih.gov or europepmc.org >`, function() {
        it("should enhance the article with an unpaywall article pdf", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "pubmedcentral.nih.gov",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": "oai:pubmedcentral.nih.gov:1386933",
                "repository_institution": "pubmedcentral.nih.gov",
                "updated": "2017-10-21T12:10:36.827576",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933",
                "url_for_pdf": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf",
                "version": null
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Article PDF Download Now (via Unpaywall)");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
        });
      });

      describe("unpaywall no best open access location >", function() {
        it("should not enhance the article with an unpaywall link", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": null
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template.length).toEqual(0);
        });
      });
    });

    describe("search results open access article with a direct to pdf link and journal not browzineEnabled >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1177/2158244020915900"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
            "data": {
              "id": 379795373,
              "type": "articles",
              "title": "From Open Access to Open Science: The Path From Scientific Reality to Open Scientific Communication",
              "date": "2020-05-10",
              "doi": "10.1177/2158244020915900",
              "authors": "Heise, Christian; Pearce, Joshua M.",
              "inPress": false,
              "openAccess": true,
              "pmid": "",
              "availableThroughBrowzine": false,
              "startPage": "215824402091590",
              "endPage": "",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/379795373/content-location",
              "fullTextFile": "https://develop.libkey.io/libraries/XXXX/articles/379795373/full-text-file",
              "ILLURL": "https://illiad.mines.edu/illiad//illiad.dll?Action=10&Form=30&&rft.genre=article&rft.aulast=Heise&rft.issn=2158-2440&rft.jtitle=SAGE%20Open&rft.atitle=From%20Open%20Access%20to%20Open%20Science%3A%20The%20Path%20From%20Scientific%20Reality%20to%20Open%20Scientific%20Communication&rft.volume=10&rft.issue=2&rft.spage=215824402091590&rft.epage=&rft.date=2020-05-10&rfr_id=BrowZine"
            },
            "included": [{
              "id": 18126,
              "type": "journals",
              "title": "SAGE Open",
              "issn": "21582440",
              "sjrValue": 0.248,
              "coverImageUrl": "https://assets.thirdiron.com/images/covers/2158-2440.png",
              "browzineEnabled": false,
              "externalLink": "https://mines.primo.exlibrisgroup.com/discovery/search?query=issn,contains,2158-2440,AND&pfilter=rtype,exact,journals,AND&tab=Everything&search_scope=MyInst_and_CI&sortby=rank&vid=01COLSCHL_INST:MINES&lang=en&mode=advanced&offset=0"
            }]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1177%2F2158244020915900/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browse article in browzine option", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Article PDF Download Now");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/articles/379795373/full-text-file");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/2158-2440.png");
      });

      it("should open a new window when a direct to pdf link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/articles/379795373/full-text-file", "_blank");
      });
    });

    describe("search results article extra links and both browzine web link and direct to pdf link >", function() {
      beforeEach(function() {
        summon = browzine.summon;
        browzine.libKeyOneLinkView = true;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'><div class='availabilityContent'><span class='contentType'>Journal Article </span><a class='availabilityLink' href='#'>Full Text Online </a></div></div><div class='row'><span class='customPrimaryLinkContainer'><a target='_blank'>PDF</a></span></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1136/bmj.h2575"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
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
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1136%2Fbmj.h2575/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.libKeyOneLinkView;
      });

      it("should not show the content link option", function() {
        expect(documentSummary).toBeDefined();
        expect(documentSummary.text().trim()).toContain("Article PDF Download Now");
        expect(documentSummary.text().trim()).not.toContain("Journal Article Full Text Online");
      });

      it("should not show the quick link option", function() {
        var quicklink = documentSummary.find("span.customPrimaryLinkContainer");

        expect(documentSummary).toBeDefined();
        expect(documentSummary.text().trim()).toContain("Article PDF Download Now");

        expect(quicklink.length).toEqual(0);
      });
    });

    describe("search results article with extra links and with no browzine results that calls unpaywall >", function() {
      beforeEach(function() {
        browzine.unpaywallEmailAddressKey = "info@thirdiron.com";
        browzine.articlePDFDownloadViaUnpaywallEnabled = true;
        browzine.articleLinkViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

        summon = browzine.summon;
        browzine.libKeyOneLinkView = true;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div><div class='row'><span class='customPrimaryLinkContainer'><a target='_blank'>PDF</a></span></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1136/bmj.h2575"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var request = jasmine.Ajax.requests.mostRecent();

        request.respondWith({
          status: 404
        });
      });

      afterEach(function() {
        delete browzine.unpaywallEmailAddressKey;
        delete browzine.articlePDFDownloadViaUnpaywallEnabled;
        delete browzine.articleLinkViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;

        delete browzine.libKeyOneLinkView;

        jasmine.Ajax.uninstall();
      });

      describe("unpaywall best open access location host type publisher and version publishedVersion and has a pdf url >", function() {
        it("should enhance the article with an unpaywall article pdf and show libkey one link view", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "open (via free pdf)",
                "host_type": "publisher",
                "is_best": true,
                "license": "cc-by-nc-nd",
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2019-10-11T20:52:04.790279",
                "url": "http://jaha.org.ro/index.php/JAHA/article/download/142/119-do-not-use",
                "url_for_landing_page": "https://doi.org/10.14795/j.v2i4.142",
                "url_for_pdf": "http://jaha.org.ro/index.php/JAHA/article/download/142/119",
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(0);
        });

        it("should not show an unpaywall article pdf when articlePDFDownloadViaUnpaywallEnabled is false and not show libkey one link view", function() {
          browzine.articlePDFDownloadViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "open (via free pdf)",
                "host_type": "publisher",
                "is_best": true,
                "license": "cc-by-nc-nd",
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2019-10-11T20:52:04.790279",
                "url": "http://jaha.org.ro/index.php/JAHA/article/download/142/119-do-not-use",
                "url_for_landing_page": "https://doi.org/10.14795/j.v2i4.142",
                "url_for_pdf": "http://jaha.org.ro/index.php/JAHA/article/download/142/119",
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(1);
        });
      });

      describe("unpaywall best open access location host type publisher and version publishedVersion and does not have a pdf url >", function() {
        it("should enhance the article with an unpaywall article link and not show libkey one link view", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa journal (via observed oa rate)",
                "host_type": "publisher",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T00:58:09.389993",
                "url": "https://doi.org/10.1098/rstb.1986.0056-do-not-use",
                "url_for_landing_page": "https://doi.org/10.1098/rstb.1986.0056",
                "url_for_pdf": null,
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(1);
        });

        it("should not show an unpaywall article link when articleLinkViaUnpaywallEnabled is false and not show libkey one link view", function() {
          browzine.articleLinkViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa journal (via observed oa rate)",
                "host_type": "publisher",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T00:58:09.389993",
                "url": "https://doi.org/10.1098/rstb.1986.0056-do-not-use",
                "url_for_landing_page": "https://doi.org/10.1098/rstb.1986.0056",
                "url_for_pdf": null,
                "version": "publishedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(1);
        });
      });

      describe("unpaywall best open access location host type repository and version acceptedVersion and has a pdf url >", function() {
        it("should enhance the article with an unpaywall manuscript article pdf and show libkey one link view", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "e32e740fde0998433a4",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": "cc0",
                "pmh_id": "oai:diposit.ub.edu:2445/147225",
                "repository_institution": "Universitat de Barcelona - Dipòsit Digital de la Universitat de Barcelona",
                "updated": "2020-02-20T17:30:21.829852",
                "url": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf-do-not-use",
                "url_for_landing_page": "http://hdl.handle.net/2445/147225",
                "url_for_pdf": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf",
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(0);
        });

        it("should not show an unpaywall manuscript article pdf when articleAcceptedManuscriptPDFViaUnpaywallEnabled is false and not show libkey one link view", function() {
          browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "e32e740fde0998433a4",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": "cc0",
                "pmh_id": "oai:diposit.ub.edu:2445/147225",
                "repository_institution": "Universitat de Barcelona - Dipòsit Digital de la Universitat de Barcelona",
                "updated": "2020-02-20T17:30:21.829852",
                "url": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf-do-not-use",
                "url_for_landing_page": "http://hdl.handle.net/2445/147225",
                "url_for_pdf": "http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf",
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(1);
        });
      });

      describe("unpaywall best open access location host type repository and version acceptedVersion and does not have a pdf url >", function() {
        it("should enhance the article with an unpaywall manuscript article link and not show libeky one link view", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa repository (via pmcid lookup)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T01:10:19.539950",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472",
                "url_for_pdf": null,
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(1);
        });

        it("should not show an unpaywall manuscript article link when articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled is false and not show libkey one link view", function() {
          browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = false;

          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": null,
                "evidence": "oa repository (via pmcid lookup)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": null,
                "repository_institution": null,
                "updated": "2020-02-22T01:10:19.539950",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472",
                "url_for_pdf": null,
                "version": "acceptedVersion"
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(1);
        });
      });

      describe(`unpaywall best open access location host type repository and version null and has a pdf url from nih.gov or europepmc.org >`, function() {
        it("should enhance the article with an unpaywall article pdf and show libkey one link view", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "pubmedcentral.nih.gov",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": "oai:pubmedcentral.nih.gov:1386933",
                "repository_institution": "pubmedcentral.nih.gov",
                "updated": "2017-10-21T12:10:36.827576",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933",
                "url_for_pdf": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf",
                "version": null
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(0);
        });
      });

      describe(`unpaywall best open access location host type repository and version null and has a pdf url not from nih.gov or europepmc.org >`, function() {
        it("should enhance the article with an unpaywall manuscript article pdf and show libkey one link view", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": {
                "endpoint_id": "pubmedcentral.nih.gov",
                "evidence": "oa repository (via OAI-PMH doi match)",
                "host_type": "repository",
                "is_best": true,
                "license": null,
                "pmh_id": "oai:pubmedcentral.nih.gov:1386933",
                "repository_institution": "pubmedcentral.nih.gov",
                "updated": "2017-10-21T12:10:36.827576",
                "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf-do-not-use",
                "url_for_landing_page": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933",
                "url_for_pdf": "https://google.com/pmc/articles/PMC1386933/pdf",
                "version": null
              }
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template).toBeDefined();

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(0);
        });
      });

      describe("unpaywall no best open access location >", function() {
        it("should not enhance the article with an unpaywall link and not show libkey one link view", function() {
          var request = jasmine.Ajax.requests.mostRecent();

          request.respondWith({
            status: 200,
            contentType: "application/json",
            response: JSON.stringify({
              "best_oa_location": null
            })
          });

          var template = documentSummary.find(".browzine");

          expect(template.length).toEqual(0);

          var quicklink = documentSummary.find("span.customPrimaryLinkContainer");
          expect(quicklink.length).toEqual(1);
        });
      });
    });
  });
});
