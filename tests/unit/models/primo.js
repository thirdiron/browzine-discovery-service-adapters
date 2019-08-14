describe("Primo Model >", function() {
  var primo = {}, journalResponse = {}, articleResponse = {};

  beforeEach(function() {
    primo = browzine.primo;

    journalResponse = {
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
    };

    articleResponse = {
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
    };
  });

  afterEach(function() {

  });

  it("primo model should exist", function() {
    expect(primo).toBeDefined();
  });

  describe("primo model getScope method >", function() {
    it("should retrieve the scope from a search result", function() {
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

      var scope = primo.getScope($scope);

      expect(scope).toBeDefined();
      expect(scope.result).toBeDefined();
      expect(scope.result.pnx).toBeDefined();
      expect(scope.result.pnx.display).toBeDefined();
      expect(scope.result.pnx.display.type).toBeDefined();
      expect(scope.result.pnx.addata).toBeDefined();
      expect(scope.result.pnx.addata.issn).toBeDefined();

      expect(scope.result.pnx.display.type[0]).toEqual("journal");
      expect(scope.result.pnx.addata.issn[0]).toEqual("0096-6762");
      expect(scope.result.pnx.addata.issn[1]).toEqual("0028-4793");
    });
  });

  describe("primo model getResult method >", function() {
    it("should include a result object from prmSearchResultAvailabilityLineAfterController $scope", function() {
      var scope = {
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
      };

      var result = primo.getResult(scope);
      expect(result).toBeDefined();
    });

    it("should include a result object from prmSearchResultThumbnailContainerAfterController $scope", function() {
      var scope = {
        item: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              issn: ["0096-6762", "0028-4793"]
            }
          }
        }
      };

      var result = primo.getResult(scope);
      expect(result).toBeDefined();
    });
  });

  describe("primo model urlRewrite method >", function() {
    it("should rewrite the public api domain", function() {
      var url = "https://api.thirdiron.com/public/v1/libraries/XXX";
      expect(primo.urlRewrite(url)).toEqual("https://public-api.thirdiron.com/public/v1/libraries/XXX");
    });

    it("should not rewrite the public api domain when the public-api domain already exists", function() {
      var url = "https://public-api.thirdiron.com/public/v1/libraries/XXX";
      expect(primo.urlRewrite(url)).toEqual("https://public-api.thirdiron.com/public/v1/libraries/XXX");
    });
  });

  describe("primo model libraryIdOverride method >", function() {
    beforeEach(function() {
      browzine.libraryId = 123;
      delete browzine.api;
    });

    afterEach(function() {
      delete browzine.libraryId;
      browzine.api = "https://public-api.thirdiron.com/public/v1/libraries/XXX";
    });

    it("should override the libraryId on the api endpoint when specified", function() {
      expect(primo.libraryIdOverride(primo.urlRewrite(browzine.api))).toEqual("https://public-api.thirdiron.com/public/v1/libraries/123");
    });

    it("should override the libraryId on the api endpoint even when an api endpoint is specified", function() {
      browzine.api = "https://public-api.thirdiron.com/public/v1/libraries/XXX";
      expect(primo.libraryIdOverride(primo.urlRewrite(browzine.api))).toEqual("https://public-api.thirdiron.com/public/v1/libraries/123");
    });

    it("should return the customer supplied api endpoint when a libraryId is not specified", function() {
      delete browzine.libraryId;
      browzine.api = "https://public-api.thirdiron.com/public/v1/libraries/XXX";

      expect(primo.libraryIdOverride(primo.urlRewrite(browzine.api))).toEqual("https://public-api.thirdiron.com/public/v1/libraries/XXX");
    });
  });

  describe("primo model shouldEnhance method >", function() {
    it("should not enhance a search result without scope data", function() {
      var scope = {};

      expect(primo.shouldEnhance(scope)).toEqual(false);
    });

    it("should enhance a journal search result with an issn", function() {
      var scope = {
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
      };

      expect(primo.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance a journal search result with an eissn, but no issn", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              eissn: ["0096-6762"]
            }
          }
        }
      };

      expect(primo.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance a journal search result with both an issn and an eissn", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              issn: ["0028-4793"],
              eissn: ["0096-6762"]
            }
          }
        }
      };

      expect(primo.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance a journal search result with an uppercase content type", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["Journal"]
            },

            addata: {
              issn: ["0096-6762", "0028-4793"]
            }
          }
        }
      };

      expect(primo.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance an article search result with a doi", function() {
      var scope = {
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
      };

      expect(primo.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance an article search result with an uppercase content type", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["Article"]
            },

            addata: {
              issn: ["0028-4793"],
              doi: ["10.1136/bmj.h2575"]
            }
          }
        }
      };

      expect(primo.shouldEnhance(scope)).toEqual(true);
    });

    it("should not enhance a journal search result without an issn or eissn", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              issn: []
            }
          }
        }
      };

      expect(primo.shouldEnhance(scope)).toEqual(false);
    });

    it("should not enhance an article search result without a doi", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["article"]
            },

            addata: {
              issn: ["0028-4793"],
              doi: []
            }
          }
        }
      };

      expect(primo.shouldEnhance(scope)).toEqual(false);
    });

    it("should not enhance a journal search result without a content type", function() {
      var scope = {
        result: {
          pnx: {
            display: {
            },

            addata: {
              issn: ["0096-6762", "0028-4793"]
            }
          }
        }
      };

      expect(primo.shouldEnhance(scope)).toEqual(false);
    });

    it("should not enhance an article search result without a content type", function() {
      var scope = {
        result: {
          pnx: {
            display: {
            },

            addata: {
              issn: ["0028-4793"],
              doi: ["10.1136/bmj.h2575"]
            }
          }
        }
      };

      expect(primo.shouldEnhance(scope)).toEqual(false);
    });
  });

  describe("primo model getIssn method >", function() {
    it("should retrieve an issn from a journal search result with an issn", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              issn: ["0028-4793"]
            }
          }
        }
      };

      expect(primo.getIssn(scope)).toEqual("00284793");
    });

    it("should retrieve an eissn from a journal search result with an eissn", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              eissn: ["0096-6762"]
            }
          }
        }
      };

      expect(primo.getIssn(scope)).toEqual("00966762");
    });

    it("should retrieve an issn from a journal search result with both an issn and an eissn", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              issn: ["0028-4793"],
              eissn: ["0096-6762"]
            }
          }
        }
      };

      expect(primo.getIssn(scope)).toEqual("00284793");
    });
  });

  describe("primo model getDoi method >", function() {
    it("should retrieve a doi from an article search result with a doi", function() {
      var scope = {
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
      };

      expect(primo.getDoi(scope)).toEqual(encodeURIComponent("10.1136/bmj.h2575"));
    });

    it("should retrieve an empty string from an article search result without a doi", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["article"]
            },

            addata: {
              issn: ["0028-4793"],
              doi: []
            }
          }
        }
      };

      expect(primo.getDoi(scope)).toEqual("");
    });
  });

  describe("primo model getEndpoint method >", function() {
    it("should build a journal endpoint for a journal search result", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              issn: ["0028-4793"]
            }
          }
        }
      };

      expect(primo.getEndpoint(scope)).toContain("search?issns=00284793");
    });

    it("should build a multiple journal endpoint for a journal search result with more than one issn", function() {
      var scope = {
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
      };

      expect(primo.getEndpoint(scope)).toContain("search?issns=00966762%2C00284793");
    });

    it("should select the eissn when the journal search result has no issn", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              issn: [],
              eissn: ["0096-6762"]
            }
          }
        }
      };

      expect(primo.getEndpoint(scope)).toContain("search?issns=00966762");
    });

    it("should build an article endpoint for an article search result", function() {
      var scope = {
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
      };

      expect(primo.getEndpoint(scope)).toContain("articles/doi/10.1136%2Fbmj.h2575");
    });

    it("should build an article endpoint for an article search result and include its journal", function() {
      var scope = {
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
      };

      expect(primo.getEndpoint(scope)).toContain("articles/doi/10.1136%2Fbmj.h2575?include=journal");
    });
  });

  describe("primo model getBrowZineWebLink method >", function() {
    it("should include a browzineWebLink in the BrowZine API response for a journal", function() {
      var data = primo.getData(journalResponse);
      expect(data).toBeDefined();
      expect(primo.getBrowZineWebLink(data)).toEqual("https://browzine.com/libraries/XXX/journals/10292");
    });

    it("should include a browzineWebLink in the BrowZine API response for an article", function() {
      var data = primo.getData(articleResponse);
      expect(data).toBeDefined();
      expect(primo.getBrowZineWebLink(data)).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
    });
  });

  describe("primo model getCoverImageUrl method >", function() {
    it("should include a coverImageUrl in the BrowZine API response for a journal", function() {
      var scope = {
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
      };

      var data = primo.getData(journalResponse);
      var journal = primo.getIncludedJournal(journalResponse);

      expect(data).toBeDefined();
      expect(journal).toBeNull();

      expect(primo.getCoverImageUrl(scope, data, journal)).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
    });

    it("should include a coverImageUrl in the BrowZine API response for an article", function() {
      var scope = {
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
      };

      var data = primo.getData(articleResponse);
      var journal = primo.getIncludedJournal(articleResponse);

      expect(data).toBeDefined();
      expect(journal).toBeDefined();

      expect(primo.getCoverImageUrl(scope, data, journal)).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
    });
  });

  describe("primo model getBrowZineEnabled method >", function() {
    it("should include a browzineEnabled flag in the BrowZine API response for a journal", function() {
      var scope = {
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
      };

      var data = primo.getData(journalResponse);
      var journal = primo.getIncludedJournal(journalResponse);

      expect(primo.getBrowZineEnabled(scope, data, journal)).toEqual(true);
    });
  });

  describe("primo model isDefaultCoverImage method >", function() {
    it("should return false when an actual coverImageUrl is returned by the API", function() {
      var coverImageUrl = "https://assets.thirdiron.com/images/covers/0028-4793.png";
      expect(primo.isDefaultCoverImage(coverImageUrl)).toEqual(false);
    });

    it("should return true when a default coverImageUrl is returned by the API", function() {
      var coverImageUrl = "https://assets.thirdiron.com/images/covers/default.png";
      expect(primo.isDefaultCoverImage(coverImageUrl)).toEqual(true);
    });
  });

  describe("primo model getDirectToPDFUrl method >", function() {
    it("should not return a direct to pdf url for journal search results", function() {
      var scope = {
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
      };

      var data = primo.getData(journalResponse);

      expect(data).toBeDefined();

      expect(primo.getDirectToPDFUrl(scope, data)).toBeNull();
    });

    it("should return a direct to pdf url for article search results", function() {
      var scope = {
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
      };

      var data = primo.getData(articleResponse);

      expect(data).toBeDefined();

      expect(primo.getDirectToPDFUrl(scope, data)).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
    });
  });

  describe("primo model showJournalCoverImages method >", function() {
    beforeEach(function() {
      delete browzine.journalCoverImagesEnabled;
    });

    afterEach(function() {
      delete browzine.journalCoverImagesEnabled;
    });

    it("should show journal cover when configuration property is undefined or null", function() {
      expect(primo.showJournalCoverImages()).toEqual(true);
    });

    it("should show journal cover when configuration property is true", function() {
      browzine.journalCoverImagesEnabled = true;
      expect(primo.showJournalCoverImages()).toEqual(true);
    });

    it("should not journal cover link when configuration property is false", function() {
      browzine.journalCoverImagesEnabled = false;
      expect(primo.showJournalCoverImages()).toEqual(false);
    });
  });

  describe("primo model showJournalBrowZineWebLinkText method >", function() {
    beforeEach(function() {
      delete browzine.journalBrowZineWebLinkTextEnabled;
    });

    afterEach(function() {
      delete browzine.journalBrowZineWebLinkTextEnabled;
    });

    it("should show issue link when configuration property is undefined or null", function() {
      expect(primo.showJournalBrowZineWebLinkText()).toEqual(true);
    });

    it("should show issue link when configuration property is true", function() {
      browzine.journalBrowZineWebLinkTextEnabled = true;
      expect(primo.showJournalBrowZineWebLinkText()).toEqual(true);
    });

    it("should not show issue link when configuration property is false", function() {
      browzine.journalBrowZineWebLinkTextEnabled = false;
      expect(primo.showJournalBrowZineWebLinkText()).toEqual(false);
    });
  });

  describe("primo model showArticleBrowZineWebLinkText method >", function() {
    beforeEach(function() {
      delete browzine.articleBrowZineWebLinkTextEnabled;
    });

    afterEach(function() {
      delete browzine.articleBrowZineWebLinkTextEnabled;
    });

    it("should show article in context link when configuration property is undefined or null", function() {
      expect(primo.showArticleBrowZineWebLinkText()).toEqual(true);
    });

    it("should show article in context link when configuration property is true", function() {
      browzine.articleBrowZineWebLinkTextEnabled = true;
      expect(primo.showArticleBrowZineWebLinkText()).toEqual(true);
    });

    it("should not show article in context link when configuration property is false", function() {
      browzine.articleBrowZineWebLinkTextEnabled = false;
      expect(primo.showArticleBrowZineWebLinkText()).toEqual(false);
    });
  });

  describe("primo model showDirectToPDFLink method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadLinkEnabled;
      delete browzine.primoArticlePDFDownloadLinkEnabled;
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadLinkEnabled;
      delete browzine.primoArticlePDFDownloadLinkEnabled;
    });

    it("should show direct to pdf link when configuration property is undefined or null", function() {
      expect(primo.showDirectToPDFLink()).toEqual(true);
    });

    it("should show direct to pdf link when configuration property is true", function() {
      browzine.articlePDFDownloadLinkEnabled = true;
      expect(primo.showDirectToPDFLink()).toEqual(true);
    });

    it("should hide direct to pdf link when configuration property is false", function() {
      browzine.articlePDFDownloadLinkEnabled = false;
      expect(primo.showDirectToPDFLink()).toEqual(false);
    });

    it("should show direct to pdf link when the platform prefixed configuration property is true", function() {
      browzine.primoArticlePDFDownloadLinkEnabled = true;
      expect(primo.showDirectToPDFLink()).toEqual(true);
    });

    it("should hide direct to pdf link when the platform prefixed configuration property is false", function() {
      browzine.primoArticlePDFDownloadLinkEnabled = false;
      expect(primo.showDirectToPDFLink()).toEqual(false);
    });
  });

  describe("primo model showPrintRecords method >", function() {
    beforeEach(function() {
      delete browzine.printRecordsIntegrationEnabled;
    });

    afterEach(function() {
      delete browzine.printRecordsIntegrationEnabled;
    });

    it("should enhance print records when configuration property is undefined or null", function() {
      expect(primo.showPrintRecords()).toEqual(true);
    });

    it("should enhance print records when configuration property is true", function() {
      browzine.printRecordsIntegrationEnabled = true;
      expect(primo.showPrintRecords()).toEqual(true);
    });

    it("should not enhance print records when configuration property is false", function() {
      browzine.printRecordsIntegrationEnabled = false;
      expect(primo.showPrintRecords()).toEqual(false);
    });
  });

  describe("primo model isFiltered method >", function() {
    beforeEach(function() {
      delete browzine.printRecordsIntegrationEnabled;
    });

    afterEach(function() {
      delete browzine.printRecordsIntegrationEnabled;
    });

    it("should not filter electronic records when print records configuration property is undefined or null", function() {
      var scope = {
        result: {
          delivery: {
            deliveryCategory: ["Alma-E"]
          }
        }
      };

      expect(primo.isFiltered(scope)).toEqual(false);
    });

    it("should not filter electronic records when print records configuration property is true", function() {
      var scope = {
        result: {
          delivery: {
            deliveryCategory: ["Alma-E"]
          }
        }
      };
      browzine.printRecordsIntegrationEnabled = true;
      expect(primo.isFiltered(scope)).toEqual(false);
    });

    it("should not filter electronic records when print records configuration property is false", function() {
      var scope = {
        result: {
          delivery: {
            deliveryCategory: ["Alma-E"]
          }
        }
      };
      browzine.printRecordsIntegrationEnabled = false;
      expect(primo.isFiltered(scope)).toEqual(false);
    });

    it("should not filter print records when print records configuration property is undefined or null", function() {
      var scope = {
        result: {
          delivery: {
            deliveryCategory: ["Alma-P"]
          }
        }
      };

      expect(primo.isFiltered(scope)).toEqual(false);
    });

    it("should not filter print records when print records configuration property is true", function() {
      var scope = {
        result: {
          delivery: {
            deliveryCategory: ["Alma-P"]
          }
        }
      };
      browzine.printRecordsIntegrationEnabled = true;
      expect(primo.isFiltered(scope)).toEqual(false);
    });

    it("should filter print records when print records configuration property is false", function() {
      var scope = {
        result: {
          delivery: {
            deliveryCategory: ["Alma-P"]
          }
        }
      };
      browzine.printRecordsIntegrationEnabled = false;
      expect(primo.isFiltered(scope)).toEqual(true);
    });
  });

  describe("primo model directToPDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadLinkText;
      delete browzine.primoArticlePDFDownloadLinkText;
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadLinkText;
      delete browzine.primoArticlePDFDownloadLinkText;
    });

    it("should build a direct to pdf template for article search results", function() {
      var scope = {
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
      };

      var data = primo.getData(articleResponse);
      var directToPDFUrl = primo.getDirectToPDFUrl(scope, data);
      var template = primo.directToPDFTemplate(directToPDFUrl);

      expect(data).toBeDefined();
      expect(directToPDFUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'><a class='browzine-direct-to-pdf-link' href='https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file' target='_blank'><img alt='BrowZine PDF Icon' src='https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: 2.8px;' aria-hidden='true' width='12' height='16'/> <span class='browzine-web-link-text'>Download Now</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");

      expect(template).toContain("Download Now");
      expect(template).toContain("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
    });

    it("should apply the articlePDFDownloadLinkText config property", function() {
      browzine.articlePDFDownloadLinkText = "Download PDF";

      var scope = {
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
      };

      var data = primo.getData(articleResponse);
      var directToPDFUrl = primo.getDirectToPDFUrl(scope, data);
      var template = primo.directToPDFTemplate(directToPDFUrl);

      expect(template).toContain("Download PDF");
    });

    it("should apply the primoArticlePDFDownloadLinkText config property", function() {
      browzine.primoArticlePDFDownloadLinkText = "Download PDF Now";

      var scope = {
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
      };

      var data = primo.getData(articleResponse);
      var directToPDFUrl = primo.getDirectToPDFUrl(scope, data);
      var template = primo.directToPDFTemplate(directToPDFUrl);

      expect(template).toContain("Download PDF Now");
    });
  });

  describe("primo model browzineWebLinkTemplate method >", function() {
    it("should build an enhancement template for journal search results", function() {
      var scope = {
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
      };

      var data = primo.getData(journalResponse);
      var browzineWebLink = primo.getBrowZineWebLink(data);
      var template = primo.browzineWebLinkTemplate(scope, browzineWebLink);

      expect(data).toBeDefined();
      expect(browzineWebLink).toBeDefined();
      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em;'><a class='browzine-web-link' href='https://browzine.com/libraries/XXX/journals/10292' target='_blank'><img alt='BrowZine Book Icon' src='https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg' class='browzine-book-icon' style='margin-bottom: -2px; margin-right: 2.5px;' aria-hidden='true' width='15' height='15'/> <span class='browzine-web-link-text'>View Journal Contents</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");
      expect(template).toContain("View Journal Contents");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/10292");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
    });

    it("should build an enhancement template for article search results", function() {
      var scope = {
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
      };

      var data = primo.getData(articleResponse);
      var browzineWebLink = primo.getBrowZineWebLink(data);
      var template = primo.browzineWebLinkTemplate(scope, browzineWebLink);

      expect(data).toBeDefined();
      expect(browzineWebLink).toBeDefined();
      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em;'><a class='browzine-web-link' href='https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575' target='_blank'><img alt='BrowZine Book Icon' src='https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg' class='browzine-book-icon' style='margin-bottom: -2px; margin-right: 2.5px;' aria-hidden='true' width='15' height='15'/> <span class='browzine-web-link-text'>View Issue Contents</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");
      expect(template).toContain("View Issue Contents");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
    });
  });
});
