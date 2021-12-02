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
        "fullTextFile": "https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file",
        "contentLocation": "https://develop.browzine.com/libraries/XXX/articles/55134408",
        "retractionNoticeUrl": "https://develop.libkey.io/libraries/1252/10.1155/2019/5730746"
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
      }, {
        "id": 1252,
        "type": "libraries",
        "discoveryServiceBehavior": "onelink"
      }]
    };
  });

  afterEach(function() {

  });

  it("primo model should exist", function() {
    expect(primo).toBeDefined();
  });

  describe("primo model isJournal method >", function() {
    it("should identify a journal with singular journal type", function() {
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

      expect(primo.isJournal(scope)).toEqual(true);
    });

    it("should identify a journal with plural journal type", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journals"]
            },

            addata: {
              issn: ["0028-4793"]
            }
          }
        }
      };

      expect(primo.isJournal(scope)).toEqual(true);
    });

    it("should only identify a journal as a journal type", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["article"]
            },

            addata: {
              issn: ["0028-4793"]
            }
          }
        }
      };

      expect(primo.isJournal(scope)).toEqual(false);
    });
  });

  describe("primo model isArticle method >", function() {
    it("should identify an article with singular article type", function() {
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

      expect(primo.isArticle(scope)).toEqual(true);
    });

    it("should identify an article with plural article type", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["articles"]
            },

            addata: {
              issn: ["0028-4793"],
              doi: ["10.1136/bmj.h2575"]
            }
          }
        }
      };

      expect(primo.isArticle(scope)).toEqual(true);
    });

    it("should only identify an article as a article type", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              issn: ["0028-4793"],
              doi: ["10.1136/bmj.h2575"]
            }
          }
        }
      };

      expect(primo.isArticle(scope)).toEqual(false);
    });
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

    it("should not enhance an article search result without a doi or issn", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["article"]
            },

            addata: {
              issn: [],
              doi: []
            }
          }
        }
      };

      expect(primo.shouldEnhance(scope)).toEqual(false);
    });

    it("should enhance an article search result journal cover with an issn even without a doi", function() {
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

      expect(primo.shouldEnhance(scope)).toEqual(true);
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

    it("should only retrieve issn formats", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["journal"]
            },

            addata: {
              issn: ["Whitman, Mary C., Wen Fan, Lorena Rela, Diego J. Rodriguez-Gil, and Charles A. Greer. 2009. “Blood Vessels Form a Migratory Scaffold in the Rostral Migratory Stream.” The Journal of Comparative Neurology 516 (2) (September 10): 94–104. doi:10.1002/cne.22093.", "0021-9967"]
            }
          }
        }
      };

      expect(primo.getIssn(scope)).toEqual("00219967");
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

    it("should build a journal endpoint for an article search result with a journal issn but no article doi", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["article"]
            },

            addata: {
              issn: ["0028-4793"]
            }
          }
        }
      };

      expect(primo.getEndpoint(scope)).toContain("search?issns=00284793");
    });
  });

  describe("primo model getUnpaywallEndpoint method >", function() {
    afterEach(function() {
      delete browzine.unpaywallEmailAddressKey;
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

      browzine.unpaywallEmailAddressKey = "info@thirdiron.com";

      expect(primo.getUnpaywallEndpoint(scope)).toContain("https://api.unpaywall.org/v2/10.1136%2Fbmj.h2575");
    });

    it("should build an article endpoint for an article search result only when an email address key is provided", function() {
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

      expect(primo.getUnpaywallEndpoint(scope)).toBeUndefined();
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

    it("should include a coverImageUrl in the BrowZine API response for an article with a journal issn but no article doi", function() {
      var scope = {
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
      };

      var data = primo.getData(journalResponse);
      var journal = primo.getIncludedJournal(journalResponse);

      expect(data).toBeDefined();
      expect(journal).toBeNull();

      expect(primo.getCoverImageUrl(scope, data, journal)).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
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

  describe("primo model getData method >", function() {
    it("should return data when the journal is browzineEnabled", function() {
      var data = primo.getData(journalResponse);
      expect(data).toBeDefined();
    });

    it("should not return data when the journal is not browzineEnabled", function() {
      journalResponse.data[0].browzineEnabled = false;
      var data = primo.getData(journalResponse);
      expect(data).toEqual(undefined);
    });

    it("should return data for an article", function() {
      var data = primo.getData(articleResponse);
      expect(data).toBeDefined();
    });
  });

  describe("primo model getData method >", function() {
    it("should return data when the journal is browzineEnabled", function() {
      var data = primo.getData(journalResponse);
      expect(data).toBeDefined();
    });

    it("should not return data when the journal is not browzineEnabled", function() {
      journalResponse.data[0].browzineEnabled = false;
      var data = primo.getData(journalResponse);
      expect(data).toEqual(undefined);
    });

    it("should return data for an article", function() {
      var data = primo.getData(articleResponse);
      expect(data).toBeDefined();
    });
  });

  describe("primo model getIncludedJournal method >", function() {
    it("should return a journal object", function() {
      var journal = primo.getIncludedJournal(articleResponse);

      expect(journal).toBeDefined();
      expect(journal.type).toEqual("journals");
      expect(journal.id).toEqual(18126);
      expect(journal.title).toEqual("theBMJ");
      expect(journal.issn).toEqual("09598138");
    });
  });

  describe("primo model getIncludedLibrary method >", function() {
    it("should return a library object", function() {
      var library = primo.getIncludedLibrary(articleResponse);

      expect(library).toBeDefined();
      expect(library.type).toEqual("libraries");
      expect(library.id).toEqual(1252);
      expect(library.discoveryServiceBehavior).toEqual("onelink");
    });
  });

  describe("primo model getDiscoveryServiceBehavior method >", function() {
    it("should return the discoveryServiceBehavior property", function() {
      var library = primo.getIncludedLibrary(articleResponse);
      var discoveryServiceBehavior = primo.getDiscoveryServiceBehavior(library);

      expect(discoveryServiceBehavior).toEqual("onelink");
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

    it("should not return a direct to pdf url for article search results with no doi and in a journal that is not browzineEnabled", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["article"]
            },

            addata: {
              issn: ["0028-4793"]
            }
          }
        }
      };

      journalResponse.data[0].browzineEnabled = false;
      var data = primo.getData(journalResponse);

      expect(data).toEqual(undefined);

      expect(primo.getDirectToPDFUrl(scope, data)).toEqual(null);
    });
  });

  describe("primo model getArticleLinkUrl method >", function() {
    it("should not return an article link url for journal search results", function() {
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

      expect(primo.getArticleLinkUrl(scope, data)).toBeNull();
    });

    it("should return an article link url for article search results", function() {
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

      expect(primo.getArticleLinkUrl(scope, data)).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408");
    });

    it("should not return an article link url for article search results with no doi and in a journal that is not browzineEnabled", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["article"]
            },

            addata: {
              issn: ["0028-4793"]
            }
          }
        }
      };

      journalResponse.data[0].browzineEnabled = false;
      var data = primo.getData(journalResponse);

      expect(data).toEqual(undefined);

      expect(primo.getArticleLinkUrl(scope, data)).toEqual(null);
    });
  });

  describe("primo model getArticleRetractionUrl method >", function() {
    it("should not return a retraction url for journal search results", function() {
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

      expect(primo.getArticleRetractionUrl(scope, data)).toBeNull();
    });

    it("should return a retraction url for article search results", function() {
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

      expect(primo.getArticleRetractionUrl(scope, data)).toEqual("https://develop.libkey.io/libraries/1252/10.1155/2019/5730746");
    });

    it("should not return a retraction url for article search results with no doi and in a journal that is not browzineEnabled", function() {
      var scope = {
        result: {
          pnx: {
            display: {
              type: ["article"]
            },

            addata: {
              issn: ["0028-4793"]
            }
          }
        }
      };

      journalResponse.data[0].browzineEnabled = false;
      var data = primo.getData(journalResponse);

      expect(data).toEqual(undefined);

      expect(primo.getArticleRetractionUrl(scope, data)).toEqual(null);
    });
  });

  describe("primo model isTrustedRepository method >", function() {
    it("should expect non nih.gov and non europepmc.org repositories to be untrusted", function() {
      var response = {
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
      };

      expect(primo.isTrustedRepository(response)).toEqual(false);
    });

    it("should expect nih.gov repositories to be trusted", function() {
      var response = {
        "best_oa_location": {
          "endpoint_id": null,
          "evidence": "open (via free pdf)",
          "host_type": "repository",
          "is_best": true,
          "license": "cc-by-nc-nd",
          "pmh_id": null,
          "repository_institution": null,
          "updated": "2019-10-11T20:52:04.790279",
          "url": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4890194/",
          "url_for_landing_page": "https://dx.doi.org/10.1016%2Fj.sjbs.2016.02.019",
          "url_for_pdf": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4890194/pdf/main.pdf",
          "version": "acceptedVersion"
        }
      };

      expect(primo.isTrustedRepository(response)).toEqual(true);
    });

    it("should expect europepmc.org repositories to be trusted", function() {
      var response = {
        "best_oa_location": {
          "endpoint_id": null,
          "evidence": "open (via free pdf)",
          "host_type": "repository",
          "is_best": true,
          "license": "cc-by-nc-nd",
          "pmh_id": null,
          "repository_institution": null,
          "updated": "2019-10-11T20:52:04.790279",
          "url": "http://europepmc.org/article/MED/28794876#free-full-text",
          "url_for_landing_page": "http://doi.org/10.1186/s40248-017-0101-8",
          "url_for_pdf": "https://europepmc.org/backend/ptpmcrender.fcgi?accid=PMC5545842&blobtype=pdf",
          "version": "acceptedVersion"
        }
      };

      expect(primo.isTrustedRepository(response)).toEqual(true);
    });
  });

  describe("primo model isUnknownVersion method >", function() {
    it("should expect an empty string version property to validate as an unknown version", function() {
      var response = {
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
          "version": ""
        }
      };

      expect(primo.isUnknownVersion(response)).toEqual(true);
    });

    it("should expect a non-existent version property to validate as an unknown version", function() {
      var response = {
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
          "url_for_pdf": "http://jaha.org.ro/index.php/JAHA/article/download/142/119"
        }
      };

      expect(primo.isUnknownVersion(response)).toEqual(true);
    });

    it("should expect a null version property to validate as an unknown version", function() {
      var response = {
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
          "version": null
        }
      };

      expect(primo.isUnknownVersion(response)).toEqual(true);
    });
  });

  describe("primo model getUnpaywallArticlePDFUrl method >", function() {
    it("should return an unpaywall pdf url for publishedVersion of article hosted by publisher", function() {
      var response = {
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
      };

      expect(primo.getUnpaywallArticlePDFUrl(response)).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
    });

    it("should return an unpaywall pdf url for publishedVersion of article hosted by repository", function() {
      var response = {
        "best_oa_location": {
          "endpoint_id": null,
          "evidence": "open (via free pdf)",
          "host_type": "repository",
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
      };

      expect(primo.getUnpaywallArticlePDFUrl(response)).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
    });

    it("should return an unpaywall pdf url for article hosted by publisher of unknown version from a trusted repository like nih.gov", function() {
      var response = {
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
          "url_for_pdf": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472",
          "version": null
        }
      };

      expect(primo.getUnpaywallArticlePDFUrl(response)).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
    });

    it("should return an unpaywall pdf url for article hosted by publisher of unknown version from a trusted repository like europepmc.org", function() {
      var response = {
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
          "url_for_pdf": "https://www.europepmc.org/pmc/articles/PMC6041472",
          "version": null
        }
      };

      expect(primo.getUnpaywallArticlePDFUrl(response)).toEqual("https://www.europepmc.org/pmc/articles/PMC6041472");
    });

    it("should return an unpaywall article pdf url for article hosted by repository of unknown version from a trusted repository like nih.gov", function() {
      var response = {
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
          "url_for_pdf": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472",
          "version": null
        }
      };

      expect(primo.getUnpaywallArticlePDFUrl(response)).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
    });

    it("should return an unpaywall article pdf url for article hosted by repository of unknown version from a trusted repository like europepmc.org", function() {
      var response = {
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
          "url_for_pdf": "https://www.europepmc.org/pmc/articles/PMC6041472",
          "version": null
        }
      };

      expect(primo.getUnpaywallArticlePDFUrl(response)).toEqual("https://www.europepmc.org/pmc/articles/PMC6041472");
    });
  });

  describe("primo model getUnpaywallArticleLinkUrl method >", function() {
    it("should return an unpaywall article link url for publishedVersion of article hosted by publisher without an article pdf url", function() {
      var response = {
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
      };

      expect(primo.getUnpaywallArticleLinkUrl(response)).toEqual("https://doi.org/10.1098/rstb.1986.0056");
    });

    it("should return an unpaywall article link url for publishedVersion of article hosted by repository without an article pdf url", function() {
      var response = {
        "best_oa_location": {
          "endpoint_id": null,
          "evidence": "oa journal (via observed oa rate)",
          "host_type": "repository",
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
      };

      expect(primo.getUnpaywallArticleLinkUrl(response)).toEqual("https://doi.org/10.1098/rstb.1986.0056");
    });
  });

  describe("primo model getUnpaywallManuscriptArticlePDFUrl method >", function() {
    it("should return an unpaywall manuscript pdf url for acceptedVersion of article hosted by repository", function() {
      var response = {
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
      };

      expect(primo.getUnpaywallManuscriptArticlePDFUrl(response)).toEqual("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
    });

    it("should not return an unpaywall manuscript pdf url for article hosted by repository of unknown version from a trusted repository like nih.gov", function() {
      var response = {
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
          "url_for_pdf": "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472",
          "version": null
        }
      };

      expect(primo.getUnpaywallManuscriptArticlePDFUrl(response)).toEqual(undefined);
    });

    it("should not return an unpaywall manuscript pdf url for article hosted by repository of unknown version from a trusted repository like europepmc.org", function() {
      var response = {
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
          "url_for_pdf": "https://www.europepmc.org/pmc/articles/PMC6041472",
          "version": null
        }
      };

      expect(primo.getUnpaywallManuscriptArticlePDFUrl(response)).toEqual(undefined);
    });
  });

  describe("primo model getUnpaywallManuscriptArticleLinkUrl method >", function() {
    it("should return an unpaywall manuscript article link url for acceptedVersion of article hosted by repository without an article pdf url", function() {
      var response = {
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
      };

      expect(primo.getUnpaywallManuscriptArticleLinkUrl(response)).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
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

  describe("primo model showArticleLink method >", function() {
    beforeEach(function() {
      delete browzine.articleLinkEnabled;
    });

    afterEach(function() {
      delete browzine.articleLinkEnabled;
    });

    it("should show article link by default when configuration property is undefined or null", function() {
      expect(primo.showArticleLink()).toEqual(true);
    });

    it("should show article link when configuration property is true", function() {
      browzine.articleLinkEnabled = true;
      expect(primo.showArticleLink()).toEqual(true);
    });

    it("should hide article link when configuration property is false", function() {
      browzine.articleLinkEnabled = false;
      expect(primo.showArticleLink()).toEqual(false);
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

  describe("primo model showLibKeyOneLinkView method >", function() {
    beforeEach(function() {
      delete browzine.libKeyOneLinkView;
    });

    afterEach(function() {
      delete browzine.libKeyOneLinkView;
    });

    it("should not enable onelink when configuration property is undefined", function() {
      delete browzine.libKeyOneLinkView;
      var library = primo.getIncludedLibrary(articleResponse);
      expect(primo.showLibKeyOneLinkView(library)).toEqual(false);
    });

    it("should not enable onelink when configuration property is null", function() {
      browzine.libKeyOneLinkView = null;
      var library = primo.getIncludedLibrary(articleResponse);
      expect(primo.showLibKeyOneLinkView(library)).toEqual(false);
    });

    it("should enable onelink when configuration property is true", function() {
      browzine.libKeyOneLinkView = true;
      var library = primo.getIncludedLibrary(articleResponse);
      expect(primo.showLibKeyOneLinkView(library)).toEqual(true);
    });

    it("should disable onelink when configuration property is false", function() {
      browzine.libKeyOneLinkView = false;
      var library = primo.getIncludedLibrary(articleResponse);
      expect(primo.showLibKeyOneLinkView(library)).toEqual(false);
    });
  });

  describe("primo model showRetractionWatch method >", function() {
    beforeEach(function() {
      delete browzine.articleRetractionWatchEnabled;
    });

    afterEach(function() {
      delete browzine.articleRetractionWatchEnabled;
    });

    it("should enable retraction watch when configuration property is undefined", function() {
      delete browzine.articleRetractionWatchEnabled;
      expect(primo.showRetractionWatch()).toEqual(true);
    });

    it("should enable retraction watch when configuration property is null", function() {
      browzine.articleRetractionWatchEnabled = null;
      expect(primo.showRetractionWatch()).toEqual(true);
    });

    it("should enable retraction watch when configuration property is true", function() {
      browzine.articleRetractionWatchEnabled = true;
      expect(primo.showRetractionWatch()).toEqual(true);
    });

    it("should disable retraction watch when configuration property is false", function() {
      browzine.articleRetractionWatchEnabled = false;
      expect(primo.showRetractionWatch()).toEqual(false);
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

  describe("primo model transition method >", function() {
    it("should open browzine links in a new window", function() {
      spyOn(window, "open");

      primo.transition({
        preventDefault: function() {},
        stopPropagation: function() {}
      }, {
        href: "https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file",
        target: "_blank"
      });

      expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file", "_blank");
    });
  });

  describe("primo model directToPDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadLinkText;
      delete browzine.primoArticlePDFDownloadLinkText;

      delete browzine.articleRetractionWatchText;
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadLinkText;
      delete browzine.primoArticlePDFDownloadLinkText;

      delete browzine.articleRetractionWatchText;
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

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'><a class='browzine-direct-to-pdf-link' href='https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file' target='_blank' onclick='browzine.primo.transition(event, this)'><img alt='BrowZine PDF Icon' src='https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: 4.5px;' aria-hidden='true' width='12' height='16'/> <span class='browzine-web-link-text'>Download PDF</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");

      expect(template).toContain("Download PDF");
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


    it("should build a direct to pdf template for article search results when retraction notice available and retraction watch enabled", function() {
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
      var articleRetractionUrl = primo.getArticleRetractionUrl(scope, data);
      var template = primo.directToPDFTemplate(directToPDFUrl, articleRetractionUrl);

      expect(data).toBeDefined();
      expect(directToPDFUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'><a class='browzine-direct-to-pdf-link' href='https://develop.libkey.io/libraries/1252/10.1155/2019/5730746' target='_blank' onclick='browzine.primo.transition(event, this)'><img alt='BrowZine PDF Icon' src='https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: 1.5px;' aria-hidden='true' width='15' height='16'/> <span class='browzine-web-link-text'>Retracted Article</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");

      expect(template).toContain("Retracted Article");
      expect(template).toContain("https://develop.libkey.io/libraries/1252/10.1155/2019/5730746");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg");
    });

    it("should apply the articleRetractionWatchText config property when retraction notice available and retraction watch enabled", function() {
      browzine.articleRetractionWatchText = "Retracted Article PDF";

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
      var articleRetractionUrl = primo.getArticleRetractionUrl(scope, data);
      var template = primo.directToPDFTemplate(directToPDFUrl, articleRetractionUrl);

      expect(template).toContain("Retracted Article PDF");
    });
  });

  describe("primo model articleLinkTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleLinkEnabled;
      delete browzine.articleLinkText;
    });

    afterEach(function() {
      delete browzine.articleLinkEnabled;
      delete browzine.articleLinkText;
    });

    it("should build an article link template for article search results", function() {
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
      var articleLinkUrl = primo.getArticleLinkUrl(scope, data);
      var template = primo.articleLinkTemplate(articleLinkUrl);

      expect(data).toBeDefined();
      expect(articleLinkUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'><a class='browzine-article-link' href='https://develop.browzine.com/libraries/XXX/articles/55134408' target='_blank' onclick='browzine.primo.transition(event, this)'><img alt='BrowZine Article Link Icon' src='https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg' class='browzine-article-link-icon' style='margin-bottom: -3px; margin-right: 4.5px;' aria-hidden='true' width='12' height='16'/> <span class='browzine-article-link-text'>Read Article</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");

      expect(template).toContain("Read Article");
      expect(template).toContain("https://develop.browzine.com/libraries/XXX/articles/55134408");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");
    });

    it("should apply the articleLinkText config property", function() {
      browzine.articleLinkText = "Read Article";

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
      var articleLinkUrl = primo.getArticleLinkUrl(scope, data);
      var template = primo.articleLinkTemplate(articleLinkUrl);

      expect(template).toContain("Read Article");
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

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em;'><a class='browzine-web-link' href='https://browzine.com/libraries/XXX/journals/10292' target='_blank' onclick='browzine.primo.transition(event, this)'><img alt='BrowZine Book Icon' src='https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg' class='browzine-book-icon' style='margin-bottom: -2px; margin-right: 2.5px;' aria-hidden='true' width='15' height='15'/> <span class='browzine-web-link-text'>View Journal Contents</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");
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

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em;'><a class='browzine-web-link' href='https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575' target='_blank' onclick='browzine.primo.transition(event, this)'><img alt='BrowZine Book Icon' src='https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg' class='browzine-book-icon' style='margin-bottom: -2px; margin-right: 2.5px;' aria-hidden='true' width='15' height='15'/> <span class='browzine-web-link-text'>View Issue Contents</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");
      expect(template).toContain("View Issue Contents");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
    });
  });

  describe("primo model unpaywallArticlePDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadViaUnpaywallText;
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadViaUnpaywallText;
    });

    it("should build an unpaywall article pdf template", function() {
      var response = {
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
      };

      var unpaywallArticlePDFUrl = primo.getUnpaywallArticlePDFUrl(response);
      var template = primo.unpaywallArticlePDFTemplate(unpaywallArticlePDFUrl);

      expect(unpaywallArticlePDFUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'><a class='unpaywall-article-pdf-link' href='http://jaha.org.ro/index.php/JAHA/article/download/142/119' target='_blank' onclick='browzine.primo.transition(event, this)'><img alt='BrowZine PDF Icon' src='https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: 4.5px;' aria-hidden='true' width='12' height='16'/> <span class='browzine-web-link-text'>Download PDF (via Unpaywall)</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");

      expect(template).toContain("Download PDF (via Unpaywall)");
      expect(template).toContain("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
    });

    it("should apply the articlePDFDownloadViaUnpaywallText config property", function() {
      browzine.articlePDFDownloadViaUnpaywallText = "Download PDF";

      var response = {
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
      };

      var unpaywallArticlePDFUrl = primo.getUnpaywallArticlePDFUrl(response);
      var template = primo.unpaywallArticlePDFTemplate(unpaywallArticlePDFUrl);

      expect(template).toContain("Download PDF");
      expect(template).not.toContain("Download PDF (via Unpaywall)");
    });
  });

  describe("primo model unpaywallArticleLinkTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleLinkViaUnpaywallText;
    });

    afterEach(function() {
      delete browzine.articleLinkViaUnpaywallText;
    });

    it("should build an unpaywall article link template", function() {
      var response = {
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
      };

      var unpaywallArticleLinkUrl = primo.getUnpaywallArticleLinkUrl(response);
      var template = primo.unpaywallArticleLinkTemplate(unpaywallArticleLinkUrl);

      expect(unpaywallArticleLinkUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'><a class='unpaywall-article-link' href='https://doi.org/10.1098/rstb.1986.0056' target='_blank' onclick='browzine.primo.transition(event, this)'><img alt='BrowZine Article Link Icon' src='https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg' class='browzine-article-link-icon' style='margin-bottom: -3px; margin-right: 4.5px;' aria-hidden='true' width='12' height='16'/> <span class='browzine-article-link-text'>Read Article (via Unpaywall)</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");

      expect(template).toContain("Read Article (via Unpaywall)");
      expect(template).toContain("https://doi.org/10.1098/rstb.1986.0056");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");
    });

    it("should apply the articlePDFDownloadViaUnpaywallText config property", function() {
      browzine.articleLinkViaUnpaywallText = "Read Article";

      var response = {
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
      };

      var unpaywallArticleLinkUrl = primo.getUnpaywallArticleLinkUrl(response);
      var template = primo.unpaywallArticleLinkTemplate(unpaywallArticleLinkUrl);

      expect(template).toContain("Read Article");
      expect(template).not.toContain("Read Article (via Unpaywall)");
    });
  });

  describe("primo model unpaywallManuscriptPDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallText;
    });

    afterEach(function() {
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallText;
    });

    it("should build an unpaywall manuscript article pdf template", function() {
      var response = {
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
      };

      var unpaywallManuscriptArticlePDFUrl = primo.getUnpaywallManuscriptArticlePDFUrl(response);
      var template = primo.unpaywallManuscriptPDFTemplate(unpaywallManuscriptArticlePDFUrl);

      expect(unpaywallManuscriptArticlePDFUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'><a class='unpaywall-manuscript-article-pdf-link' href='http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf' target='_blank' onclick='browzine.primo.transition(event, this)'><img alt='BrowZine PDF Icon' src='https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: 4.5px;' aria-hidden='true' width='12' height='16'/> <span class='browzine-web-link-text'>Download PDF (Accepted Manuscript via Unpaywall)</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");

      expect(template).toContain("Download PDF (Accepted Manuscript via Unpaywall)");
      expect(template).toContain("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");
    });

    it("should apply the articleAcceptedManuscriptPDFViaUnpaywallText config property", function() {
      browzine.articleAcceptedManuscriptPDFViaUnpaywallText = "Download PDF";

      var response = {
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
      };

      var unpaywallManuscriptArticlePDFUrl = primo.getUnpaywallManuscriptArticlePDFUrl(response);
      var template = primo.unpaywallManuscriptPDFTemplate(unpaywallManuscriptArticlePDFUrl);

      expect(template).toContain("Download PDF");
      expect(template).not.toContain("Download PDF (Accepted Manuscript via Unpaywall)");
    });
  });

  describe("primo model unpaywallManuscriptLinkTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallText;
    });

    afterEach(function() {
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallText;
    });

    it("should build an unpaywall manuscript article link template", function() {
      var response = {
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
      };

      var unpaywallManuscriptArticleLinkUrl = primo.getUnpaywallManuscriptArticleLinkUrl(response);
      var template = primo.unpaywallManuscriptLinkTemplate(unpaywallManuscriptArticleLinkUrl);

      expect(unpaywallManuscriptArticleLinkUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'><a class='unpaywall-manuscript-article-link' href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472' target='_blank' onclick='browzine.primo.transition(event, this)'><img alt='BrowZine Article Link Icon' src='https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg' class='browzine-article-link-icon' style='margin-bottom: -3px; margin-right: 4.5px;' aria-hidden='true' width='12' height='16'/> <span class='browzine-article-link-text'>Read Article (Accepted Manuscript via Unpaywall)</span> <md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon></a></div>");

      expect(template).toContain("Read Article (Accepted Manuscript via Unpaywall)");
      expect(template).toContain("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");
    });

    it("should apply the articleAcceptedManuscriptArticleLinkViaUnpaywallText config property", function() {
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallText = "Read Article";

      var response = {
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
      };

      var unpaywallManuscriptArticleLinkUrl = primo.getUnpaywallManuscriptArticleLinkUrl(response);
      var template = primo.unpaywallManuscriptLinkTemplate(unpaywallManuscriptArticleLinkUrl);

      expect(template).toContain("Read Article");
      expect(template).not.toContain("Read Article (Accepted Manuscript via Unpaywall)");
    });
  });

  describe("primo model isUnpaywallEnabled method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadViaUnpaywallEnabled;
      delete browzine.articleLinkViaUnpaywallEnabled;
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled;
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;
    });

    it("should validate unpaywall is disabled when none of the enabled flags are set", function() {
      expect(primo.isUnpaywallEnabled()).toEqual(undefined);
    });

    it("should validate unpaywall is enabled when all of the enabled flags are set", function() {
      browzine.articlePDFDownloadViaUnpaywallEnabled = true;
      browzine.articleLinkViaUnpaywallEnabled = true;
      browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

      expect(primo.isUnpaywallEnabled()).toEqual(true);
    });

    it("should validate unpaywall is enabled when only articlePDFDownloadViaUnpaywallEnabled is set", function() {
      browzine.articlePDFDownloadViaUnpaywallEnabled = true;
      expect(primo.isUnpaywallEnabled()).toEqual(true);
    });

    it("should validate unpaywall is enabled when only articleLinkViaUnpaywallEnabled is set", function() {
      browzine.articleLinkViaUnpaywallEnabled = true;
      expect(primo.isUnpaywallEnabled()).toEqual(true);
    });

    it("should validate unpaywall is enabled when only articleAcceptedManuscriptPDFViaUnpaywallEnabled is set", function() {
      browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
      expect(primo.isUnpaywallEnabled()).toEqual(true);
    });

    it("should validate unpaywall is enabled when only articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled is set", function() {
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;
      expect(primo.isUnpaywallEnabled()).toEqual(true);
    });
  });
});
