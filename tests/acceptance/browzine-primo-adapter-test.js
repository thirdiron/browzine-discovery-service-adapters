describe("BrowZine Primo Adapter >", function() {
  var primo = {}, searchResult = {}, $scope = {};

  $("body").append("<prm-search-result-list><div class='results-container'></div></prm-search-result-list>");

  describe("search results journal >", function() {
    describe("search results journal with cover image, issue link and direct to pdf link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["journal"]
                    },

                    addata: {
                      issn: ["0096-6762", "0028-4793"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
            }, {
              "id": 10289,
              "type": "journals",
              "title": "The Boston Medical and Surgical Journal",
              "issn": "00966762",
              "sjrValue": 0,
              "coverImageUrl": "https://assets.thirdiron.com/default-journal-cover.png",
              "browzineEnabled": false,
              "externalLink": "http://za2uf4ps7f.search.serialssolutions.com/?V=1.0&N=100&L=za2uf4ps7f&S=I_M&C=0096-6762"
            }]
          })
        });

        expect(request.url).toMatch(/search\?issns=00966762%2C00284793/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browse journal in browzine option", function() {
        var template = searchResult.find(".browzine");
        expect(template).toBeDefined();
        expect(template.text().trim()).toEqual("View Journal Contents");
        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/10292");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
          });

          done();
        });
      });
    });

    describe("search results journal with configuration flags disabled >", function() {
      beforeEach(function() {
        primo = browzine.primo;
        browzine.journalCoverImagesEnabled = false;
        browzine.journalBrowZineWebLinkTextEnabled = false;
        browzine.printRecordsIntegrationEnabled = false;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["journal"]
                    },

                    addata: {
                      issn: ["0096-6762", "0028-4793"]
                    }
                  },

                  delivery: {
                    deliveryCategory: ["Alma-P"]
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
            }, {
              "id": 10289,
              "type": "journals",
              "title": "The Boston Medical and Surgical Journal",
              "issn": "00966762",
              "sjrValue": 0,
              "coverImageUrl": "https://assets.thirdiron.com/default-journal-cover.png",
              "browzineEnabled": false,
              "externalLink": "http://za2uf4ps7f.search.serialssolutions.com/?V=1.0&N=100&L=za2uf4ps7f&S=I_M&C=0096-6762"
            }]
          })
        });

        expect(request.url).toMatch(/search\?issns=00966762%2C00284793/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.journalCoverImagesEnabled;
        delete browzine.journalBrowZineWebLinkTextEnabled;
        delete browzine.printRecordsIntegrationEnabled;
      });

      it("should not have an browzine web issue link", function() {
        var template = searchResult.find(".browzine-web-link");
        expect(template.length).toEqual(0);
      });

      it("should not have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).not.toContain("https://assets.thirdiron.com/images/covers/0959-8138.png");
          });

          done();
        });
      });

      it("should not enhance a print record when print record integration is disabled", function() {
        var template = searchResult.find(".browzine-web-link");
        expect(template.length).toEqual(0);
      });
    });

    describe("search result with pluralized journal type >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["journals"]
                    },

                    addata: {
                      issn: ["0096-6762", "0028-4793"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
            }, {
              "id": 10289,
              "type": "journals",
              "title": "The Boston Medical and Surgical Journal",
              "issn": "00966762",
              "sjrValue": 0,
              "coverImageUrl": "https://assets.thirdiron.com/default-journal-cover.png",
              "browzineEnabled": false,
              "externalLink": "http://za2uf4ps7f.search.serialssolutions.com/?V=1.0&N=100&L=za2uf4ps7f&S=I_M&C=0096-6762"
            }]
          })
        });

        expect(request.url).toMatch(/search\?issns=00966762%2C00284793/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browse journal in browzine option", function() {
        var template = searchResult.find(".browzine");
        expect(template).toBeDefined();
        expect(template.text().trim()).toEqual("View Journal Contents");
        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/10292");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
          });

          done();
        });
      });
    });
  });

  describe("search results article >", function() {
    describe("search results article with both browzine web link and direct to pdf link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Issue Contents");
        expect(template.text().trim()).toContain("Download PDF");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
          });

          done();
        });
      });

      it("should open a new window when a direct to pdf link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575", "_blank");
      });
    });

    describe("search results article with both browzine web link and retracted article link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1186/s11671-016-1523-5"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

        var request = jasmine.Ajax.requests.mostRecent();
        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
            "data": {
              "id": 59474947,
              "type": "articles",
              "title": "RETRACTED ARTICLE: Flexible Field Emitter for X-ray Generation by Implanting CNTs into Nickel Foil",
              "date": "2016-07-11",
              "authors": "Sun, Bin; Wang, Yan; Ding, Guifu",
              "inPress": false,
              "doi": "10.1186/s11671-016-1523-5",
              "ILLURL": "https://illiad.mines.edu/illiad//illiad.dll?Action=10&Form=30&&rft.genre=article&rft.aulast=Sun&rft.issn=1931-7573&rft.jtitle=Nanoscale%20Research%20Letters&rft.atitle=RETRACTED%20ARTICLE%3A%20Flexible%20Field%20Emitter%20for%20X-ray%20Generation%20by%20Implanting%20CNTs%20into%20Nickel%20Foil&rft.volume=11&rft.issue=1&rft.spage=326&rft.epage=&rft.date=2016-07-11&rfr_id=BrowZine",
              "pmid": "27401089",
              "openAccess": true,
              "fullTextFile": "https://develop.libkey.io/libraries/XXXX/articles/59474947/full-text-file?utm_source=api_716",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/59474947/content-location",
              "availableThroughBrowzine": true,
              "startPage": "326",
              "endPage": "",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/8645/issues/8065238?showArticleInContext=doi:10.1186%2Fs11671-016-1523-5&utm_source=api_716",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 8645
                  }
                }
              },
              "retractionNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1186/s11671-016-1523-5",
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1186/s11671-016-1523-5",
            },
            "included": [
              {
                "id": 8645,
                "type": "journals",
                "title": "Nanoscale Research Letters",
                "issn": "19317573",
                "sjrValue": 0.782,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1931-7573.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/8645?utm_source=api_716"
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1186%2Fs11671-016-1523-5/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browse article in browzine option", function() {
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Issue Contents");
        expect(template.text().trim()).toContain("Retracted Article");
        expect(template.text().trim()).not.toContain("Expression of Concern");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/8645/issues/8065238?showArticleInContext=doi:10.1186%2Fs11671-016-1523-5&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1186/s11671-016-1523-5");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/1931-7573.png");
          });

          done();
        });
      });

      it("should open a new window when a retracted article link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1186/s11671-016-1523-5", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/8645/issues/8065238?showArticleInContext=doi:10.1186%2Fs11671-016-1523-5&utm_source=api_716", "_blank");
      });
    });

    describe("search results article with both browzine web link and eoc article link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["1538-3598"],
                      doi: ["10.1001/jama.298.4.413"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Issue Contents");
        expect(template.text().trim()).toContain("Expression of Concern");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/10278/issues/4699582?showArticleInContext=doi:10.1001%2Fjama.298.4.413&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1001/jama.298.4.413");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/1538-3598.png");
          });

          done();
        });
      });

      it("should open a new window when an eoc article link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1001/jama.298.4.413", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/10278/issues/4699582?showArticleInContext=doi:10.1001%2Fjama.298.4.413&utm_source=api_716", "_blank");
      });
    });

    describe("retraction notice and only an article link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0898929X"],
                      doi: ["10.1162/jocn_a_00867"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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

      it("should show retraction notices when there is only an article link", function () {
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Issue Contents");
        expect(template.text().trim()).toContain("Retracted Article");
        expect(template.text().trim()).not.toContain("Expression of Concern");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/513/journals/32127/issues/7986254?showArticleInContext=doi:10.1162%2Fjocn_a_00867&utm_source=api_572");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://libkey.io/libraries/513/10.1162/jocn_a_00867");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0898-929X.png");
          });

          done();
        });
      });

      it("should open a new window when a retracted article link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://libkey.io/libraries/513/10.1162/jocn_a_00867", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://browzine.com/libraries/513/journals/32127/issues/7986254?showArticleInContext=doi:10.1162%2Fjocn_a_00867&utm_source=api_572", "_blank");
      });
    });

    describe("eoc notice and only an article link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["10837159"],
                      doi: ["10.1634/theoncologist.8-4-307"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Issue Contents");
        expect(template.text().trim()).toContain("Expression of Concern");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/1083-7159.png");
          });

          done();
        });
      });

      it("should open a new window when an eoc article link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/31343/issues/5876785?showArticleInContext=doi:10.1634%2Ftheoncologist.8-4-307&utm_source=api_572", "_blank");
      });
    });

    describe("retraction notice and no pdf link or article link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0898929X"],
                      doi: ["10.1162/jocn_a_00867"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Retracted Article");
        expect(template.text().trim()).not.toContain("Expression of Concern");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://libkey.io/libraries/1466/10.1162/jocn_a_00867");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0898-929X.png");
          });

          done();
        });
      });

      it("should open a new window when a retracted article link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://libkey.io/libraries/1466/10.1162/jocn_a_00867", "_blank");
      });
    });

    describe("eoc notice and no pdf link or article link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["10837159"],
                      doi: ["10.1634/theoncologist.8-4-307"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Expression of Concern");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/1083-7159.png");
          });

          done();
        });
      });

      it("should open a new window when an eoc article link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-article-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1634/theoncologist.8-4-307", "_blank");
      });
    });

    describe("search results article with both retracted article link and article link >", function() {
      beforeEach(function() {
        primo = browzine.primo;
        browzine.showFormatChoice = true;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1186/s11671-016-1523-5"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

        var request = jasmine.Ajax.requests.mostRecent();
        request.respondWith({
          status: 200,
          contentType: "application/json",
          response: JSON.stringify({
            "data": {
              "id": 59474947,
              "type": "articles",
              "title": "RETRACTED ARTICLE: Flexible Field Emitter for X-ray Generation by Implanting CNTs into Nickel Foil",
              "date": "2016-07-11",
              "authors": "Sun, Bin; Wang, Yan; Ding, Guifu",
              "inPress": false,
              "doi": "10.1186/s11671-016-1523-5",
              "ILLURL": "https://illiad.mines.edu/illiad//illiad.dll?Action=10&Form=30&&rft.genre=article&rft.aulast=Sun&rft.issn=1931-7573&rft.jtitle=Nanoscale%20Research%20Letters&rft.atitle=RETRACTED%20ARTICLE%3A%20Flexible%20Field%20Emitter%20for%20X-ray%20Generation%20by%20Implanting%20CNTs%20into%20Nickel%20Foil&rft.volume=11&rft.issue=1&rft.spage=326&rft.epage=&rft.date=2016-07-11&rfr_id=BrowZine",
              "pmid": "27401089",
              "openAccess": true,
              "fullTextFile": "https://develop.libkey.io/libraries/XXXX/articles/59474947/full-text-file?utm_source=api_716",
              "contentLocation": "https://develop.libkey.io/libraries/XXXX/articles/59474947/content-location",
              "availableThroughBrowzine": true,
              "startPage": "326",
              "endPage": "",
              "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/8645/issues/8065238?showArticleInContext=doi:10.1186%2Fs11671-016-1523-5&utm_source=api_716",
              "relationships": {
                "journal": {
                  "data": {
                    "type": "journals",
                    "id": 8645
                  }
                }
              },
              "retractionNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1186/s11671-016-1523-5",
              "expressionOfConcernNoticeUrl": "https://develop.libkey.io/libraries/XXXX/10.1186/s11671-016-1523-5",
            },
            "included": [
              {
                "id": 8645,
                "type": "journals",
                "title": "Nanoscale Research Letters",
                "issn": "19317573",
                "sjrValue": 0.782,
                "coverImageUrl": "https://assets.thirdiron.com/images/covers/1931-7573.png",
                "browzineEnabled": true,
                "browzineWebLink": "https://develop.browzine.com/libraries/XXXX/journals/8645?utm_source=api_716"
              }
            ]
          })
        });

        expect(request.url).toMatch(/articles\/doi\/10.1186%2Fs11671-016-1523-5/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
        delete browzine.showFormatChoice;
      });

      it("should have an enhanced browse article showing retraction watch only", function() {
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Issue Contents");
        expect(template.text().trim()).toContain("Retracted Article");
        expect(template.text().trim()).not.toContain("Expression of Concern");
        expect(template.text().trim()).not.toContain("Read Article");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/8645/issues/8065238?showArticleInContext=doi:10.1186%2Fs11671-016-1523-5&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1186/s11671-016-1523-5");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/1931-7573.png");
          });

          done();
        });
      });

      it("should open a new window when a retracted article link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1186/s11671-016-1523-5", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/8645/issues/8065238?showArticleInContext=doi:10.1186%2Fs11671-016-1523-5&utm_source=api_716", "_blank");
      });
    });

    describe("search results article with both eoc article link and article link >", function() {
      beforeEach(function() {
        primo = browzine.primo;
        browzine.showFormatChoice = true;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0020-7136"],
                      doi: ["10.1002/ijc.25451"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Issue Contents");
        expect(template.text().trim()).toContain("Expression of Concern");
        expect(template.text().trim()).not.toContain("Read Article");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXXX/journals/13016/issues/4629899?showArticleInContext=doi:10.1002%2Fijc.25451&utm_source=api_716");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0020-7136.png");
          });

          done();
        });
      });

      it("should open a new window when an eoc article link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/10.1002/ijc.25451", "_blank");
      });

      it("should open a new window when a browzine web link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-web-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXXX/journals/13016/issues/4629899?showArticleInContext=doi:10.1002%2Fijc.25451&utm_source=api_716", "_blank");
      });
    });

    describe("search results article with a journal issn but no article doi >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0096-6762", "0028-4793"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
            }, {
              "id": 10289,
              "type": "journals",
              "title": "The Boston Medical and Surgical Journal",
              "issn": "00966762",
              "sjrValue": 0,
              "coverImageUrl": "https://assets.thirdiron.com/default-journal-cover.png",
              "browzineEnabled": false,
              "externalLink": "http://za2uf4ps7f.search.serialssolutions.com/?V=1.0&N=100&L=za2uf4ps7f&S=I_M&C=0096-6762"
            }]
          })
        });

        expect(request.url).toMatch(/search\?issns=00966762%2C00284793/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
          });

          done();
        });
      });
    });

    describe("search results article with no direct to pdf link and an article link >", function() {
      beforeEach(function() {
        browzine.articleLinkEnabled = true;
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Issue Contents");
        expect(template.text().trim()).toContain("Read Article");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

        expect(template.find("a.browzine-article-link").attr("href")).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408");
        expect(template.find("a.browzine-article-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
          });

          done();
        });
      });
    });

    describe("search results article with an article in context link but no direct to pdf link and no article link >", function() {
      beforeEach(function() {
        browzine.articleLinkEnabled = true;
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).not.toContain("Download PDF");
        expect(template.text().trim()).not.toContain("Read Article");
        expect(template.text().trim()).not.toContain("View Issue Contents");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
          });

          done();
        });
      });
    });

    describe("search results article with browzine web link and disabled direct to pdf link >", function() {
      beforeEach(function() {
        primo = browzine.primo;
        browzine.articlePDFDownloadLinkEnabled = false;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("View Issue Contents");

        expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
        expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
          });

          done();
        });
      });
    });

    describe("search results article with configuration flags disabled >", function() {
      beforeEach(function() {
        primo = browzine.primo;
        browzine.journalCoverImagesEnabled = false;
        browzine.articleBrowZineWebLinkTextEnabled = false;
        browzine.articlePDFDownloadLinkEnabled = false;
        browzine.enableLinkOptimizer = false;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-quick-link><a target='_blank'><span>PDF</span></a></prm-quick-link><prm-search-result-availability-line><div class='layout-align-start-start'><div class='layout-row'><span class='availability-status'>Available Online</span></div></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  },

                  delivery: {
                    deliveryCategory: ["Alma-P"]
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine-direct-to-pdf-link");
        expect(template.length).toEqual(0);
      });

      it("should not have an article in browzine context web link", function() {
        var template = searchResult.find(".browzine-web-link");
        expect(template.length).toEqual(0);
      });

      it("should not have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).not.toContain("https://assets.thirdiron.com/images/covers/0959-8138.png");
          });

          done();
        });
      });

      it("should not enhance a print record when print record integration is disabled", function() {
        var template = searchResult.find(".browzine-web-link");
        expect(template.length).toEqual(0);
      });

      it("should not remove basic pdf link when link optimizer is disabled", function(done) {
        requestAnimationFrame(function() {
          var template = searchResult.find("prm-quick-link");
          expect(template.length).toEqual(1);

          done();
        });
      });
    });

    describe("search results article not browzineEnabled >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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

        expect(request.url).toMatch(/articles\/doi\/10.1136%2Fbmj.h2575/);
        expect(request.method).toBe('GET');
      });

      afterEach(function() {
        jasmine.Ajax.uninstall();
      });

      it("should not have an enhanced browse article in browzine link in search result", function() {
        var template = searchResult.find(".browzine .browzine-web-link");
        expect(template.text().trim()).toEqual("");
      });

      it("should not have an enhanced direct to pdf link in search result", function() {
        var template = searchResult.find(".browzine .browzine-direct-to-pdf-link");
        expect(template.text().trim()).toEqual("");
      });
    });

    describe("search results article with no doi and journal not browzineEnabled >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["1543687X"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine .browzine-web-link");
        expect(template.text().trim()).toEqual("");
      });

      it("should not have an enhanced direct to pdf link in search result", function() {
        var template = searchResult.find(".browzine .browzine-direct-to-pdf-link");
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

        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Download PDF (via Unpaywall)");
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

          var template = searchResult.find(".browzine");

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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Read Article (via Unpaywall)");
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

          var template = searchResult.find(".browzine");

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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Download PDF (Accepted Manuscript via Unpaywall)");
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

          var template = searchResult.find(".browzine");

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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Read Article (Accepted Manuscript via Unpaywall)");
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

          var template = searchResult.find(".browzine");

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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Download PDF (via Unpaywall)");
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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Download PDF (Accepted Manuscript via Unpaywall)");
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

          var template = searchResult.find(".browzine");

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

        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
              "availableThroughBrowzine": false,
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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Download PDF (via Unpaywall)");
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

          var template = searchResult.find(".browzine");

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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Read Article (via Unpaywall)");
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

          var template = searchResult.find(".browzine");

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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Download PDF (Accepted Manuscript via Unpaywall)");
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

          var template = searchResult.find(".browzine");

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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Read Article (Accepted Manuscript via Unpaywall)");
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

          var template = searchResult.find(".browzine");

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

          var template = searchResult.find(".browzine");

          expect(template).toBeDefined();

          expect(template.text().trim()).toContain("Download PDF (via Unpaywall)");
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

          var template = searchResult.find(".browzine");

          expect(template.length).toEqual(0);
        });
      });
    });

    describe("search results article with browzine results, no pdf url, and unpaywall not usable >", function() {
      beforeEach(function() {
        browzine.unpaywallEmailAddressKey = "info@thirdiron.com";
        browzine.articlePDFDownloadViaUnpaywallEnabled = true;
        browzine.articleLinkViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
              "availableThroughBrowzine": false,
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

      it("should not call unpaywall and not add a Download PDF link", function() {
        expect(jasmine.Ajax.requests.count()).toBe(1);
        var template = searchResult.find(".browzine");
        expect(template).toBeDefined();
        expect(searchResult.text().trim()).not.toContain("Download PDF (via Unpaywall)");
      });
    });

    describe("search results article with browzine results, no pdf url, and unpaywall usable >", function() {
      beforeEach(function() {
        browzine.unpaywallEmailAddressKey = "info@thirdiron.com";
        browzine.articlePDFDownloadViaUnpaywallEnabled = true;
        browzine.articleLinkViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
        browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
              "availableThroughBrowzine": false,
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
        jasmine.Ajax.requests.at(1).respondWith({
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
      });

      afterEach(function() {
        delete browzine.unpaywallEmailAddressKey;
        delete browzine.articlePDFDownloadViaUnpaywallEnabled;
        delete browzine.articleLinkViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled;
        delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;

        jasmine.Ajax.uninstall();
      });

      it("should call unpaywall and add a Download PDF link", function() {
        expect(jasmine.Ajax.requests.count()).toBe(2);
        var template = searchResult.find(".browzine");
        expect(template).toBeDefined();
        expect(searchResult.text().trim()).toContain("Download PDF (via Unpaywall)");
      });
    });

    describe("search results open access article with a direct to pdf link and journal not browzineEnabled >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["21582440"],
                      doi: ["10.1177/2158244020915900"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Download PDF");

        expect(template.find("a.browzine-direct-to-pdf-link").attr("href")).toEqual("https://develop.libkey.io/libraries/XXXX/articles/379795373/full-text-file");
        expect(template.find("a.browzine-direct-to-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
      });

      it("should have an enhanced browzine journal cover", function(done) {
        requestAnimationFrame(function() {
          var coverImages = searchResult.find("prm-search-result-thumbnail-container img");
          expect(coverImages).toBeDefined();

          Array.prototype.forEach.call(coverImages, function(coverImage) {
            expect(coverImage.src).toEqual("https://assets.thirdiron.com/images/covers/2158-2440.png");
          });

          done();
        });
      });

      it("should open a new window when a direct to pdf link is clicked", function() {
        spyOn(window, "open");
        searchResult.find(".browzine .browzine-direct-to-pdf-link").click();
        expect(window.open).toHaveBeenCalledWith("https://develop.libkey.io/libraries/XXXX/articles/379795373/full-text-file", "_blank");
      });
    });

    describe("search results article extra links and both browzine web link and direct to pdf link content links disabled >", function() {
      beforeEach(function() {
        primo = browzine.primo;
        browzine.showLinkResolverLink = false;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-quick-link><a target='_blank'><span>PDF</span></a></prm-quick-link><prm-search-result-availability-line><div class='layout-align-start-start'><div class='layout-row'><span class='availability-status'>Available Online</span></div></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        expect(searchResult).toBeDefined();
        expect(searchResult.text().trim()).toContain("Download PDF");
        expect(searchResult.text().trim()).not.toContain("Available Online");
      });
    });

    describe("search results article extra links and both browzine web link and direct to pdf link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-quick-link><a target='_blank'><span>PDF</span></a></prm-quick-link><prm-search-result-availability-line><div class='layout-align-start-start'><div class='layout-row'><span class='availability-status'>Available Online</span></div></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope = {
            $parent: {
              $ctrl: {
                result: {
                  pnx: {
                    display: {
                      type: ["article"]
                    },

                    addata: {
                      issn: ["0028-4793"],
                      doi: ["10.1136/bmj.h2575"]
                    }
                  }
                }
              }
            }
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$parent.$ctrl.$element = searchResult;

        jasmine.Ajax.install();

        primo.searchResult($scope);

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
        expect(searchResult).toBeDefined();
        expect(searchResult.text().trim()).toContain("Download PDF");
        expect(searchResult.text().trim()).toContain("Available Online");
      });

      it("should not show the quick link option by default", function() {
        expect(searchResult).toBeDefined();
        expect(searchResult.text().trim()).toContain("Download PDF");

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(0);
      });
    });
  });

  describe("search results article with extra links and with no browzine results that calls unpaywall >", function() {
    beforeEach(function() {
      browzine.unpaywallEmailAddressKey = "info@thirdiron.com";
      browzine.articlePDFDownloadViaUnpaywallEnabled = true;
      browzine.articleLinkViaUnpaywallEnabled = true;
      browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

      primo = browzine.primo;

      searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-quick-link><a target='_blank'><span>PDF</span></a></prm-quick-link><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

      inject(function ($compile, $rootScope) {
        $scope = $rootScope.$new();

        $scope = {
          $parent: {
            $ctrl: {
              result: {
                pnx: {
                  display: {
                    type: ["article"]
                  },

                  addata: {
                    issn: ["0028-4793"],
                    doi: ["10.1136/bmj.h2575"]
                  }
                }
              }
            }
          }
        };

        searchResult = $compile(searchResult)($scope);
      });

      $scope.$parent.$ctrl.$element = searchResult;

      jasmine.Ajax.install();

      primo.searchResult($scope);

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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Download PDF (via Unpaywall)");
        expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
        expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(0);
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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toEqual("");
        expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual(undefined);
        expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual(undefined);
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual(undefined);

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(1);
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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Read Article (via Unpaywall)");
        expect(template.find("a.unpaywall-article-link").attr("href")).toEqual("https://doi.org/10.1098/rstb.1986.0056");
        expect(template.find("a.unpaywall-article-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(0);
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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toEqual("");
        expect(template.find("a.unpaywall-article-link").attr("href")).toEqual(undefined);
        expect(template.find("a.unpaywall-article-link").attr("target")).toEqual(undefined);
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual(undefined);

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(1);
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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Download PDF (Accepted Manuscript via Unpaywall)");
        expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
        expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(0);
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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toEqual("");
        expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual(undefined);
        expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual(undefined);
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual(undefined);

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(1);
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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Read Article (Accepted Manuscript via Unpaywall)");
        expect(template.find("a.unpaywall-manuscript-article-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
        expect(template.find("a.unpaywall-manuscript-article-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(0);
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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toEqual("");
        expect(template.find("a.unpaywall-manuscript-article-link").attr("href")).toEqual(undefined);
        expect(template.find("a.unpaywall-manuscript-article-link").attr("target")).toEqual(undefined);
        expect(template.find("img.browzine-article-link-icon").attr("src")).toEqual(undefined);

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(1);
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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Download PDF (via Unpaywall)");
        expect(template.find("a.unpaywall-article-pdf-link").attr("href")).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1386933/pdf");
        expect(template.find("a.unpaywall-article-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(0);
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

        var template = searchResult.find(".browzine");

        expect(template).toBeDefined();

        expect(template.text().trim()).toContain("Download PDF (Accepted Manuscript via Unpaywall)");
        expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("href")).toEqual("https://google.com/pmc/articles/PMC1386933/pdf");
        expect(template.find("a.unpaywall-manuscript-article-pdf-link").attr("target")).toEqual("_blank");
        expect(template.find("img.browzine-pdf-icon").attr("src")).toEqual("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(0);
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

        var template = searchResult.find(".browzine");

        expect(template.length).toEqual(0);

        var quickLink = searchResult.find("prm-quick-link");
        expect(quickLink.length).toEqual(1);
      });
    });
  });

  describe("When an article is suppressed > ", function () {

    beforeEach(function() {
      browzine.unpaywallEmailAddressKey = "info@thirdiron.com";
      browzine.articlePDFDownloadViaUnpaywallEnabled = true;
      browzine.articleLinkViaUnpaywallEnabled = true;
      browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

      primo = browzine.primo;

      searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

      inject(function ($compile, $rootScope) {
        $scope = $rootScope.$new();

        $scope = {
          $parent: {
            $ctrl: {
              result: {
                pnx: {
                  display: {
                    type: ["article"]
                  },

                  addata: {
                    issn: ["0028-4793"],//let's make these two unique
                    doi: ["10.35684/JLCI.2019.5202"]
                  }
                }
              }
            }
          }
        };

        searchResult = $compile(searchResult)($scope);
      });

      $scope.$parent.$ctrl.$element = searchResult;

      jasmine.Ajax.install();

      primo.searchResult($scope);

      var thirdIronApiDoiRequest = jasmine.Ajax.requests.mostRecent();

      thirdIronApiDoiRequest.respondWith({
        status: 404,
        response: JSON.stringify({
          "unpaywallUsable": false
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

    it('does not call unpaywall when unpaywallUsable=false', function () {
      //We are expecting to call our TIApi but not Unpaywall, thus we should only see one request in the jasmine ajax request queue
      const thirdIronApiDoiRequestUrl = jasmine.Ajax.requests.mostRecent().url;
      const thirdIronApiDoiRequestResponse = jasmine.Ajax.requests.mostRecent().response
      expect(jasmine.Ajax.requests.count()).toBe(1);
      expect(thirdIronApiDoiRequestUrl).toContain("include_suppressed=true");
      expect(thirdIronApiDoiRequestResponse).toEqual('{"unpaywallUsable":false}');

      const template = searchResult.find(".browzine");
      expect(template.length).toEqual(0);
      expect(searchResult.text().trim()).not.toContain("Download PDF (via Unpaywall)");

    });
  })

  describe("search results without scope data >", function() {
    beforeEach(function() {
      primo = browzine.primo;

      searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img src=''/><img src=''/><img src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line></prm-search-result-availability-line></div></prm-brief-result-container></div>");

      inject(function ($compile, $rootScope) {
        $scope = $rootScope.$new();

        $scope = {
          $parent: {
            $ctrl: {

            }
          }
        };

        searchResult = $compile(searchResult)($scope);
      });

      $scope.$parent.$ctrl.$element = searchResult;

      jasmine.Ajax.install();

      primo.searchResult($scope);

      var request = jasmine.Ajax.requests.mostRecent();
      expect(request).toBeUndefined();
    });

    afterEach(function() {
      jasmine.Ajax.uninstall();
    });

    it("should not enhance a search result without scope data", function() {
      var template = searchResult.find(".browzine");
      expect(template.length).toEqual(0);
      expect(template[0]).toBeUndefined();
    });
  });
});
