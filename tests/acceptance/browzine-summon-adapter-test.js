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
        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("View Now PDF");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
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

    describe("search results article with both browzine web link and retracted article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1155/2019/5730746"]
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
              "id": 284414450,
              "type": "articles",
              "title": "Operational Risk Assessment for International Transport Corridor: A Case Study of China-Pakistan Economic Corridor",
              "date": "2019-03-04",
              "authors": "Lei, Yang; Huang, Chengfeng; Wu, Yuan",
              "inPress": false,
              "doi": "10.1155/2019/5730746",
              "ILLURL": "https://illiad.mines.edu/illiad//illiad.dll?Action=10&Form=30&&rft.genre=article&rft.aulast=Lei&rft.issn=1026-0226&rft.jtitle=Discrete%20Dynamics%20in%20Nature%20and%20Society&rft.atitle=Operational%20Risk%20Assessment%20for%20International%20Transport%20Corridor%3A%20A%20Case%20Study%20of%20China-Pakistan%20Economic%20Corridor&rft.volume=2019&rft.issue=&rft.spage=1&rft.epage=7&rft.date=2019-03-04&rfr_id=BrowZine",
              "pmid": "",
              "openAccess": true,
              "fullTextFile": "https://develop.libkey.io/libraries/XXXX/articles/284414450/full-text-file?utm_source=api_716",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/284414450/content-location",
              "availableThroughBrowzine": true,
              "startPage": "1",
              "endPage": "7",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/36603/issues/205373599?showArticleInContext=doi:10.1155%2F2019%2F5730746&utm_source=api_716",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 36603
                  }
                }
              },
              "retractionNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1155/2019/5730746",
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1155/2019/5730746"
            },
            "included": [
              {
                "id": 36603,
                "type": "journals",
                "title": "Discrete Dynamics in Nature and Society",
                "issn": "10260226",
                "sjrValue": 0.266,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1026-0226.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/36603?utm_source=api_716"
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1155%2F2019%2F5730746/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browse article in browzine option", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("Retracted Article More Info");
        expect(template.text().trim()).not.toContain("Expression of Concern More Info");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/36603/issues/205373599?showArticleInContext=doi:10.1155%2F2019%2F5730746&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1155/2019/5730746");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/1026-0226.png");
      });

      it("should open a new window when a retracted article link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1155/2019/5730746", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/36603/issues/205373599?showArticleInContext=doi:10.1155%2F2019%2F5730746&utm_source=api_716", "_blank");
      });
    });

    describe("search results article with both browzine web link and eoc article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1001/jama.298.4.413"]
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
              "id": 4699582,
              "type": "articles",
              "title": "Efficacy of a Hip Protector to Prevent Hip Fracture in Nursing Home Residents",
              "date": "2007-05-13",
              "authors": "Kiel, Douglas P.; Magaziner, Jay; Zimmerman, Sheryl; Birge, Stanley J.",
              "inPress": false,
              "doi": "10.1001/jama.298.4.413",
              "openAccess": true,
              "fullTextFile": "https://develop.libkey.io/libraries/XXXX/articles/4699582/full-text-file?utm_source=api_716",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/4699582/content-location",
              "availableThroughBrowzine": true,
              "startPage": "413",
              "endPage": "",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/10278/issues/4699582?showArticleInContext=doi:10.1001%2Fjama.298.4.413&utm_source=api_716",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 10278
                  }
                }
              },
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1001/jama.298.4.413"
            },
            "included": [
              {
                "id": 10278,
                "type": "journals",
                "title": "JAMA: Journal of the American Medical Association",
                "issn": "15383598",
                "sjrValue": 6.695,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1538-3598.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/10278?utm_source=api_716"
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1001%2Fjama.298.4.413/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browse article in browzine option", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("Expression of Concern More Info");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/10278/issues/4699582?showArticleInContext=doi:10.1001%2Fjama.298.4.413&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1001/jama.298.4.413");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/1538-3598.png");
      });

      it("should open a new window when an eoc article link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1001/jama.298.4.413", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/10278/issues/4699582?showArticleInContext=doi:10.1001%2Fjama.298.4.413&utm_source=api_716", "_blank");
      });
    });

    describe("search results article with both browzine web link and problematic journal notice link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1001/jama.298.4.413"]
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
              "id": 4699582,
              "type": "articles",
              "title": "Efficacy of a Hip Protector to Prevent Hip Fracture in Nursing Home Residents",
              "date": "2007-05-13",
              "authors": "Kiel, Douglas P.; Magaziner, Jay; Zimmerman, Sheryl; Birge, Stanley J.",
              "inPress": false,
              "doi": "10.1001/jama.298.4.413",
              "openAccess": true,
              "fullTextFile": "https://develop.libkey.io/libraries/XXXX/articles/4699582/full-text-file?utm_source=api_716",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/4699582/content-location",
              "availableThroughBrowzine": true,
              "startPage": "413",
              "endPage": "",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/10278/issues/4699582?showArticleInContext=doi:10.1001%2Fjama.298.4.413&utm_source=api_716",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 10278
                  }
                }
              },
              "problematicJournalArticleNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1001/jama.298.4.413.problematic"
            },
            "included": [
              {
                "id": 10278,
                "type": "journals",
                "title": "JAMA: Journal of the American Medical Association",
                "issn": "15383598",
                "sjrValue": 6.695,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1538-3598.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/10278?utm_source=api_716"
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1001%2Fjama.298.4.413/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browse article in browzine option", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("Problematic Journal More Info");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/10278/issues/4699582?showArticleInContext=doi:10.1001%2Fjama.298.4.413&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1001/jama.298.4.413.problematic");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/1538-3598.png");
      });

      it("should open a new window when a problematic journal article notice link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1001/jama.298.4.413.problematic", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/10278/issues/4699582?showArticleInContext=doi:10.1001%2Fjama.298.4.413&utm_source=api_716", "_blank");
      });
    });

    describe("retraction notice and only an article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1162/jocn_a_00867"]
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
              "id": 56171427,
              "type": "articles",
              "title": "Effects of Transcranial Direct Current Stimulation over Left Dorsolateral pFC on the Attentional Blink Depend on Individual Baseline Performance",
              "date": "2015-12-01",
              "authors": "London, Raquel E.; Slagter, Heleen A.",
              "inPress": false,
              "doi": "10.1162/jocn_a_00867",
              "ILLURL": "https://sfu-primo.hosted.exlibrisgroup.com/primo-explore/openurl?ctx_ver=Z39.88-2004&rft.genre=article&ctx_enc=info:ofi%2Fenc:UTF-8&url_ver=Z39.88-2004&url_ctx_fmt=infofi%2Ffmt:kev:mtx:ctx&url_ctx_fmt=infofi%2Ffmt:kev:mtx:ctx&rfr_id=info:sid%2Fprimo.exlibrisgroup.com:primo4-article-cLinker&rft_val_fmt=info:ofi%2Ffmt:kev:mtx:article&rft.aulast=London&rft.issn=0898-929X&rft.jtitle=Journal%20of%20Cognitive%20Neuroscience&rft.atitle=Effects%20of%20Transcranial%20Direct%20Current%20Stimulation%20over%20Left%20Dorsolateral%20pFC%20on%20the%20Attentional%20Blink%20Depend%20on%20Individual%20Baseline%20Performance&rft.volume=27&rft.issue=12&rft.spage=2382&rft.epage=2393&rft.date=2015-12-01&rft.doi=10.1162%2Fjocn_a_00867&vid=SFUL&institution=01SFUL&url_ctx_val=&isSerivcesPage=true",
              "pmid": "26284996",
              "openAccess": false,
              "fullTextFile": "",
              "contentLocation": "https://libkey.io/libraries/513/articles/56171427/content-location",
              "availableThroughBrowzine": true,
              "startPage": "2382",
              "endPage": "2393",
              "browzineWebLink": "https://browzine.com/libraries/513/journals/32127/issues/7986254?showArticleInContext=doi:10.1162%2Fjocn_a_00867&utm_source=api_572",
              "relationships": {
                "library": {
                  "data": {
                    "type": "libraries",
                    "id": 513
                  }
                }
              },
              "retractionNoticeUrl": "https://libkey.io/libraries/513/10.1162/jocn_a_00867",
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1162/jocn_a_00867",

            },
            "included": [
              {
                "id": 32127,
                "type": "journals",
                "title": "Journal of Cognitive Neuroscience",
                "issn": "0898929X",
                "sjrValue": 2.132,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/0898-929X.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://browzine.com/libraries/513/journals/32127?utm_source=api_572"
              },
              {
                "id": 513,
                "type": "libraries",
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1162%2Fjocn_a_00867/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should show retraction notices when there is only an article link", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("Retracted Article More Info");
        expect(template.text().trim()).not.toContain("Expression of Concern More Info");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/513/journals/32127/issues/7986254?showArticleInContext=doi:10.1162%2Fjocn_a_00867&utm_source=api_572");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://libkey.io/libraries/513/10.1162/jocn_a_00867");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0898-929X.png");
      });

      it("should open a new window when a retracted article link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://libkey.io/libraries/513/10.1162/jocn_a_00867", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://browzine.com/libraries/513/journals/32127/issues/7986254?showArticleInContext=doi:10.1162%2Fjocn_a_00867&utm_source=api_572", "_blank");
      });
    });

    describe("eoc notice and only an article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1634/theoncologist.8-4-307"]
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
              "id": 43816537,
              "type": "articles",
              "title": "The HER-2/ neu Gene and Protein in Breast Cancer 2003: Biomarker and Target of Therapy",
              "date": "2003-08-01",
              "authors": "Ross, Jeffrey S.; Fletcher, Jonathan A.; Linette, Gerald P.; Stec, James; Clark, Edward; Ayers, Mark; Symmans, W. Fraser; Pusztai, Lajos; Bloom, Kenneth J.",
              "inPress": false,
              "doi": "10.1634/theoncologist.8-4-307",
              "openAccess": false,
              "fullTextFile": "",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/43816537/content-location",
              "availableThroughBrowzine": true,
              "startPage": "2382",
              "endPage": "2393",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 31343
                  }
                }
              },
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307"
            },
            "included": [
              {
                "id": 31343,
                "type": "journals",
                "title": "The Oncologist",
                "issn": "10837159",
                "sjrValue": 1.859,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1083-7159.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343?utm_source=api_572"
              },
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1634%2Ftheoncologist.8-4-307/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should show eoc notices when there is only an article link", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("Expression of Concern More Info");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/1083-7159.png");
      });

      it("should open a new window when an eoc article link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572", "_blank");
      });
    });

    describe("problematic journal notice and only an article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1634/theoncologist.8-4-307"]
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
              "id": 43816537,
              "type": "articles",
              "title": "The HER-2/ neu Gene and Protein in Breast Cancer 2003: Biomarker and Target of Therapy",
              "date": "2003-08-01",
              "authors": "Ross, Jeffrey S.; Fletcher, Jonathan A.; Linette, Gerald P.; Stec, James; Clark, Edward; Ayers, Mark; Symmans, W. Fraser; Pusztai, Lajos; Bloom, Kenneth J.",
              "inPress": false,
              "doi": "10.1634/theoncologist.8-4-307",
              "openAccess": false,
              "fullTextFile": "",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/43816537/content-location",
              "availableThroughBrowzine": true,
              "startPage": "2382",
              "endPage": "2393",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 31343
                  }
                }
              },
              "problematicJournalArticleNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307.problematic"
            },
            "included": [
              {
                "id": 31343,
                "type": "journals",
                "title": "The Oncologist",
                "issn": "10837159",
                "sjrValue": 1.859,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1083-7159.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343?utm_source=api_572"
              },
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1634%2Ftheoncologist.8-4-307/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should show problematic journal article notices when there is only an article link", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("Problematic Journal More Info");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307.problematic");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/1083-7159.png");
      });

      it("should open a new window when a problematic journal article notice link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307.problematic", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572", "_blank");
      });
    });

    describe("problematic journal notice with customized problematic journal wording and only an article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        browzine.problematicJournalWording = 'This Might Be Problematic';
        browzine.problematicJournalText = 'Even More Info';

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1634/theoncologist.8-4-307"]
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
              "id": 43816537,
              "type": "articles",
              "title": "The HER-2/ neu Gene and Protein in Breast Cancer 2003: Biomarker and Target of Therapy",
              "date": "2003-08-01",
              "authors": "Ross, Jeffrey S.; Fletcher, Jonathan A.; Linette, Gerald P.; Stec, James; Clark, Edward; Ayers, Mark; Symmans, W. Fraser; Pusztai, Lajos; Bloom, Kenneth J.",
              "inPress": false,
              "doi": "10.1634/theoncologist.8-4-307",
              "openAccess": false,
              "fullTextFile": "",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/43816537/content-location",
              "availableThroughBrowzine": true,
              "startPage": "2382",
              "endPage": "2393",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 31343
                  }
                }
              },
              "problematicJournalArticleNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307.problematic"
            },
            "included": [
              {
                "id": 31343,
                "type": "journals",
                "title": "The Oncologist",
                "issn": "10837159",
                "sjrValue": 1.859,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1083-7159.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343?utm_source=api_572"
              },
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1634%2Ftheoncologist.8-4-307/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        delete browzine.problematicJournalWording;
        delete browzine.problematicJournalText;
        jasmine.Ajax.uninstall();
      });

      it("should show problematic journal article notices when there is only an article link", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("This Might Be Problematic Even More Info");
      });
    });

    describe("problematic journal notice disabled >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        browzine.problematicJournalEnabled = false;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1634/theoncologist.8-4-307"]
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
              "id": 43816537,
              "type": "articles",
              "title": "The HER-2/ neu Gene and Protein in Breast Cancer 2003: Biomarker and Target of Therapy",
              "date": "2003-08-01",
              "authors": "Ross, Jeffrey S.; Fletcher, Jonathan A.; Linette, Gerald P.; Stec, James; Clark, Edward; Ayers, Mark; Symmans, W. Fraser; Pusztai, Lajos; Bloom, Kenneth J.",
              "inPress": false,
              "doi": "10.1634/theoncologist.8-4-307",
              "openAccess": false,
              "fullTextFile": "",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/43816537/content-location",
              "availableThroughBrowzine": true,
              "startPage": "2382",
              "endPage": "2393",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 31343
                  }
                }
              },
              "problematicJournalArticleNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307.problematic"
            },
            "included": [
              {
                "id": 31343,
                "type": "journals",
                "title": "The Oncologist",
                "issn": "10837159",
                "sjrValue": 1.859,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1083-7159.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343?utm_source=api_572"
              },
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1634%2Ftheoncologist.8-4-307/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        delete browzine.problematicJournalEnabled;
        jasmine.Ajax.uninstall();
      });

      it("should show no problematic journal label when it is disabled", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).not.toContain("Problematic Journal More Info");
      });
    });

    describe("retraction notice and no pdf link or article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1162/jocn_a_00867"]
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
              "id": 56171427,
              "type": "articles",
              "title": "Effects of Transcranial Direct Current Stimulation over Left Dorsolateral pFC on the Attentional Blink Depend on Individual Baseline Performance",
              "date": "2015-12-01",
              "authors": "London, Raquel E.; Slagter, Heleen A.",
              "inPress": false,
              "doi": "10.1162/jocn_a_00867",
              "ILLURL": "",
              "pmid": "26284996",
              "openAccess": false,
              "fullTextFile": "",
              "contentLocation": "",
              "availableThroughBrowzine": false,
              "startPage": "2382",
              "endPage": "2393",
              "relationships": {
                "library": {
                  "data": {
                    "type": "libraries",
                    "id": 1466
                  }
                }
              },
              "retractionNoticeUrl": "https://libkey.io/libraries/1466/10.1162/jocn_a_00867",
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1162/jocn_a_00867",
            },
            "included": [
              {
                "id": 32127,
                "type": "journals",
                "title": "Journal of Cognitive Neuroscience",
                "issn": "0898929X",
                "sjrValue": 2.132,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/0898-929X.png",
                "browzineEnabled": false,
                "externalLink": "https://bibsys-almaprimo.hosted.exlibrisgroup.com/primo-explore/search?query=issn,exact,0898-929X,OR&query=issn,exact,,AND&pfilter=pfilter,exact,journals,AND&tab=default_tab&search_scope=default_scope&sortby=rank&vid=UBIN&lang=no_NO&mode=advanced&offset=0"
              },
              {
                "id": 1466,
                "type": "libraries",
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1162%2Fjocn_a_00867/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should show retraction notices when available even if no pdf link or article link available", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Retracted Article More Info");
        expect(template.text().trim()).not.toContain("Expression of Concern More Info");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://libkey.io/libraries/1466/10.1162/jocn_a_00867");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0898-929X.png");
      });

      it("should open a new window when a retracted article link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://libkey.io/libraries/1466/10.1162/jocn_a_00867", "_blank");
      });
    });

    describe("eoc notice and no pdf link or article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1634/theoncologist.8-4-307"]
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
              "id": 43816537,
              "type": "articles",
              "title": "The HER-2/ neu Gene and Protein in Breast Cancer 2003: Biomarker and Target of Therapy",
              "date": "2003-08-01",
              "authors": "Ross, Jeffrey S.; Fletcher, Jonathan A.; Linette, Gerald P.; Stec, James; Clark, Edward; Ayers, Mark; Symmans, W. Fraser; Pusztai, Lajos; Bloom, Kenneth J.",
              "inPress": false,
              "doi": "10.1634/theoncologist.8-4-307",
              "openAccess": false,
              "fullTextFile": "",
              "contentLocation": "",
              "availableThroughBrowzine": false,
              "startPage": "2382",
              "endPage": "2393",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 31343
                  }
                }
              },
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307"
            },
            "included": [
              {
                "id": 31343,
                "type": "journals",
                "title": "The Oncologist",
                "issn": "10837159",
                "sjrValue": 1.859,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1083-7159.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343?utm_source=api_572"
              },
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1634%2Ftheoncologist.8-4-307/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should show eoc notices when available even if no pdf link or article link available", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Expression of Concern More Info");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/1083-7159.png");
      });

      it("should open a new window when an eoc article link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307", "_blank");
      });
    });

    describe("problematic journal notice and no pdf link or article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1634/theoncologist.8-4-307"]
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
              "id": 43816537,
              "type": "articles",
              "title": "The HER-2/ neu Gene and Protein in Breast Cancer 2003: Biomarker and Target of Therapy",
              "date": "2003-08-01",
              "authors": "Ross, Jeffrey S.; Fletcher, Jonathan A.; Linette, Gerald P.; Stec, James; Clark, Edward; Ayers, Mark; Symmans, W. Fraser; Pusztai, Lajos; Bloom, Kenneth J.",
              "inPress": false,
              "doi": "10.1634/theoncologist.8-4-307",
              "openAccess": false,
              "fullTextFile": "",
              "contentLocation": "",
              "availableThroughBrowzine": false,
              "startPage": "2382",
              "endPage": "2393",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 31343
                  }
                }
              },
              "problematicJournalArticleNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307.problematic"
            },
            "included": [
              {
                "id": 31343,
                "type": "journals",
                "title": "The Oncologist",
                "issn": "10837159",
                "sjrValue": 1.859,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1083-7159.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/31343?utm_source=api_572"
              },
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1634%2Ftheoncologist.8-4-307/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should show problematic journal notices when available even if no pdf link or article link available", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Problematic Journal More Info");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307.problematic");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/1083-7159.png");
      });

      it("should open a new window when a problematic journal article notice link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307.problematic", "_blank");
      });
    });

    describe("search results article with both retracted article link and article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;
        browzine.showFormatChoice = true;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1155/2019/5730746"]
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
              "id": 284414450,
              "type": "articles",
              "title": "Operational Risk Assessment for International Transport Corridor: A Case Study of China-Pakistan Economic Corridor",
              "date": "2019-03-04",
              "authors": "Lei, Yang; Huang, Chengfeng; Wu, Yuan",
              "inPress": false,
              "doi": "10.1155/2019/5730746",
              "ILLURL": "https://illiad.mines.edu/illiad//illiad.dll?Action=10&Form=30&&rft.genre=article&rft.aulast=Lei&rft.issn=1026-0226&rft.jtitle=Discrete%20Dynamics%20in%20Nature%20and%20Society&rft.atitle=Operational%20Risk%20Assessment%20for%20International%20Transport%20Corridor%3A%20A%20Case%20Study%20of%20China-Pakistan%20Economic%20Corridor&rft.volume=2019&rft.issue=&rft.spage=1&rft.epage=7&rft.date=2019-03-04&rfr_id=BrowZine",
              "pmid": "",
              "openAccess": true,
              "fullTextFile": "https://develop.libkey.io/libraries/XXXX/articles/284414450/full-text-file?utm_source=api_716",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/284414450/content-location",
              "availableThroughBrowzine": true,
              "startPage": "1",
              "endPage": "7",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/36603/issues/205373599?showArticleInContext=doi:10.1155%2F2019%2F5730746&utm_source=api_716",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 36603
                  }
                }
              },
              "retractionNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1155/2019/5730746",
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1155/2019/5730746"
            },
            "included": [
              {
                "id": 36603,
                "type": "journals",
                "title": "Discrete Dynamics in Nature and Society",
                "issn": "10260226",
                "sjrValue": 0.266,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1026-0226.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/36603?utm_source=api_716"
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1155%2F2019%2F5730746/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.showFormatChoice;
      });

      it("should have an enhanced browse article showing retraction watch only", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("Retracted Article More Info");
        expect(template.text().trim()).not.toContain("Expression of Concern More Info");
        expect(template.text().trim()).not.toContain("Article Page");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/36603/issues/205373599?showArticleInContext=doi:10.1155%2F2019%2F5730746&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1155/2019/5730746");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/1026-0226.png");
      });

      it("should open a new window when a retracted article link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1155/2019/5730746", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/36603/issues/205373599?showArticleInContext=doi:10.1155%2F2019%2F5730746&utm_source=api_716", "_blank");
      });
    });

    describe("search results article with both eoc article link and article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;
        browzine.showFormatChoice = true;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1002/ijc.25451"]
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
              "id": 26652324,
              "type": "articles",
              "title": "A tritherapy combination of a fusion protein vaccine with immune‐modulating doses of sequential chemotherapies in an optimized regimen completely eradicates large tumors in mice",
              "date": "2010-05-12",
              "authors": "Song, Xinxin; Guo, Wenzhong; Cui, Jianfeng; Qian, Xinlai; Yi, Linan; Chang, Mengjiao; Cai, Qiliang; Zhao, Qingzheng",
              "inPress": false,
              "doi": "10.1002/ijc.25451",
              "ILLURL": "",
              "pmid": "",
              "openAccess": true,
              "fullTextFile": "https://develop.libkey.io/libraries/XXXX/articles/26652324/full-text-file?utm_source=api_716",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/26652324/content-location",
              "availableThroughBrowzine": true,
              "startPage": "326",
              "endPage": "",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/13016/issues/4629899?showArticleInContext=doi:10.1002%2Fijc.25451&utm_source=api_716",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 13016
                  }
                }
              },
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451"
            },
            "included": [
              {
                "id": 13016,
                "type": "journals",
                "title": "International Journal of Cancer",
                "issn": "00207136",
                "sjrValue": 2.259,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/0020-7136.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/13016?utm_source=api_716"
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1002%2Fijc.25451/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.showFormatChoice;
      });

      it("should have an enhanced browse article showing eoc only", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("Expression of Concern More Info");
        expect(template.text().trim()).not.toContain("Article Page");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/13016/issues/4629899?showArticleInContext=doi:10.1002%2Fijc.25451&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0020-7136.png");
      });

      it("should open a new window when an eoc article link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/13016/issues/4629899?showArticleInContext=doi:10.1002%2Fijc.25451&utm_source=api_716", "_blank");
      });
    });

    describe("search results article with both problematic journal notice link and article link >", function() {
      beforeEach(function() {
        summon = browzine.summon;
        browzine.showFormatChoice = true;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.1002/ijc.25451"]
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
              "id": 26652324,
              "type": "articles",
              "title": "A tritherapy combination of a fusion protein vaccine with immune‐modulating doses of sequential chemotherapies in an optimized regimen completely eradicates large tumors in mice",
              "date": "2010-05-12",
              "authors": "Song, Xinxin; Guo, Wenzhong; Cui, Jianfeng; Qian, Xinlai; Yi, Linan; Chang, Mengjiao; Cai, Qiliang; Zhao, Qingzheng",
              "inPress": false,
              "doi": "10.1002/ijc.25451",
              "ILLURL": "",
              "pmid": "",
              "openAccess": true,
              "fullTextFile": "https://develop.libkey.io/libraries/XXXX/articles/26652324/full-text-file?utm_source=api_716",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/26652324/content-location",
              "availableThroughBrowzine": true,
              "startPage": "326",
              "endPage": "",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/13016/issues/4629899?showArticleInContext=doi:10.1002%2Fijc.25451&utm_source=api_716",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 13016
                  }
                }
              },
              "problematicJournalArticleNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451.problematic"
            },
            "included": [
              {
                "id": 13016,
                "type": "journals",
                "title": "International Journal of Cancer",
                "issn": "00207136",
                "sjrValue": 2.259,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/0020-7136.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/13016?utm_source=api_716"
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1002%2Fijc.25451/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.showFormatChoice;
      });

      it("should have an enhanced browse article showing problematic journal article notice only", function() {
        var template = documentSummary.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("Problematic Journal More Info");
        expect(template.text().trim()).not.toContain("Article Page");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/13016/issues/4629899?showArticleInContext=doi:10.1002%2Fijc.25451&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451.problematic");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
      });

      it("should have an enhanced browzine journal cover", function() {
        var coverImage = documentSummary.find(".coverImage img");
        expect(coverImage).toBeDefined();
        expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0020-7136.png");
      });

      it("should open a new window when a problematic journal article notice link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451.problematic", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        documentSummary.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/13016/issues/4629899?showArticleInContext=doi:10.1002%2Fijc.25451&utm_source=api_716", "_blank");
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

        expect(template.text().trim()).toContain("View in Context Browse Journal");
        expect(template.text().trim()).toContain("View Now Article Page");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
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

        expect(template.text().trim()).toContain("View in Context Browse Journal");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
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
        browzine.enableLinkOptimizer = false;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'><div class='availabilityContent'><div class='availabilityFullText'><span class='contentType'>Journal Article </span><a class='summonBtn' display-text='::i18n.translations.PDF'><span class='displayText'>PDF</span></a><span><a class='summonBtn'>Full Text Online</a></span></div></div></div></div></div>");

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
        delete browzine.enableLinkOptimizer;
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

      it("should not remove basic pdf link when link optimizer is disabled", function(done) {
        requestAnimationFrame(function() {
          var template = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(template.length).toEqual(1);

          done();
        });
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

    describe("search results article with browzine results, no pdf url, and unpaywall not usable >", function() {
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

        jasmine.Ajax.requests.at(0).respondWith({
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
              "fullTextFile": "",
              "unpaywallUsable": false
            },
            "included": [{
              "id": 18126,
              "type": "journals",
              "title": "theBMJ",
              "issn": "09598138",
              "sjrValue": 2.567,
              "coverImageUrl": "https://assets.thirdiron.com/images/covers/0959-8138.png",
              "browzineEnabled": false,
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

      it("should call unpaywall and not enhance the article with an unpaywall article pdf", function() {
        expect(jasmine.Ajax.requests.count()).toBe(1);
        var template = documentSummary.find(".browzine");
        expect(template).toBeDefined();
        expect(template.text().trim()).not.toContain("View Now (via Unpaywall) PDF");
      });
    });

    describe("search results article with browzine results, no pdf url, and unpaywall usable >", function() {
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

        jasmine.Ajax.requests.at(0).respondWith({
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
              "fullTextFile": "",
              "unpaywallUsable": true
            },
            "included": [{
              "id": 18126,
              "type": "journals",
              "title": "theBMJ",
              "issn": "09598138",
              "sjrValue": 2.567,
              "coverImageUrl": "https://assets.thirdiron.com/images/covers/0959-8138.png",
              "browzineEnabled": false,
              "browzineWebLink": "https://develop.browzine.com/libraries/XXX/journals/18126"
            }]
          })
        });
        jasmine.Ajax.requests.at(1).respondWith(
          {
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
          }
        );
      });

      afterEach(function() {
        delete browzine.unpaywallEmailAddressKey;
        delete browzine.articlePDFDownloadViaUnpaywallEnabled;
        delete browzine.articleLinkViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;

        jasmine.Ajax.uninstall();
      });

      it("should call unpaywall and enhance the article with an unpaywall article pdf", function() {
        expect(jasmine.Ajax.requests.count()).toBe(2);
        var template = documentSummary.find(".browzine");
        expect(template).toBeDefined();
        expect(template.text().trim()).toContain("View Now (via Unpaywall) PDF");
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) PDF");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) Article Page");
          expect(template.find("a.unpaywall-article-link").attr("href")).toEqual("https://doi.org/10.1098/rstb.1986.0056");
          expect(template.find("a.unpaywall-article-link").attr("target")).toEqual("_blank");
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

          expect(template.text().trim()).toContain("View Now (Accepted Manuscript via Unpaywall) PDF");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) Article Page");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("target")).toEqual("_blank");
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) PDF");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
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

          expect(template.text().trim()).toContain("View Now (Accepted Manuscript via Unpaywall) PDF");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("https://google.com/pmc/articles/PMC1386933/pdf");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) PDF");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) Article Page");
          expect(template.find("a.unpaywall-article-link").attr("href")).toEqual("https://doi.org/10.1098/rstb.1986.0056");
          expect(template.find("a.unpaywall-article-link").attr("target")).toEqual("_blank");
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

          expect(template.text().trim()).toContain("View Now (Accepted Manuscript via Unpaywall) PDF");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) Article Page");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("target")).toEqual("_blank");
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) PDF");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
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

        expect(template.text().trim()).toContain("View Now PDF");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/articles/379795373/full-text-file");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("svg.browzine-pdf-icon")).toBeDefined();
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

    describe("search results article extra links and both browzine web link and direct to pdf link content links disabled >", function() {
      beforeEach(function() {
        summon = browzine.summon;
        browzine.showLinkResolverLink = false;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'><div class='availabilityContent'><div class='availabilityFullText'><span class='contentType'>Journal Article </span><a class='summonBtn' display-text='::i18n.translations.PDF'><span class='displayText'>PDF</span></a><span><a class='summonBtn'>Full Text Online</a></span></div></div></div></div></div>");

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
        delete browzine.showLinkResolverLink;
        jasmine.Ajax.uninstall();
      });

      it("should not show the content link option", function() {
        expect(documentSummary).toBeDefined();
        expect(documentSummary.text().trim()).toContain("View Now PDF");
        expect(documentSummary.text().trim()).not.toContain("Full Text Online");
      });
    });

    describe("search results article extra links and both browzine web link and direct to pdf link >", function() {
      beforeEach(function() {
        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'><div class='availabilityContent'><div class='availabilityFullText'><span class='contentType'>Journal Article </span><a class='summonBtn' display-text='::i18n.translations.PDF'><span class='displayText'>PDF</span></a><span><a class='summonBtn'>Full Text Online</a></span></div></div></div></div></div>");

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

      it("should show the content link option by default", function() {
        expect(documentSummary).toBeDefined();
        expect(documentSummary.text().trim()).toContain("View Now PDF");
        expect(documentSummary.text().trim()).toContain("Full Text Online");
      });

      it("should not show the quick link option by default", function() {
        expect(documentSummary).toBeDefined();
        expect(documentSummary.text().trim()).toContain("View Now PDF");

        var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
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

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'><div class='availabilityContent'><div class='availabilityFullText'><span class='contentType'>Journal Article </span><a class='summonBtn' display-text='::i18n.translations.PDF'><span class='displayText'>PDF</span></a><span><a class='summonBtn'>Full Text Online</a></span></div></div></div></div></div>");

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
        it("should enhance the article with an unpaywall article pdf and enable libkey link optimizer", function() {
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) PDF");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(0);
        });

        it("should not show an unpaywall article pdf when articlePDFDownloadViaUnpaywallEnabled is false and disable libkey link optimizer", function() {
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

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(1);
        });
      });

      describe("unpaywall best open access location host type publisher and version publishedVersion and does not have a pdf url >", function() {
        it("should enhance the article with an unpaywall article link and enable libkey link optimizer", function() {
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) Article Page");
          expect(template.find("a.unpaywall-article-link").attr("href")).toEqual("https://doi.org/10.1098/rstb.1986.0056");
          expect(template.find("a.unpaywall-article-link").attr("target")).toEqual("_blank");

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(0);
        });

        it("should not show an unpaywall article link when articleLinkViaUnpaywallEnabled is false and disable libkey link optimizer", function() {
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

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(1);
        });
      });

      describe("unpaywall best open access location host type repository and version acceptedVersion and has a pdf url >", function() {
        it("should enhance the article with an unpaywall manuscript article pdf and enable libkey link optimizer", function() {
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

          expect(template.text().trim()).toMatch(/View Now \(Accepted Manuscript via Unpaywall\) PDF/);
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(0);
        });

        it("should not show an unpaywall manuscript article pdf when articleAcceptedManuscriptPDFViaUnpaywallEnabled is false and disable libkey link optimizer", function() {
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

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(1);
        });
      });

      describe("unpaywall best open access location host type repository and version acceptedVersion and does not have a pdf url >", function() {
        it("should enhance the article with an unpaywall manuscript article link and enable libkey link optimizer", function() {
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) Article Page");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
          expect(template.find("a.unpaywall-manuscript-article-link").attr("target")).toEqual("_blank");

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(0);
        });

        it("should not show an unpaywall manuscript article link when articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled is false and disable libkey link optimizer", function() {
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

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(1);
        });
      });

      describe(`unpaywall best open access location host type repository and version null and has a pdf url from nih.gov or europepmc.org >`, function() {
        it("should enhance the article with an unpaywall article pdf and enable libkey link optimizer", function() {
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

          expect(template.text().trim()).toContain("View Now (via Unpaywall) PDF");
          expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf");
          expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(0);
        });
      });

      describe(`unpaywall best open access location host type repository and version null and has a pdf url not from nih.gov or europepmc.org >`, function() {
        it("should enhance the article with an unpaywall manuscript article pdf and enable libkey link optimizer", function() {
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

          expect(template.text().trim()).toContain("View Now (Accepted Manuscript via Unpaywall) PDF");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("https://google.com/pmc/articles/PMC1386933/pdf");
          expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
          expect(template.find("svg.browzine-pdf-icon")).toBeDefined();

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(0);
        });
      });

      describe("unpaywall no best open access location >", function() {
        it("should not enhance the article with an unpaywall link and disable libkey link optimizer", function() {
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

          var quicklink = documentSummary.find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");
          expect(quicklink.length).toEqual(1);
        });
      });
    });

    describe("When an article is suppressed > ", function () {
      beforeEach(function () {
        browzine.unpaywallEmailAddressKey = "info@thirdiron.com";
        browzine.articlePDFDownloadViaUnpaywallEnabled = true;
        browzine.articleLinkViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'><div class='availabilityContent'><div class='availabilityFullText'><span class='contentType'>Journal Article </span><a class='summonBtn' display-text='::i18n.translations.PDF'><span class='displayText'>PDF</span></a><span><a class='summonBtn'>Full Text Online</a></span></div></div></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois: ["10.35684/JLCI.2019.5202"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var thirdIronApiDoiRequest = jasmine.Ajax.requests.mostRecent();

        thirdIronApiDoiRequest.respondWith({
          status: 404,
          response: JSON.stringify({
            "errors": [{
              "status": '404'
            }],
            "meta": {
              "avoidUnpaywall": true
            }
          })
        });
      });

      afterEach(function () {
        delete browzine.unpaywallEmailAddressKey;
        delete browzine.articlePDFDownloadViaUnpaywallEnabled;
        delete browzine.articleLinkViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;

        jasmine.Ajax.uninstall();
      });
      it("Does not call unpaywall when avoidUnpaywall=true", function () {
        //We are expecting to call our TIApi but not Unpaywall, thus we should only see one request in the jasmine ajax request queue
        const thirdIronApiDoiRequestResponse = jasmine.Ajax.requests.mostRecent().response;
        expect(jasmine.Ajax.requests.count()).toBe(1);
        expect(thirdIronApiDoiRequestResponse).toEqual('{"errors":[{"status":"404"}],"meta":{"avoidUnpaywall":true}}');

        const template = documentSummary.find(".browzine");
        expect(template.length).toEqual(0);
        expect(documentSummary.text().trim()).not.toContain("Download PDF (via Unpaywall)");
      });
    });

    describe("When an article has an open access status of false and avoidUnpaywallPublisherLink = true and unpaywall response has a host_type of publisher >", function () {
      beforeEach(function () {
        browzine.unpaywallEmailAddressKey = "info@thirdiron.com";
        browzine.articlePDFDownloadViaUnpaywallEnabled = true;
        browzine.articleLinkViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

        summon = browzine.summon;

        documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'><div class='availabilityContent'><div class='availabilityFullText'><span class='contentType'>Journal Article </span><a class='summonBtn' display-text='::i18n.translations.PDF'><span class='displayText'>PDF</span></a><span><a class='summonBtn'>Full Text Online</a></span></div></div></div></div></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.document = {
            content_type: "Journal Article",
            dois:["10.1163/09744061-bja10082"]
          };

          documentSummary = $compile(documentSummary)($scope);
        });

        jasmine.Ajax.install();

        summon.adapter(documentSummary);

        var thirdIronApiDoiRequest = jasmine.Ajax.requests.mostRecent();

        thirdIronApiDoiRequest.respondWith({
          status: 200,
          response: JSON.stringify({
            "data": {
              "id": 572672990,
              "type": "articles",
              "title": "The Residents of The Comoros and Sustainable Tourism",
              "date": "2023-06-02",
              "authors": "Sarı, Ömer; Meydan Uygur, Selma; Abdourahmane, Ali",
              "inPress": false,
              "abandoned": false,
              "doi": "10.1163/09744061-bja10082",
              "linkResolverOpenUrl": "",
              "pmid": "",
              "openAccess": false,
              "unpaywallUsable": true,
              "fullTextFile": "",
              "contentLocation": "",
              "availableThroughBrowzine": false,
              "startPage": "347",
              "endPage": "376",
              "avoidUnpaywallPublisherLinks": true,
              "relationships": {
                "issue": {
                  "links": {
                    "related": "/public/v1/libraries/1939/issues/539825402"
                  }
                },
                "journal": {
                  "links": {
                    "related": "/public/v1/libraries/1939/journals/314336"
                  }
                }
              },
              "abstract": null,
              "contentLocationDestinationUrl": "",
              "contentLocationRawDestinationUrl": "",
              "fullTextFileDestinationUrl": "",
              "fullTextFileRawDestinationUrl": ""
            },
            "included": [{
              "id": 314336,
              "type": "journals",
              "title": "Africa Review",
              "issn": "09744053",
              "sjrValue": 2.34,
              "coverImageUrl": "",
              "browzineEnabled": true,
              "browzineWebLink": ""
            }]
          })
        });
      });

      afterEach(function () {
        delete browzine.unpaywallEmailAddressKey;
        delete browzine.articlePDFDownloadViaUnpaywallEnabled;
        delete browzine.articleLinkViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;

        jasmine.Ajax.uninstall();
      });
      it("Should call unpaywall, see host_type of publisher, and not enhance the search result", function () {
        var requestToUnpaywall = jasmine.Ajax.requests.mostRecent();
        requestToUnpaywall.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
            "best_oa_location": {
              "endpoint_id": "e32e740fde0998433a4",
              "evidence": "oa repository (via OAI-PMH doi match)",
              "host_type": "publisher",
              "is_best": true,
              "license": "cc0",
              "pmh_id": "oai:diposit.ub.edu:2445/147225",
              "repository_institution": "Universitat de Barcelona - Dipòsit Digital de la Universitat de Barcelona",
              "updated": "2020-02-20T17:30:21.829852",
              "url": "http://some.great.site/article/page",
              "url_for_landing_page": "http://some.great.site/article/page",
              "url_for_pdf": "http://some.great.site/article/page/stuff.pdf",
              "version": "publishedVersion"
            }
          })
        });

        //We are expecting to call our TIApi but not Unpaywall, thus we should only see one request in the jasmine ajax request queue
        const unpaywallApiRequestResponse = jasmine.Ajax.requests.mostRecent().response;
        expect(jasmine.Ajax.requests.count()).toBe(2);
        expect(unpaywallApiRequestResponse).toContain('"host_type":"publisher",');

        const template = documentSummary.find(".browzine");
        expect(template.length).toEqual(0);
        expect(documentSummary.text().trim()).not.toContain("Download PDF (via Unpaywall)");
       });
    });
  });
});
