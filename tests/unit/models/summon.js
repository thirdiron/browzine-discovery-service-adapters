describe("Summon Model >", function() {
  var summon = {}, journalResponse = {}, articleResponse = {};

  beforeEach(function() {
    summon = browzine.summon;

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
      }]
    };
  });

  it("summon model should exist", function() {
    expect(summon).toBeDefined();
  });

  describe("summon model getScope method >", function() {
    it("should retrieve the scope from a search result", function() {
      var documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>");

      inject(function ($compile, $rootScope) {
        $scope = $rootScope.$new();

        $scope.document = {
          content_type: "Journal",
          issns: ["0028-4793"]
        };

        documentSummary = $compile(documentSummary)($scope);
      });

      var scope = summon.getScope(documentSummary);

      expect(scope).toBeDefined();
      expect(scope.document).toBeDefined();
      expect(scope.document.content_type).toBeDefined();
      expect(scope.document.issns).toBeDefined();

      expect(scope.document.content_type).toEqual("Journal");
      expect(scope.document.issns).toEqual(["0028-4793"]);
    });
  });

  describe("summon model getPrimaryColor method >", function() {
    it("should retrieve the scope from a search result", function() {
      var documentSummary = $("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='shortSummary'><a class='customPrimaryLink' style='color: rgb(38, 89, 171);'></a></div><div class='docFooter'><div class='row'></div></div></div>");

      inject(function ($compile, $rootScope) {
        $scope = $rootScope.$new();

        $scope.document = {
          content_type: "Journal",
          issns: ["0028-4793"]
        };

        documentSummary = $compile(documentSummary)($scope);
      });

      var primaryColor = summon.getPrimaryColor(documentSummary);

      expect(primaryColor).toBeDefined();
      expect(primaryColor).toEqual("rgb(38, 89, 171)");
    });
  });

  describe("summon model urlRewrite method >", function() {
    it("should rewrite the public api domain", function() {
      var url = "https://api.thirdiron.com/public/v1/libraries/XXX";
      expect(summon.urlRewrite(url)).toEqual("https://public-api.thirdiron.com/public/v1/libraries/XXX");
    });

    it("should not rewrite the public api domain when the public-api domain already exists", function() {
      var url = "https://public-api.thirdiron.com/public/v1/libraries/XXX";
      expect(summon.urlRewrite(url)).toEqual("https://public-api.thirdiron.com/public/v1/libraries/XXX");
    });
  });

  describe("summon model libraryIdOverride method >", function() {
    beforeEach(function() {
      browzine.libraryId = 123;
      delete browzine.api;
    });

    afterEach(function() {
      delete browzine.libraryId;
      browzine.api = "https://public-api.thirdiron.com/public/v1/libraries/XXX";
    });

    it("should override the libraryId on the api endpoint when specified", function() {
      expect(summon.libraryIdOverride(summon.urlRewrite(browzine.api))).toEqual("https://public-api.thirdiron.com/public/v1/libraries/123");
    });

    it("should override the libraryId on the api endpoint even when an api endpoint is specified", function() {
      browzine.api = "https://public-api.thirdiron.com/public/v1/libraries/XXX";
      expect(summon.libraryIdOverride(summon.urlRewrite(browzine.api))).toEqual("https://public-api.thirdiron.com/public/v1/libraries/123");
    });

    it("should return the customer supplied api endpoint when a libraryId is not specified", function() {
      delete browzine.libraryId;
      browzine.api = "https://public-api.thirdiron.com/public/v1/libraries/XXX";

      expect(summon.libraryIdOverride(summon.urlRewrite(browzine.api))).toEqual("https://public-api.thirdiron.com/public/v1/libraries/XXX");
    });
  });

  describe("summon model shouldEnhance method >", function() {
    it("should not enhance a search result without a document", function() {
      var scope = {};

      expect(summon.shouldEnhance(scope)).toEqual(false);
    });

    it("should enhance a journal search result with an issn", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0028-4793"]
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance a journal search result with a lowercase content type", function() {
      var scope = {
        document: {
          content_type: "journal",
          issns: ["0028-4793"]
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance an eJournal search result with an issn", function() {
      var scope = {
        document: {
          content_type: "eJournal",
          issns: ["0028-479X"]
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance an article search result with a doi", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance an article search result with a lowercase content type", function() {
      var scope = {
        document: {
          content_type: "journal article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(true);
    });

    it("should not enhance a journal search result without an issn or eissn", function() {
      var scope = {
        document: {
          content_type: "Journal"
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(false);
    });

    it("should not enhance an article search result without a doi or issn", function() {
      var scope = {
        document: {
          content_type: "Journal Article"
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(false);
    });

    it("should enhance an article search result journal cover with an issn even without a doi", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          issns: ["0028-4793"]
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(true);
    });

    it("should not enhance a journal search result without a content type", function() {
      var scope = {
        document: {
          issns: ["0028-4793"]
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(false);
    });

    it("should not enhance an article search result without a content type", function() {
      var scope = {
        document: {
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(summon.shouldEnhance(scope)).toEqual(false);
    });
  });

  describe("summon model getIssn method >", function() {
    it("should retrieve an issn from a journal search result with an issn", function() {
      var scope = {
        document: {
          content_type: "journal",
          issns: ["0028-4793"]
        }
      };

      expect(summon.getIssn(scope)).toEqual("00284793");
    });

    it("should retrieve an eissn from a journal search result with an eissn", function() {
      var scope = {
        document: {
          content_type: "journal",
          eissns: ["0096-6762"]
        }
      };

      expect(summon.getIssn(scope)).toEqual("00966762");
    });

    it("should retrieve an issn from a journal search result with both an issn and an eissn", function() {
      var scope = {
        document: {
          content_type: "journal",
          issns: ["0028-4793"],
          eissns: ["0096-6762"]
        }
      };

      expect(summon.getIssn(scope)).toEqual("00284793");
    });

    it("should only retrieve issn formats", function() {
      var scope = {
        document: {
          content_type: "journal",
          issns: ["Whitman, Mary C., Wen Fan, Lorena Rela, Diego J. Rodriguez-Gil, and Charles A. Greer. 2009. “Blood Vessels Form a Migratory Scaffold in the Rostral Migratory Stream.” The Journal of Comparative Neurology 516 (2) (September 10): 94–104. doi:10.1002/cne.22093.", "0021-9967"]
        }
      };

      expect(summon.getIssn(scope)).toEqual("00219967");
    });
  });

  describe("summon model getDoi method >", function() {
    it("should retrieve a doi from an article search result with a doi", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(summon.getDoi(scope)).toEqual(encodeURIComponent("10.1136/bmj.h2575"));
    });

    it("should retrieve an empty string from an article search result without a doi", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: []
        }
      };

      expect(summon.getDoi(scope)).toEqual("");
    });
  });

  describe("summon model getEndpoint method >", function() {
    it("should build a journal endpoint for a journal search result", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0028-4793"]
        }
      };

      expect(summon.getEndpoint(scope)).toContain("search?issns=00284793");
    });

    it("should select the issn over the eissn when a journal search result includes both", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0028-4793"],
          eissns: ["0082-3974"]
        }
      };

      expect(summon.getEndpoint(scope)).toContain("search?issns=00284793");
    });

    it("should select the eissn when the journal search result has no issn", function() {
      var scope = {
        document: {
          content_type: "Journal",
          eissns: ["0082-3974"]
        }
      };

      expect(summon.getEndpoint(scope)).toContain("search?issns=00823974");
    });

    it("should build an article endpoint for an article search result", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(summon.getEndpoint(scope)).toContain("articles/doi/10.1136%2Fbmj.h2575");
    });

    it("should build an article endpoint for an article search result and include its journal", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(summon.getEndpoint(scope)).toContain("articles/doi/10.1136%2Fbmj.h2575?include=journal,library");
    });

    it("should build a journal endpoint for an article search result with a journal issn but no article doi", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          issns: ["0028-4793"]
        }
      };

      expect(summon.getEndpoint(scope)).toContain("search?issns=00284793");
    });
  });

  describe("summon model getUnpaywallEndpoint method >", function() {
    afterEach(function() {
      delete browzine.unpaywallEmailAddressKey;
    });

    it("should build an article endpoint for an article search result", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      browzine.unpaywallEmailAddressKey = "info@thirdiron.com";

      expect(summon.getUnpaywallEndpoint(scope)).toContain("https://api.unpaywall.org/v2/10.1136%2Fbmj.h2575");
    });

    it("should build an article endpoint for an article search result only when an email address key is provided", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(summon.getUnpaywallEndpoint(scope)).toBeUndefined();
    });
  });

  describe("summon model getBrowZineWebLink method >", function() {
    it("should include a browzineWebLink in the BrowZine API response for a journal", function() {
      var data = summon.getData(journalResponse);
      expect(data).toBeDefined();
      expect(summon.getBrowZineWebLink(data)).toEqual("https://browzine.com/libraries/XXX/journals/10292");
    });

    it("should include a browzineWebLink in the BrowZine API response for an article", function() {
      var data = summon.getData(articleResponse);
      expect(data).toBeDefined();
      expect(summon.getBrowZineWebLink(data)).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
    });
  });

  describe("summon model getCoverImageUrl method >", function() {
    it("should include a coverImageUrl in the BrowZine API response for a journal", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0082-3974"]
        }
      };

      var data = summon.getData(journalResponse);
      var journal = summon.getIncludedJournal(journalResponse);

      expect(data).toBeDefined();
      expect(journal).toBeNull();

      expect(summon.getCoverImageUrl(scope, data, journal)).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
    });

    it("should include a coverImageUrl in the BrowZine API response for an article", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var journal = summon.getIncludedJournal(articleResponse);

      expect(data).toBeDefined();
      expect(journal).toBeDefined();

      expect(summon.getCoverImageUrl(scope, data, journal)).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
    });

    it("should include a coverImageUrl in the BrowZine API response for an article with a journal issn but no article doi", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          issns: ["0082-3974"]
        }
      };

      var data = summon.getData(journalResponse);
      var journal = summon.getIncludedJournal(journalResponse);

      expect(data).toBeDefined();
      expect(journal).toBeNull();

      expect(summon.getCoverImageUrl(scope, data, journal)).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
    });
  });

  describe("summon model getBrowZineEnabled method >", function() {
    it("should include a browzineEnabled in the BrowZine API response for a journal", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0082-3974"]
        }
      };

      var data = summon.getData(journalResponse);
      var journal = summon.getIncludedJournal(journalResponse);

      expect(summon.getBrowZineEnabled(scope, data, journal)).toEqual(true);
    });
  });

  describe("summon model isDefaultCoverImage method >", function() {
    it("should return false when an actual coverImageUrl is returned by the API", function() {
      var coverImageUrl = "https://assets.thirdiron.com/images/covers/0028-4793.png";
      expect(summon.isDefaultCoverImage(coverImageUrl)).toEqual(false);
    });

    it("should return true when a default coverImageUrl is returned by the API", function() {
      var coverImageUrl = "https://assets.thirdiron.com/images/covers/default.png";
      expect(summon.isDefaultCoverImage(coverImageUrl)).toEqual(true);
    });
  });

  describe("summon model getData method >", function() {
    it("should return data when the journal is browzineEnabled", function() {
      var data = summon.getData(journalResponse);
      expect(data).toBeDefined();
    });

    it("should not return data when the journal is not browzineEnabled", function() {
      journalResponse.data[0].browzineEnabled = false;
      var data = summon.getData(journalResponse);
      expect(data).toEqual(undefined);
    });

    it("should return data for an article", function() {
      var data = summon.getData(articleResponse);
      expect(data).toBeDefined();
    });
  });

  describe("summon model getDirectToPDFUrl method >", function() {
    it("should not return a direct to pdf url for journal search results", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0082-3974"]
        }
      };

      var data = summon.getData(journalResponse);

      expect(data).toBeDefined();

      expect(summon.getDirectToPDFUrl(scope, data)).toBeNull();
    });

    it("should return a direct to pdf url for article search results", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);

      expect(data).toBeDefined();

      expect(summon.getDirectToPDFUrl(scope, data)).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
    });

    it("should not return a direct to pdf url for article search results with no doi and in a journal that is not browzineEnabled", function() {
      var scope = {
        document: {
          content_type: "Journal Article"
        }
      };

      journalResponse.data[0].browzineEnabled = false;
      var data = summon.getData(journalResponse);

      expect(data).toEqual(undefined);

      expect(summon.getDirectToPDFUrl(scope, data)).toEqual(null);
    });
  });

  describe("summon model getArticleLinkUrl method >", function() {
    it("should not return an article link url for journal search results", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0082-3974"]
        }
      };

      var data = summon.getData(journalResponse);

      expect(data).toBeDefined();

      expect(summon.getArticleLinkUrl(scope, data)).toBeNull();
    });

    it("should return an article link url for article search results", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);

      expect(data).toBeDefined();

      expect(summon.getArticleLinkUrl(scope, data)).toEqual("https://develop.browzine.com/libraries/XXX/articles/55134408");
    });

    it("should not return an article link url for article search results with no doi and in a journal that is not browzineEnabled", function() {
      var scope = {
        document: {
          content_type: "Journal Article"
        }
      };

      journalResponse.data[0].browzineEnabled = false;
      var data = summon.getData(journalResponse);

      expect(data).toEqual(undefined);

      expect(summon.getArticleLinkUrl(scope, data)).toEqual(null);
    });
  });

  describe("summon model getArticleRetractionUrl method >", function() {
    it("should not return an article retraction url for journal search results", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0082-3974"]
        }
      };

      var data = summon.getData(journalResponse);

      expect(data).toBeDefined();

      expect(summon.getArticleRetractionUrl(scope, data)).toBeNull();
    });

    it("should return an article retraction url for article search results", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);

      expect(data).toBeDefined();

      expect(summon.getArticleRetractionUrl(scope, data)).toEqual("https://develop.libkey.io/libraries/1252/10.1155/2019/5730746");
    });

    it("should not return an article retraction url for article search results with no doi and in a journal that is not browzineEnabled", function() {
      var scope = {
        document: {
          content_type: "Journal Article"
        }
      };

      journalResponse.data[0].browzineEnabled = false;
      var data = summon.getData(journalResponse);

      expect(data).toEqual(undefined);

      expect(summon.getArticleRetractionUrl(scope, data)).toEqual(null);
    });
  });

  describe("summon model isTrustedRepository method >", function() {
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

      expect(summon.isTrustedRepository(response)).toEqual(false);
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

      expect(summon.isTrustedRepository(response)).toEqual(true);
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

      expect(summon.isTrustedRepository(response)).toEqual(true);
    });
  });

  describe("summon model isUnknownVersion method >", function() {
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

      expect(summon.isUnknownVersion(response)).toEqual(true);
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

      expect(summon.isUnknownVersion(response)).toEqual(true);
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

      expect(summon.isUnknownVersion(response)).toEqual(true);
    });
  });

  describe("summon model getUnpaywallArticlePDFUrl method >", function() {
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

      expect(summon.getUnpaywallArticlePDFUrl(response)).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
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

      expect(summon.getUnpaywallArticlePDFUrl(response)).toEqual("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
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

      expect(summon.getUnpaywallArticlePDFUrl(response)).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
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

      expect(summon.getUnpaywallArticlePDFUrl(response)).toEqual("https://www.europepmc.org/pmc/articles/PMC6041472");
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

      expect(summon.getUnpaywallArticlePDFUrl(response)).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
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

      expect(summon.getUnpaywallArticlePDFUrl(response)).toEqual("https://www.europepmc.org/pmc/articles/PMC6041472");
    });
  });

  describe("summon model getUnpaywallArticleLinkUrl method >", function() {
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

      expect(summon.getUnpaywallArticleLinkUrl(response)).toEqual("https://doi.org/10.1098/rstb.1986.0056");
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

      expect(summon.getUnpaywallArticleLinkUrl(response)).toEqual("https://doi.org/10.1098/rstb.1986.0056");
    });
  });

  describe("summon model getUnpaywallManuscriptArticlePDFUrl method >", function() {
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

      expect(summon.getUnpaywallManuscriptArticlePDFUrl(response)).toEqual("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
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

      expect(summon.getUnpaywallManuscriptArticlePDFUrl(response)).toEqual(undefined);
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

      expect(summon.getUnpaywallManuscriptArticlePDFUrl(response)).toEqual(undefined);
    });
  });

  describe("summon model getUnpaywallManuscriptArticleLinkUrl method >", function() {
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

      expect(summon.getUnpaywallManuscriptArticleLinkUrl(response)).toEqual("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
    });
  });

  describe("summon model showJournalCoverImages method >", function() {
    beforeEach(function() {
      delete browzine.journalCoverImagesEnabled;
    });

    afterEach(function() {
      delete browzine.journalCoverImagesEnabled;
    });

    it("should show journal cover when configuration property is undefined or null", function() {
      expect(summon.showJournalCoverImages()).toEqual(true);
    });

    it("should show journal cover when configuration property is true", function() {
      browzine.journalCoverImagesEnabled = true;
      expect(summon.showJournalCoverImages()).toEqual(true);
    });

    it("should not show journal cover when configuration property is false", function() {
      browzine.journalCoverImagesEnabled = false;
      expect(summon.showJournalCoverImages()).toEqual(false);
    });
  });

  describe("summon model showJournalBrowZineWebLinkText method >", function() {
    beforeEach(function() {
      delete browzine.journalBrowZineWebLinkTextEnabled;
    });

    afterEach(function() {
      delete browzine.journalBrowZineWebLinkTextEnabled;
    });

    it("should show issue link when configuration property is undefined or null", function() {
      expect(summon.showJournalBrowZineWebLinkText()).toEqual(true);
    });

    it("should show issue link when configuration property is true", function() {
      browzine.journalBrowZineWebLinkTextEnabled = true;
      expect(summon.showJournalBrowZineWebLinkText()).toEqual(true);
    });

    it("should not show issue link when configuration property is false", function() {
      browzine.journalBrowZineWebLinkTextEnabled = false;
      expect(summon.showJournalBrowZineWebLinkText()).toEqual(false);
    });
  });

  describe("summon model showArticleBrowZineWebLinkText method >", function() {
    beforeEach(function() {
      delete browzine.articleBrowZineWebLinkTextEnabled;
    });

    afterEach(function() {
      delete browzine.articleBrowZineWebLinkTextEnabled;
    });

    it("should show article in context link when configuration property is undefined or null", function() {
      expect(summon.showArticleBrowZineWebLinkText()).toEqual(true);
    });

    it("should show article in context link when configuration property is true", function() {
      browzine.articleBrowZineWebLinkTextEnabled = true;
      expect(summon.showArticleBrowZineWebLinkText()).toEqual(true);
    });

    it("should not show article in context link when configuration property is false", function() {
      browzine.articleBrowZineWebLinkTextEnabled = false;
      expect(summon.showArticleBrowZineWebLinkText()).toEqual(false);
    });
  });

  describe("summon model showDirectToPDFLink method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadLinkEnabled;
      delete browzine.summonArticlePDFDownloadLinkEnabled;
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadLinkEnabled;
      delete browzine.summonArticlePDFDownloadLinkEnabled;
    });

    it("should show direct to pdf link when configuration property is undefined or null", function() {
      expect(summon.showDirectToPDFLink()).toEqual(true);
    });

    it("should show direct to pdf link when configuration property is true", function() {
      browzine.articlePDFDownloadLinkEnabled = true;
      expect(summon.showDirectToPDFLink()).toEqual(true);
    });

    it("should hide direct to pdf link when configuration property is false", function() {
      browzine.articlePDFDownloadLinkEnabled = false;
      expect(summon.showDirectToPDFLink()).toEqual(false);
    });

    it("should show direct to pdf link when the platform prefixed configuration property is true", function() {
      browzine.summonArticlePDFDownloadLinkEnabled = true;
      expect(summon.showDirectToPDFLink()).toEqual(true);
    });

    it("should hide direct to pdf link when the platform prefixed configuration property is false", function() {
      browzine.summonArticlePDFDownloadLinkEnabled = false;
      expect(summon.showDirectToPDFLink()).toEqual(false);
    });
  });

  describe("summon model showArticleLink method >", function() {
    beforeEach(function() {
      delete browzine.articleLinkEnabled;
    });

    afterEach(function() {
      delete browzine.articleLinkEnabled;
    });

    it("should show article link by default when configuration property is undefined or null", function() {
      expect(summon.showArticleLink()).toEqual(true);
    });

    it("should show article link when configuration property is true", function() {
      browzine.articleLinkEnabled = true;
      expect(summon.showArticleLink()).toEqual(true);
    });

    it("should hide article link when configuration property is false", function() {
      browzine.articleLinkEnabled = false;
      expect(summon.showArticleLink()).toEqual(false);
    });
  });

  describe("summon model showPrintRecords method >", function() {
    beforeEach(function() {
      delete browzine.printRecordsIntegrationEnabled;
    });

    afterEach(function() {
      delete browzine.printRecordsIntegrationEnabled;
    });

    it("should enhance print records when configuration property is undefined or null", function() {
      expect(summon.showPrintRecords()).toEqual(true);
    });

    it("should enhance print records when configuration property is true", function() {
      browzine.printRecordsIntegrationEnabled = true;
      expect(summon.showPrintRecords()).toEqual(true);
    });

    it("should not enhance print records when configuration property is false", function() {
      browzine.printRecordsIntegrationEnabled = false;
      expect(summon.showPrintRecords()).toEqual(false);
    });
  });

  describe("summon model showRetractionWatch method >", function() {
    beforeEach(function() {
      delete browzine.articleRetractionWatchEnabled;
    });

    afterEach(function() {
      delete browzine.articleRetractionWatchEnabled;
    });

    it("should enable retraction watch when configuration property is undefined", function() {
      delete browzine.articleRetractionWatchEnabled;
      expect(summon.showRetractionWatch()).toEqual(true);
    });

    it("should enable retraction watch when configuration property is null", function() {
      browzine.articleRetractionWatchEnabled = null;
      expect(summon.showRetractionWatch()).toEqual(true);
    });

    it("should enable retraction watch when configuration property is true", function() {
      browzine.articleRetractionWatchEnabled = true;
      expect(summon.showRetractionWatch()).toEqual(true);
    });

    it("should disable retraction watch when configuration property is false", function() {
      browzine.articleRetractionWatchEnabled = false;
      expect(summon.showRetractionWatch()).toEqual(false);
    });
  });

  describe("summon model showFormatChoice method >", function() {
    beforeEach(function() {
      delete browzine.showFormatChoice;
    });

    afterEach(function() {
      delete browzine.showFormatChoice;
    });

    it("should disable format choice when configuration property is undefined", function() {
      delete browzine.showFormatChoice;
      expect(summon.showFormatChoice()).toEqual(false);
    });

    it("should disable format choice when configuration property is null", function() {
      browzine.showFormatChoice = null;
      expect(summon.showFormatChoice()).toEqual(false);
    });

    it("should enable format choice when configuration property is true", function() {
      browzine.showFormatChoice = true;
      expect(summon.showFormatChoice()).toEqual(true);
    });

    it("should disable format choice when configuration property is false", function() {
      browzine.showFormatChoice = false;
      expect(summon.showFormatChoice()).toEqual(false);
    });
  });

  describe("summon model showLinkResolverLink method >", function() {
    beforeEach(function() {
      delete browzine.showLinkResolverLink;
    });

    afterEach(function() {
      delete browzine.showLinkResolverLink;
    });

    it("should enable link resolver link when configuration property is undefined", function() {
      delete browzine.showLinkResolverLink;
      expect(summon.showLinkResolverLink()).toEqual(true);
    });

    it("should enable link resolver link when configuration property is null", function() {
      browzine.showLinkResolverLink = null;
      expect(summon.showLinkResolverLink()).toEqual(true);
    });

    it("should enable link resolver link when configuration property is true", function() {
      browzine.showLinkResolverLink = true;
      expect(summon.showLinkResolverLink()).toEqual(true);
    });

    it("should disable link resolver link when configuration property is false", function() {
      browzine.showLinkResolverLink = false;
      expect(summon.showLinkResolverLink()).toEqual(false);
    });
  });

  describe("summon model enableLinkOptimizer method >", function() {
    beforeEach(function() {
      delete browzine.enableLinkOptimizer;
    });

    afterEach(function() {
      delete browzine.enableLinkOptimizer;
    });

    it("should enable link optimizer when configuration property is undefined", function() {
      delete browzine.enableLinkOptimizer;
      expect(summon.enableLinkOptimizer()).toEqual(true);
    });

    it("should enable link optimizer when configuration property is null", function() {
      browzine.enableLinkOptimizer = null;
      expect(summon.enableLinkOptimizer()).toEqual(true);
    });

    it("should enable link optimizer when configuration property is true", function() {
      browzine.enableLinkOptimizer = true;
      expect(summon.enableLinkOptimizer()).toEqual(true);
    });

    it("should disable link optimizer when configuration property is false", function() {
      browzine.enableLinkOptimizer = false;
      expect(summon.enableLinkOptimizer()).toEqual(false);
    });
  });

  describe("summon model isFiltered method >", function() {
    beforeEach(function() {
      delete browzine.printRecordsIntegrationEnabled;
    });

    afterEach(function() {
      delete browzine.printRecordsIntegrationEnabled;
    });

    it("should not filter electronic records when print records configuration property is undefined or null", function() {
      var scope = {
        document: {
          is_print: false
        }
      };
      expect(summon.isFiltered(scope)).toEqual(false);
    });

    it("should not filter electronic records when print records configuration property is true", function() {
      var scope = {
        document: {
          is_print: false
        }
      };
      browzine.printRecordsIntegrationEnabled = true;
      expect(summon.isFiltered(scope)).toEqual(false);
    });

    it("should not filter electronic records when print records configuration property is false", function() {
      var scope = {
        document: {
          is_print: false
        }
      };
      browzine.printRecordsIntegrationEnabled = false;
      expect(summon.isFiltered(scope)).toEqual(false);
    });

    it("should not filter print records when print records configuration property is undefined or null", function() {
      var scope = {
        document: {
          is_print: true
        }
      };
      expect(summon.isFiltered(scope)).toEqual(false);
    });

    it("should not filter print records when print records configuration property is true", function() {
      var scope = {
        document: {
          is_print: true
        }
      };
      browzine.printRecordsIntegrationEnabled = true;
      expect(summon.isFiltered(scope)).toEqual(false);
    });

    it("should filter print records when print records configuration property is false", function() {
      var scope = {
        document: {
          is_print: true
        }
      };
      browzine.printRecordsIntegrationEnabled = false;
      expect(summon.isFiltered(scope)).toEqual(true);
    });
  });

  describe("summon model transition method >", function() {
    it("should open browzine links in a new window", function() {
      spyOn(window, "open");

      summon.transition({
        preventDefault: function() {},
        stopPropagation: function() {}
      }, {
        href: "https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file",
        target: "_blank"
      });

      expect(window.open).toHaveBeenCalledWith("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file", "_blank");
    });
  });

  describe("summon model directToPDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadWording;
      delete browzine.summonArticlePDFDownloadWording;
      delete browzine.articlePDFDownloadLinkText;
      delete browzine.summonArticlePDFDownloadLinkText;
      delete browzine.articlePDFDownloadLinkText;

      delete browzine.articleRetractionWatchTextWording;
      delete browzine.articleRetractionWatchText;
      delete browzine.version;
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadWording;
      delete browzine.summonArticlePDFDownloadWording;
      delete browzine.articlePDFDownloadLinkText;
      delete browzine.summonArticlePDFDownloadLinkText;

      delete browzine.articleRetractionWatchTextWording;
      delete browzine.articleRetractionWatchText;
      delete browzine.version;
    });

    it("should build a direct to pdf template for article search results", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl);

      expect(data).toBeDefined();
      expect(directToPDFUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='margin-right: 4.5px;'>View Now</span><a class='browzine-direct-to-pdf-link summonBtn customPrimaryLink' href='https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file' target='_blank' onclick='browzine.summon.transition(event, this)'><svg name="pdf" alt="pdf icon" class="browzine-pdf-icon" viewBox="0 0 16 16" width="15.5px"><path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path> <path fill="#639add" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path></svg><span style='margin-left: 3px;'>PDF</span></a></div>`);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now PDF");
      expect(template).toContain("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
    });

    it("should apply the articlePDFDownloadWording config property", function() {
      browzine.version = 2;
      browzine.articlePDFDownloadWording = "Journal Article PDF";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Journal Article PDF");
    });

    it("should apply the articlePDFDownloadLinkText config property", function() {
      browzine.version = "2";
      browzine.articlePDFDownloadLinkText = "Download PDF";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Download PDF");
    });

    it("should not apply the articlePDFDownloadWording config property", function() {
      delete browzine.version;
      browzine.articlePDFDownloadWording = "Journal Article PDF";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now PDF");
    });

    it("should not apply the articlePDFDownloadLinkText config property", function() {
      delete browzine.version;
      browzine.articlePDFDownloadLinkText = "Download PDF";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now PDF");
    });

    it("should build a retracted pdf template for article search results when retraction notice available and retraction watch enabled", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var articleRetractionUrl = summon.getArticleRetractionUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl, articleRetractionUrl);

      expect(data).toBeDefined();
      expect(directToPDFUrl).toBeDefined();
      expect(articleRetractionUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='margin-right: 4.5px;'>Retracted Article</span><a class='browzine-direct-to-pdf-link summonBtn customPrimaryLink' href='https://develop.libkey.io/libraries/1252/10.1155/2019/5730746' target='_blank' onclick='browzine.summon.transition(event, this)'><svg name="warning" alt="warning icon" class="browzine-warning-icon" width="16px" viewBox="0 0 576 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="retraction-watch-icon-4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="exclamation-triangle" transform="translate(1.000000, 0.000000)" fill="#EB0000" fill-rule="nonzero"><path d="M569.517287,440.013005 C587.975287,472.007005 564.806287,512 527.940287,512 L48.0542867,512 C11.1172867,512 -11.9447133,471.945005 6.47728668,440.013005 L246.423287,23.9850049 C264.890287,-8.02399507 311.143287,-7.96599507 329.577287,23.9850049 L569.517287,440.013005 Z M288.000287,354.000005 C262.595287,354.000005 242.000287,374.595005 242.000287,400.000005 C242.000287,425.405005 262.595287,446.000005 288.000287,446.000005 C313.405287,446.000005 334.000287,425.405005 334.000287,400.000005 C334.000287,374.595005 313.405287,354.000005 288.000287,354.000005 Z M244.327287,188.654005 L251.745287,324.654005 C252.092287,331.018005 257.354287,336.000005 263.727287,336.000005 L312.273287,336.000005 C318.646287,336.000005 323.908287,331.018005 324.255287,324.654005 L331.673287,188.654005 C332.048287,181.780005 326.575287,176.000005 319.691287,176.000005 L256.308287,176.000005 C249.424287,176.000005 243.952287,181.780005 244.327287,188.654005 L244.327287,188.654005 Z" id="Shape"></path></g></g></svg> <span style='margin-left: 3px;'>More Info</span></a></div>`);

      expect(template).toContain("Retracted Article");
      expect(template).toContain("https://develop.libkey.io/libraries/1252/10.1155/2019/5730746");
      expect(template).toContain("More");
    });

    it("should apply the articleRetractionWatchTextWording config property when retraction notice available and retraction watch enabled", function() {
      browzine.articleRetractionWatchTextWording = "Retracted Article PDF";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var articleRetractionUrl = summon.getArticleRetractionUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl, articleRetractionUrl);

      expect(template).toContain("Retracted Article PDF");
    });

    it("should apply the articleRetractionWatchText config property when retraction notice available and retraction watch enabled", function() {
      browzine.articleRetractionWatchText = "More Info";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var articleRetractionUrl = summon.getArticleRetractionUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl, articleRetractionUrl);

      expect(template).toContain("More Info");
    });
  });

  describe("summon model articleLinkTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleLinkEnabled;
      delete browzine.articleLinkTextWording;
      delete browzine.articleLinkText;
      delete browzine.version;
    });

    afterEach(function() {
      delete browzine.articleLinkEnabled;
      delete browzine.articleLinkTextWording;
      delete browzine.articleLinkText;
      delete browzine.version;
    });

    it("should build an article link template for article search results", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleLinkUrl = summon.getArticleLinkUrl(scope, data);
      var template = summon.articleLinkTemplate(articleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect(data).toBeDefined();
      expect(articleLinkUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toContain("https://develop.browzine.com/libraries/XXX/articles/55134408");

      expect($template.innerText).toContain("View Now Article Page");
    });

    it("should apply the articleLinkTextWording config property", function() {
      browzine.version = 2;
      browzine.articleLinkTextWording = "Article Link";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleLinkUrl = summon.getArticleLinkUrl(scope, data);
      var template = summon.articleLinkTemplate(articleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Article Link");
    });

    it("should apply the articleLinkText config property", function() {
      browzine.version = "2";
      browzine.articleLinkText = "Read Article";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleLinkUrl = summon.getArticleLinkUrl(scope, data);
      var template = summon.articleLinkTemplate(articleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now Read Article");
    });

    it("should not apply the articleLinkTextWording config property", function() {
      delete browzine.version;
      browzine.articleLinkTextWording = "Article Link";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleLinkUrl = summon.getArticleLinkUrl(scope, data);
      var template = summon.articleLinkTemplate(articleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now Article Page");
    });

    it("should not apply the articleLinkText config property", function() {
      delete browzine.version;
      browzine.articleLinkText = "Read Article";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleLinkUrl = summon.getArticleLinkUrl(scope, data);
      var template = summon.articleLinkTemplate(articleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now Article Page");
    });
  });

  describe("summon model retractionWatchLinkTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleRetractionWatchEnabled;
      delete browzine.articleRetractionWatchTextWording;
      delete browzine.articleRetractionWatchText;
      delete browzine.version;
    });

    afterEach(function() {
      delete browzine.articleRetractionWatchEnabled;
      delete browzine.articleRetractionWatchTextWording;
      delete browzine.articleRetractionWatchText;
      delete browzine.version;
    });

    it("should build a retraction watch link template for article search results", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleRetractionUrl = summon.getArticleRetractionUrl(scope, data);
      var template = summon.retractionWatchLinkTemplate(articleRetractionUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect(data).toBeDefined();
      expect(articleRetractionUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toContain("https://develop.libkey.io/libraries/1252/10.1155/2019/5730746");

      expect($template.innerText).toContain("Retracted Article More Info");
    });

    it("should apply the articleRetractionWatchTextWording config property", function() {
      browzine.version = 2;
      browzine.articleRetractionWatchTextWording = "Retracted Article (DO NOT REFERENCE)";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleRetractionUrl = summon.getArticleRetractionUrl(scope, data);
      var template = summon.retractionWatchLinkTemplate(articleRetractionUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Retracted Article (DO NOT REFERENCE)");
    });

    it("should apply the articleRetractionWatchText config property", function() {
      browzine.version = "2";
      browzine.articleRetractionWatchText = "Learn More";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleRetractionUrl = summon.getArticleRetractionUrl(scope, data);
      var template = summon.retractionWatchLinkTemplate(articleRetractionUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Retracted Article Learn More");
    });

    it("should not apply the articleRetractionWatchTextWording config property", function() {
      delete browzine.version;
      browzine.articleLinkTextWording = "Retracted Article (DO NOT REFERENCE)";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleRetractionUrl = summon.getArticleRetractionUrl(scope, data);
      var template = summon.retractionWatchLinkTemplate(articleRetractionUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Retracted Article More Info");
      expect($template.innerText).not.toContain("Retracted Article (DO NOT REFERENCE)");
    });

    it("should not apply the articleRetractionWatchText config property", function() {
      delete browzine.version;
      browzine.articleRetractionWatchText = "Learn More";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var articleRetractionUrl = summon.getArticleRetractionUrl(scope, data);
      var template = summon.retractionWatchLinkTemplate(articleRetractionUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Retracted Article More Info");
      expect($template.innerText).not.toContain("Learn More");
    });
  });

  describe("summon model browzineWebLinkTemplate method >", function() {
    it("should build a browzine web link template for journal search results", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0082-3974"]
        }
      };

      var data = summon.getData(journalResponse);
      var browzineWebLink = summon.getBrowZineWebLink(data);
      var template = summon.browzineWebLinkTemplate(scope, browzineWebLink);

      expect(data).toBeDefined();
      expect(browzineWebLink).toBeDefined();
      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='margin-right: 4.5px;'>View the Journal</span><a class='browzine-web-link summonBtn customPrimaryLink' href='https://browzine.com/libraries/XXX/journals/10292' target='_blank' onclick='browzine.summon.transition(event, this)'><svg name="book" alt="book icon" class="browzine-book-icon" width="16px" viewBox="0 0 526 434" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="browzine-open-book-icon-1" fill="#639add" transform="translate(7.000000, 7.000000)"><path d="M241.618552,55.7857207 C232.151375,26.3203553 207.77015,11.5876726 168.474879,11.5876726 C129.179608,11.5876726 76.8941653,24.1287042 11.6185517,49.2107674 L11.6185517,346.505747 C71.2023037,323.297721 118.863283,311.693708 154.60149,311.693708 C190.590991,322.63818 222.073848,357.764826 241.262978,358.587673 C241.16729,340.930135 241.285815,239.996151 241.618552,55.7857207 Z" id="Path-2"></path><path d="M499.999449,55.7857207 C490.532272,26.3203553 466.151048,11.5876726 426.855777,11.5876726 C387.560506,11.5876726 335.275063,24.1287042 269.999449,49.2107674 L269.999449,346.505747 C329.583202,323.297721 377.244181,311.693708 412.982388,311.693708 C448.971888,322.63818 480.454746,357.764826 499.643876,358.587673 C499.548188,340.930135 499.666712,239.996151 499.999449,55.7857207 Z" id="Path-2" transform="translate(384.999449, 185.087673) scale(-1, 1) translate(-384.999449, -185.087673) "></path><path d="M344.971286,0 C379.260972,0 412.325161,10.6415785 441.494847,20.0313871 C464.528241,27.444771 486.283286,34.4477219 503.741935,34.4477219 C508.30369,34.4477219 512,37.8847153 512,42.1241515 L512,42.1241515 L512,351.32357 C512,355.56403 508.30369,359 503.741935,359 C483.505273,359 460.474082,351.586616 436.09077,343.738234 C408.150985,334.745553 376.482959,324.552278 344.971286,324.552278 C317.949798,324.552278 296.07914,332.869434 279.964903,349.273452 C279.113304,350.14049 278.096775,350.784232 277.000418,351.201089 L276.99961,330.702434 C291.282552,319.592502 313.151786,309.198395 344.971286,309.198395 C379.260972,309.198395 412.325161,319.839974 441.494847,329.229783 C461.022417,335.516267 479.632791,341.504905 495.483871,343.183484 L495.483871,343.183484 L495.483871,49.4198301 C477.326039,47.811874 457.217101,41.3391086 436.09077,34.5388155 C408.150985,25.5461341 376.482959,15.3528592 344.971286,15.3528592 C309.687885,15.3528592 288.737148,30.039209 277.000735,43.3352913 L277.000134,21.5040389 C291.28361,10.3941064 313.152669,0 344.971286,0 Z M167.030916,0 C198.848787,0 220.716859,10.3936191 235.000643,21.5032576 L235.003099,43.1198859 C223.319986,29.87399 202.436991,15.3528592 167.028714,15.3528592 C135.517041,15.3528592 103.849015,25.5461341 75.9092301,34.5388155 C54.784,41.3380851 34.6739613,47.811874 16.516129,49.4198301 L16.516129,49.4198301 L16.516129,343.183484 C32.3672086,341.504905 50.9775828,335.516267 70.5051527,329.228759 C99.6748387,319.83895 132.737927,309.197372 167.028714,309.197372 C198.848685,309.197372 220.717699,319.59294 235.001366,330.703227 L235.000654,351.199798 C233.903438,350.782964 232.88611,350.138967 232.033996,349.271405 C215.919759,332.86841 194.049101,324.551255 167.028714,324.551255 C135.517041,324.551255 103.849015,334.74453 75.9092301,343.737211 C51.5270194,351.585593 28.495828,359 8.25806452,359 C3.69630968,359 0,355.563007 0,351.322547 L0,351.322547 L0,42.1241515 C0,37.8836918 3.69630968,34.4477219 8.25806452,34.4477219 C25.716714,34.4477219 47.4717591,27.444771 70.5073548,20.0313871 C99.6770409,10.6415785 132.740129,0 167.030916,0 Z" id="Combined-Shape" stroke="#629ADD" stroke-width="13.7634409" fill-rule="nonzero"></path><path d="M503.741935,402.716077 C486.283286,402.716077 464.528241,395.18252 441.494847,387.207432 C412.325161,377.106168 379.260972,365.658288 344.971286,365.658288 C307.707596,365.658288 284.091733,380.994065 270.322787,394.942486 L241.676112,394.941385 C227.907166,380.992963 204.290202,365.658288 167.028714,365.658288 C132.737927,365.658288 99.6748387,377.106168 70.5051527,387.207432 C47.4717591,395.18252 25.716714,402.716077 8.25806452,402.716077 C3.69630968,402.716077 0,406.412387 0,410.974142 C0,415.535897 3.69630968,419.232206 8.25806452,419.232206 C28.495828,419.232206 51.5270194,411.257118 75.9092301,402.814073 C103.849015,393.140026 135.517041,382.174417 167.028714,382.174417 C194.049101,382.174417 215.919759,391.121755 232.033996,408.767587 C233.598624,410.48086 235.811785,411.456413 238.131751,411.456413 L273.866047,411.457514 C276.186013,411.457514 278.399174,410.48086 279.963802,408.768688 C296.078039,391.121755 317.948697,382.174417 344.970185,382.174417 C376.481858,382.174417 408.149884,393.140026 436.089669,402.814073 C460.472981,411.257118 483.504172,419.232206 503.740834,419.232206 C508.302589,419.232206 511.998899,415.535897 511.998899,410.974142 C511.998899,406.412387 508.30369,402.716077 503.741935,402.716077 Z" id="Path" stroke="#629ADD" stroke-width="13.7634409" fill-rule="nonzero"></path></g></g></svg> <span style='margin-left: 2px;'>Browse Now</span></a></div>`);
      expect(template).toContain("View the Journal");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/10292");
      expect(template).toContain("Browse Now");
    });

    it("should build a browzine web link template for article search results", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var browzineWebLink = summon.getBrowZineWebLink(data);
      var template = summon.browzineWebLinkTemplate(scope, browzineWebLink);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect(data).toBeDefined();
      expect(browzineWebLink).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='margin-right: 4.5px;'>View in Context</span><a class='browzine-web-link summonBtn customPrimaryLink' href='https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575' target='_blank' onclick='browzine.summon.transition(event, this)'><svg name="book" alt="book icon" class="browzine-book-icon" width="16px" viewBox="0 0 526 434" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="browzine-open-book-icon-1" fill="#639add" transform="translate(7.000000, 7.000000)"><path d="M241.618552,55.7857207 C232.151375,26.3203553 207.77015,11.5876726 168.474879,11.5876726 C129.179608,11.5876726 76.8941653,24.1287042 11.6185517,49.2107674 L11.6185517,346.505747 C71.2023037,323.297721 118.863283,311.693708 154.60149,311.693708 C190.590991,322.63818 222.073848,357.764826 241.262978,358.587673 C241.16729,340.930135 241.285815,239.996151 241.618552,55.7857207 Z" id="Path-2"></path><path d="M499.999449,55.7857207 C490.532272,26.3203553 466.151048,11.5876726 426.855777,11.5876726 C387.560506,11.5876726 335.275063,24.1287042 269.999449,49.2107674 L269.999449,346.505747 C329.583202,323.297721 377.244181,311.693708 412.982388,311.693708 C448.971888,322.63818 480.454746,357.764826 499.643876,358.587673 C499.548188,340.930135 499.666712,239.996151 499.999449,55.7857207 Z" id="Path-2" transform="translate(384.999449, 185.087673) scale(-1, 1) translate(-384.999449, -185.087673) "></path><path d="M344.971286,0 C379.260972,0 412.325161,10.6415785 441.494847,20.0313871 C464.528241,27.444771 486.283286,34.4477219 503.741935,34.4477219 C508.30369,34.4477219 512,37.8847153 512,42.1241515 L512,42.1241515 L512,351.32357 C512,355.56403 508.30369,359 503.741935,359 C483.505273,359 460.474082,351.586616 436.09077,343.738234 C408.150985,334.745553 376.482959,324.552278 344.971286,324.552278 C317.949798,324.552278 296.07914,332.869434 279.964903,349.273452 C279.113304,350.14049 278.096775,350.784232 277.000418,351.201089 L276.99961,330.702434 C291.282552,319.592502 313.151786,309.198395 344.971286,309.198395 C379.260972,309.198395 412.325161,319.839974 441.494847,329.229783 C461.022417,335.516267 479.632791,341.504905 495.483871,343.183484 L495.483871,343.183484 L495.483871,49.4198301 C477.326039,47.811874 457.217101,41.3391086 436.09077,34.5388155 C408.150985,25.5461341 376.482959,15.3528592 344.971286,15.3528592 C309.687885,15.3528592 288.737148,30.039209 277.000735,43.3352913 L277.000134,21.5040389 C291.28361,10.3941064 313.152669,0 344.971286,0 Z M167.030916,0 C198.848787,0 220.716859,10.3936191 235.000643,21.5032576 L235.003099,43.1198859 C223.319986,29.87399 202.436991,15.3528592 167.028714,15.3528592 C135.517041,15.3528592 103.849015,25.5461341 75.9092301,34.5388155 C54.784,41.3380851 34.6739613,47.811874 16.516129,49.4198301 L16.516129,49.4198301 L16.516129,343.183484 C32.3672086,341.504905 50.9775828,335.516267 70.5051527,329.228759 C99.6748387,319.83895 132.737927,309.197372 167.028714,309.197372 C198.848685,309.197372 220.717699,319.59294 235.001366,330.703227 L235.000654,351.199798 C233.903438,350.782964 232.88611,350.138967 232.033996,349.271405 C215.919759,332.86841 194.049101,324.551255 167.028714,324.551255 C135.517041,324.551255 103.849015,334.74453 75.9092301,343.737211 C51.5270194,351.585593 28.495828,359 8.25806452,359 C3.69630968,359 0,355.563007 0,351.322547 L0,351.322547 L0,42.1241515 C0,37.8836918 3.69630968,34.4477219 8.25806452,34.4477219 C25.716714,34.4477219 47.4717591,27.444771 70.5073548,20.0313871 C99.6770409,10.6415785 132.740129,0 167.030916,0 Z" id="Combined-Shape" stroke="#629ADD" stroke-width="13.7634409" fill-rule="nonzero"></path><path d="M503.741935,402.716077 C486.283286,402.716077 464.528241,395.18252 441.494847,387.207432 C412.325161,377.106168 379.260972,365.658288 344.971286,365.658288 C307.707596,365.658288 284.091733,380.994065 270.322787,394.942486 L241.676112,394.941385 C227.907166,380.992963 204.290202,365.658288 167.028714,365.658288 C132.737927,365.658288 99.6748387,377.106168 70.5051527,387.207432 C47.4717591,395.18252 25.716714,402.716077 8.25806452,402.716077 C3.69630968,402.716077 0,406.412387 0,410.974142 C0,415.535897 3.69630968,419.232206 8.25806452,419.232206 C28.495828,419.232206 51.5270194,411.257118 75.9092301,402.814073 C103.849015,393.140026 135.517041,382.174417 167.028714,382.174417 C194.049101,382.174417 215.919759,391.121755 232.033996,408.767587 C233.598624,410.48086 235.811785,411.456413 238.131751,411.456413 L273.866047,411.457514 C276.186013,411.457514 278.399174,410.48086 279.963802,408.768688 C296.078039,391.121755 317.948697,382.174417 344.970185,382.174417 C376.481858,382.174417 408.149884,393.140026 436.089669,402.814073 C460.472981,411.257118 483.504172,419.232206 503.740834,419.232206 C508.302589,419.232206 511.998899,415.535897 511.998899,410.974142 C511.998899,406.412387 508.30369,402.716077 503.741935,402.716077 Z" id="Path" stroke="#629ADD" stroke-width="13.7634409" fill-rule="nonzero"></path></g></g></svg> <span style='margin-left: 2px;'>Browse Journal</span></a></div>`);

      expect(template).toContain("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");

      expect($template.innerText).toContain("View in Context Browse Journal");
    });
  });

  describe("summon model unpaywallArticlePDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadViaUnpaywallWording;
      delete browzine.articlePDFDownloadViaUnpaywallLinkText;
      delete browzine.version;
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadViaUnpaywallWording;
      delete browzine.articlePDFDownloadViaUnpaywallLinkText;
      delete browzine.version;
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

      var unpaywallArticlePDFUrl = summon.getUnpaywallArticlePDFUrl(response);
      var template = summon.unpaywallArticlePDFTemplate(unpaywallArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect(unpaywallArticlePDFUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='margin-right: 4.5px;'>View Now (via Unpaywall)</span><a class='unpaywall-article-pdf-link summonBtn customPrimaryLink' href='http://jaha.org.ro/index.php/JAHA/article/download/142/119' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'><svg name="pdf" alt="pdf icon" class="browzine-pdf-icon" viewBox="0 0 16 16" width="15.5px"><path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path> <path fill="#639add" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path></svg><span style='margin-left: 3px;'>PDF</span></a></div>`);

      expect(template).toContain("http://jaha.org.ro/index.php/JAHA/article/download/142/119");

      expect($template.innerText).toContain("View Now (via Unpaywall) PDF");
    });

    it("should apply the articlePDFDownloadViaUnpaywallWording config property", function() {
      browzine.version = 2;
      browzine.articlePDFDownloadViaUnpaywallWording = "Journal Article PDF";

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

      var unpaywallArticlePDFUrl = summon.getUnpaywallArticlePDFUrl(response);
      var template = summon.unpaywallArticlePDFTemplate(unpaywallArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Journal Article PDF");
    });

    it("should apply the articlePDFDownloadViaUnpaywallLinkText config property", function() {
      browzine.version = "2";
      browzine.articlePDFDownloadViaUnpaywallLinkText = "Download PDF";

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

      var unpaywallArticlePDFUrl = summon.getUnpaywallArticlePDFUrl(response);
      var template = summon.unpaywallArticlePDFTemplate(unpaywallArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (via Unpaywall) Download PDF");
    });

    it("should not apply the articlePDFDownloadViaUnpaywallWording config property", function() {
      delete browzine.version;
      browzine.articlePDFDownloadViaUnpaywallWording = "Journal Article PDF";

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

      var unpaywallArticlePDFUrl = summon.getUnpaywallArticlePDFUrl(response);
      var template = summon.unpaywallArticlePDFTemplate(unpaywallArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (via Unpaywall) PDF");
    });

    it("should not apply the articlePDFDownloadViaUnpaywallLinkText config property", function() {
      delete browzine.version;
      browzine.articlePDFDownloadViaUnpaywallLinkText = "Download PDF";

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

      var unpaywallArticlePDFUrl = summon.getUnpaywallArticlePDFUrl(response);
      var template = summon.unpaywallArticlePDFTemplate(unpaywallArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (via Unpaywall) PDF");
    });
  });

  describe("summon model unpaywallArticleLinkTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleLinkViaUnpaywallWording;
      delete browzine.articleLinkViaUnpaywallLinkText;
      delete browzine.version;
    });

    afterEach(function() {
      delete browzine.articleLinkViaUnpaywallWording;
      delete browzine.articleLinkViaUnpaywallLinkText;
      delete browzine.version;
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

      var unpaywallArticleLinkUrl = summon.getUnpaywallArticleLinkUrl(response);
      var template = summon.unpaywallArticleLinkTemplate(unpaywallArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect(unpaywallArticleLinkUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toContain("https://doi.org/10.1098/rstb.1986.0056");

      expect($template.innerText).toContain("View Now (via Unpaywall) Article Page");
    });

    it("should apply the articleLinkViaUnpaywallWording config property", function() {
      browzine.version = 2;
      browzine.articleLinkViaUnpaywallWording = "Journal Article Link";

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

      var unpaywallArticleLinkUrl = summon.getUnpaywallArticleLinkUrl(response);
      var template = summon.unpaywallArticleLinkTemplate(unpaywallArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Journal Article Link");
    });

    it("should apply the articleLinkViaUnpaywallLinkText config property", function() {
      browzine.version = "2";
      browzine.articleLinkViaUnpaywallLinkText = "Read Article Now (via Unpaywall)";

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

      var unpaywallArticleLinkUrl = summon.getUnpaywallArticleLinkUrl(response);
      var template = summon.unpaywallArticleLinkTemplate(unpaywallArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Read Article Now (via Unpaywall)");
    });

    it("should not apply the articleLinkViaUnpaywallWording config property", function() {
      delete browzine.version;
      browzine.articleLinkViaUnpaywallWording = "Journal Article Link";

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

      var unpaywallArticleLinkUrl = summon.getUnpaywallArticleLinkUrl(response);
      var template = summon.unpaywallArticleLinkTemplate(unpaywallArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (via Unpaywall) Article Page");
    });

    it("should not apply the articleLinkViaUnpaywallLinkText config property", function() {
      delete browzine.version;
      browzine.articleLinkViaUnpaywallLinkText = "Read Article Now (via Unpaywall)";

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

      var unpaywallArticleLinkUrl = summon.getUnpaywallArticleLinkUrl(response);
      var template = summon.unpaywallArticleLinkTemplate(unpaywallArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (via Unpaywall) Article Page");
    });
  });

  describe("summon model unpaywallManuscriptPDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallWording;
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallLinkText;
      delete browzine.version;
    });

    afterEach(function() {
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallWording;
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallLinkText;
      delete browzine.version;
    });

    it("should build an unpaywall article pdf template", function() {
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

      var unpaywallManuscriptArticlePDFUrl = summon.getUnpaywallManuscriptArticlePDFUrl(response);
      var template = summon.unpaywallManuscriptPDFTemplate(unpaywallManuscriptArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect(unpaywallManuscriptArticlePDFUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='margin-right: 4.5px;'>View Now (Accepted Manuscript via Unpaywall)</span><a class='unpaywall-manuscript-article-pdf-link summonBtn customPrimaryLink' href='http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'><svg name="pdf" alt="pdf icon" class="browzine-pdf-icon" viewBox="0 0 16 16" width="15.5px"><path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path> <path fill="#639add" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path></svg><span style='margin-left: 3px;'>PDF</span></a></div>`);

      expect(template).toContain("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");

      expect($template.innerText).toContain("View Now (Accepted Manuscript via Unpaywall) PDF");
    });

    it("should apply the articlePDFDownloadViaUnpaywallWording config property", function() {
      browzine.version = 2;
      browzine.articleAcceptedManuscriptPDFViaUnpaywallWording = "Journal Article PDF";

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

      var unpaywallManuscriptArticlePDFUrl = summon.getUnpaywallManuscriptArticlePDFUrl(response);
      var template = summon.unpaywallManuscriptPDFTemplate(unpaywallManuscriptArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Journal Article PDF");
    });

    it("should apply the articlePDFDownloadViaUnpaywallLinkText config property", function() {
      browzine.version = "2";
      browzine.articleAcceptedManuscriptPDFViaUnpaywallLinkText = "Download PDF";

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

      var unpaywallManuscriptArticlePDFUrl = summon.getUnpaywallManuscriptArticlePDFUrl(response);
      var template = summon.unpaywallManuscriptPDFTemplate(unpaywallManuscriptArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (Accepted Manuscript via Unpaywall) Download PDF");
    });

    it("should not apply the articlePDFDownloadViaUnpaywallWording config property", function() {
      delete browzine.version;
      browzine.articleAcceptedManuscriptPDFViaUnpaywallWording = "Journal Article PDF";

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

      var unpaywallManuscriptArticlePDFUrl = summon.getUnpaywallManuscriptArticlePDFUrl(response);
      var template = summon.unpaywallManuscriptPDFTemplate(unpaywallManuscriptArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (Accepted Manuscript via Unpaywall) PDF");
    });

    it("should not apply the articlePDFDownloadViaUnpaywallLinkText config property", function() {
      delete browzine.version;
      browzine.articleAcceptedManuscriptPDFViaUnpaywallLinkText = "Download PDF";

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

      var unpaywallManuscriptArticlePDFUrl = summon.getUnpaywallManuscriptArticlePDFUrl(response);
      var template = summon.unpaywallManuscriptPDFTemplate(unpaywallManuscriptArticlePDFUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (Accepted Manuscript via Unpaywall) PDF");
    });
  });

  describe("summon model unpaywallManuscriptLinkTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallWording;
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText;
      delete browzine.version;
    });

    afterEach(function() {
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallWording;
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText;
      delete browzine.version;
    });

    it("should build an unpaywall article link template", function() {
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

      var unpaywallManuscriptArticleLinkUrl = summon.getUnpaywallManuscriptArticleLinkUrl(response);
      var template = summon.unpaywallManuscriptLinkTemplate(unpaywallManuscriptArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect(unpaywallManuscriptArticleLinkUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toContain("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");

      expect($template.innerText).toContain("View Now (via Unpaywall) Article Page");
    });

    it("should apply the articleAcceptedManuscriptArticleLinkViaUnpaywallWording config property", function() {
      browzine.version = 2;
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallWording = "Article Link";

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

      var unpaywallManuscriptArticleLinkUrl = summon.getUnpaywallManuscriptArticleLinkUrl(response);
      var template = summon.unpaywallManuscriptLinkTemplate(unpaywallManuscriptArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Article Link");
    });

    it("should apply the articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText config property", function() {
      browzine.version = "2";
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText = "Read Article Now (via Unpaywall)";

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

      var unpaywallManuscriptArticleLinkUrl = summon.getUnpaywallManuscriptArticleLinkUrl(response);
      var template = summon.unpaywallManuscriptLinkTemplate(unpaywallManuscriptArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("Read Article Now (via Unpaywall)");
    });

    it("should not apply the articleAcceptedManuscriptArticleLinkViaUnpaywallWording config property", function() {
      delete browzine.version;
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallWording = "Article Link";

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

      var unpaywallManuscriptArticleLinkUrl = summon.getUnpaywallManuscriptArticleLinkUrl(response);
      var template = summon.unpaywallManuscriptLinkTemplate(unpaywallManuscriptArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (via Unpaywall) Article Page");
    });

    it("should not apply the articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText config property", function() {
      delete browzine.version;
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText = "Read Article Now (via Unpaywall)";

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

      var unpaywallManuscriptArticleLinkUrl = summon.getUnpaywallManuscriptArticleLinkUrl(response);
      var template = summon.unpaywallManuscriptLinkTemplate(unpaywallManuscriptArticleLinkUrl);

      var $template = document.createElement("div");
      $template.innerHTML = template;

      expect($template.innerText).toContain("View Now (via Unpaywall) Article Page");
    });
  });

  describe("summon model isUnpaywallEnabled method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadViaUnpaywallEnabled;
      delete browzine.articleLinkViaUnpaywallEnabled;
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled;
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;
    });

    it("should validate unpaywall is disabled when none of the enabled flags are set", function() {
      expect(summon.isUnpaywallEnabled()).toEqual(undefined);
    });

    it("should validate unpaywall is enabled when all of the enabled flags are set", function() {
      browzine.articlePDFDownloadViaUnpaywallEnabled = true;
      browzine.articleLinkViaUnpaywallEnabled = true;
      browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;

      expect(summon.isUnpaywallEnabled()).toEqual(true);
    });

    it("should validate unpaywall is enabled when only articlePDFDownloadViaUnpaywallEnabled is set", function() {
      browzine.articlePDFDownloadViaUnpaywallEnabled = true;
      expect(summon.isUnpaywallEnabled()).toEqual(true);
    });

    it("should validate unpaywall is enabled when only articleLinkViaUnpaywallEnabled is set", function() {
      browzine.articleLinkViaUnpaywallEnabled = true;
      expect(summon.isUnpaywallEnabled()).toEqual(true);
    });

    it("should validate unpaywall is enabled when only articleAcceptedManuscriptPDFViaUnpaywallEnabled is set", function() {
      browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled = true;
      expect(summon.isUnpaywallEnabled()).toEqual(true);
    });

    it("should validate unpaywall is enabled when only articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled is set", function() {
      browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled = true;
      expect(summon.isUnpaywallEnabled()).toEqual(true);
    });
  });
});
