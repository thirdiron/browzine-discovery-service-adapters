describe("BrowZine Primo Adapter >", function() {
  var primo = {}, searchResult = {};

  $("body").append("<prm-search-result-list><div class='results-container'></div></prm-search-result-list>");

  describe("search results journal >", function() {
    describe("search results journal with cover image, issue link and direct to pdf link >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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
        expect(template.text().trim()).toContain("Download Now");

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

    describe("search results article with a journal issn but no article doi >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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

    describe("search results article with browzine web link and disabled direct to pdf link >", function() {
      beforeEach(function() {
        primo = browzine.primo;
        browzine.articlePDFDownloadLinkEnabled = false;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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
        browzine.printRecordsIntegrationEnabled = false;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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
    });

    describe("search results article not browzineEnabled >", function() {
      beforeEach(function() {
        primo = browzine.primo;

        searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img class='main-img fan-img-1' src=''/><img class='main-img fan-img-2' src=''/><img class='main-img fan-img-3' src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line><div class='layout-align-start-start'></div></prm-search-result-availability-line></div></prm-brief-result-container></div>");

        inject(function ($compile, $rootScope) {
          $scope = $rootScope.$new();

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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

          $scope.$ctrl = {
            parentCtrl: {
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
          };

          searchResult = $compile(searchResult)($scope);
        });

        $scope.$ctrl.parentCtrl.$element = searchResult;

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
  });

  describe("search results without scope data >", function() {
    beforeEach(function() {
      primo = browzine.primo;

      searchResult = $("<div class='list-item-wrapper'><prm-brief-result-container><div class='result-item-image'><prm-search-result-thumbnail-container><img src=''/><img src=''/><img src=''/></prm-search-result-thumbnail-container></div><div class='result-item-text'><prm-search-result-availability-line></prm-search-result-availability-line></div></prm-brief-result-container></div>");

      inject(function ($compile, $rootScope) {
        $scope = $rootScope.$new();

        $scope.$ctrl = {
          parentCtrl: {

          }
        };

        searchResult = $compile(searchResult)($scope);
      });

      $scope.$ctrl.parentCtrl.$element = searchResult;

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
