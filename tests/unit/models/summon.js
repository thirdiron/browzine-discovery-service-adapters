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

  describe("serSol360Core model urlRewrite method >", function() {
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

      expect(summon.getEndpoint(scope)).toContain("articles/doi/10.1136%2Fbmj.h2575?include=journal");
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

  describe("summon model showLibKeyOneLinkView method >", function() {
    beforeEach(function() {
      delete browzine.libKeyOneLinkView;
    });

    afterEach(function() {
      delete browzine.libKeyOneLinkView;
    });

    it("should not enable onelink when configuration property is undefined", function() {
      delete browzine.libKeyOneLinkView;
      expect(summon.showLibKeyOneLinkView()).toEqual(false);
    });

    it("should not enable onelink when configuration property is null", function() {
      browzine.libKeyOneLinkView = null;
      expect(summon.showLibKeyOneLinkView()).toEqual(false);
    });

    it("should enable onelink when configuration property is true", function() {
      browzine.libKeyOneLinkView = true;
      expect(summon.showLibKeyOneLinkView()).toEqual(true);
    });

    it("should disable onelink when configuration property is false", function() {
      browzine.libKeyOneLinkView = false;
      expect(summon.showLibKeyOneLinkView()).toEqual(false);
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
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadWording;
      delete browzine.summonArticlePDFDownloadWording;
      delete browzine.articlePDFDownloadLinkText;
      delete browzine.summonArticlePDFDownloadLinkText;

      delete browzine.articleRetractionWatchTextWording;
      delete browzine.articleRetractionWatchText;
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

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='undefined'>Article PDF </span><a class='browzine-direct-to-pdf-link summonBtn customPrimaryLink' href='https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file' target='_blank' onclick='browzine.summon.transition(event, this)'><svg name="pdf" alt="PDF icon" class="browzine-pdf-icon" viewBox="0 0 16 16" style=""><path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path> <path fill="#639add" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path></svg><span style='margin-left: 3px;'>Download Now</span></a></div>`)
      expect(template).toContain("Article PDF");
      expect(template).toContain("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
      expect(template).toContain("Download Now");
      expect(template).toContain('<svg name="pdf"');
    });

    it("should apply the articlePDFDownloadWording config property", function() {
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

      expect(template).toContain("Journal Article PDF");
    });

    it("should apply the summonArticlePDFDownloadWording config property", function() {
      browzine.summonArticlePDFDownloadWording = "Journal Article PDF 2";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl);

      expect(template).toContain("Journal Article PDF 2");
    });

    it("should apply the articlePDFDownloadLinkText config property", function() {
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

      expect(template).toContain("Download PDF");
    });

    it("should apply the summonArticlePDFDownloadLinkText config property", function() {
      browzine.summonArticlePDFDownloadLinkText = "Download PDF Now";

      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = summon.getData(articleResponse);
      var directToPDFUrl = summon.getDirectToPDFUrl(scope, data);
      var template = summon.directToPDFTemplate(directToPDFUrl);

      expect(template).toContain("Download PDF Now");
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

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='undefined'>Retracted Article </span><a class='browzine-direct-to-pdf-link summonBtn customPrimaryLink' href='https://develop.libkey.io/libraries/1252/10.1155/2019/5730746' target='_blank' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine PDF Icon' class='browzine-pdf-icon' src='https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon-2.svg' style='margin-bottom: 2px; margin-right: 4.5px;' width='17' height='17'/><span style='margin-left: 3px;'>More Info</span></a></div>`);

      expect(template).toContain("Retracted Article");
      expect(template).toContain("https://develop.libkey.io/libraries/1252/10.1155/2019/5730746");
      expect(template).toContain("More");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon-2.svg");
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
    });

    afterEach(function() {
      delete browzine.articleLinkEnabled;
      delete browzine.articleLinkTextWording;
      delete browzine.articleLinkText;
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

      expect(data).toBeDefined();
      expect(articleLinkUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='undefined'>Article Link </span><a class='browzine-article-link summonBtn customPrimaryLink' href='https://develop.browzine.com/libraries/XXX/articles/55134408' target='_blank' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='https://assets.thirdiron.com/images/integrations/browzine-article-link-icon-2.svg' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/> Read Article</a></div>`);
      expect(template).toContain("Article Link");
      expect(template).toContain("https://develop.browzine.com/libraries/XXX/articles/55134408");
      expect(template).toContain("Read Article");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon-2.svg");
    });

    it("should apply the articleLinkTextWording config property", function() {
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

      expect(template).toContain("Article Link");
    });

    it("should apply the articleLinkText config property", function() {
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

      expect(template).toContain("Read Article");
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

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='undefined'>View the Journal </span><a class='browzine-web-link summonBtn customPrimaryLink' href='https://browzine.com/libraries/XXX/journals/10292' target='_blank' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine Book Icon' class='browzine-book-icon' src='https://assets.thirdiron.com/images/integrations/browzine-open-book-icon-2.svg' style='margin-right: 2px; margin-bottom: 1px;' width='16' height='16'/> Browse Now</a></div>`);
      expect(template).toContain("View the Journal");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/10292");
      expect(template).toContain("Browse Now");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon-2.svg");
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

      expect(data).toBeDefined();
      expect(browzineWebLink).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='undefined'>View Complete Issue </span><a class='browzine-web-link summonBtn customPrimaryLink' href='https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575' target='_blank' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine Book Icon' class='browzine-book-icon' src='https://assets.thirdiron.com/images/integrations/browzine-open-book-icon-2.svg' style='margin-right: 2px; margin-bottom: 1px;' width='16' height='16'/> Browse Now</a></div>`);

      expect(template).toContain("View Complete Issue");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
      expect(template).toContain("Browse Now");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon-2.svg");
    });
  });

  describe("summon model unpaywallArticlePDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadViaUnpaywallWording;
      delete browzine.articlePDFDownloadViaUnpaywallLinkText;
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadViaUnpaywallWording;
      delete browzine.articlePDFDownloadViaUnpaywallLinkText;
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

      expect(unpaywallArticlePDFUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='undefined'>Article PDF </span><a class='unpaywall-article-pdf-link summonBtn customPrimaryLink' href='http://jaha.org.ro/index.php/JAHA/article/download/142/119' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'><svg name="pdf" alt="PDF icon" class="browzine-pdf-icon" viewBox="0 0 16 16" style=""><path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path> <path fill="#639add" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path></svg><span style='margin-left: 3px;'>Download Now (via Unpaywall)</span></a></div>`);
      expect(template).toContain("Article PDF");
      expect(template).toContain("http://jaha.org.ro/index.php/JAHA/article/download/142/119");
      expect(template).toContain("Download Now (via Unpaywall)");
      expect(template).toContain('<svg name="pdf"');
    });

    it("should apply the articlePDFDownloadViaUnpaywallWording config property", function() {
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

      expect(template).toContain("Journal Article PDF");
    });

    it("should apply the articlePDFDownloadViaUnpaywallLinkText config property", function() {
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

      expect(template).toContain("Download PDF");
    });
  });

  describe("summon model unpaywallArticleLinkTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleLinkViaUnpaywallWording;
      delete browzine.articleLinkViaUnpaywallLinkText;
    });

    afterEach(function() {
      delete browzine.articleLinkViaUnpaywallWording;
      delete browzine.articleLinkViaUnpaywallLinkText;
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

      expect(unpaywallArticleLinkUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='undefined'>Article Link </span><a class='unpaywall-article-link summonBtn customPrimaryLink' href='https://doi.org/10.1098/rstb.1986.0056' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='https://assets.thirdiron.com/images/integrations/browzine-article-link-icon-2.svg' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/> Read Article (via Unpaywall)</a></div>`);

      expect(template).toContain("Article Link");
      expect(template).toContain("https://doi.org/10.1098/rstb.1986.0056");
      expect(template).toContain("Read Article (via Unpaywall)");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon-2.svg");
    });

    it("should apply the articleLinkViaUnpaywallWording config property", function() {
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

      expect(template).toContain("Journal Article Link");
    });

    it("should apply the articleLinkViaUnpaywallLinkText config property", function() {
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

      expect(template).toContain("Read Article Now (via Unpaywall)");
    });
  });

  describe("summon model unpaywallManuscriptPDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallWording;
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallLinkText;
    });

    afterEach(function() {
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallWording;
      delete browzine.articleAcceptedManuscriptPDFViaUnpaywallLinkText;
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

      expect(unpaywallManuscriptArticlePDFUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='undefined'>Article PDF </span><a class='unpaywall-manuscript-article-pdf-link summonBtn customPrimaryLink' href='http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'><svg name="pdf" alt="PDF icon" class="browzine-pdf-icon" viewBox="0 0 16 16" style=""><path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path> <path fill="#639add" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path></svg><span style='margin-left: 3px;'>Download Now (Accepted Manuscript via Unpaywall)</span></a></div>`);

      expect(template).toContain("Article PDF");
      expect(template).toContain("http://diposit.ub.edu/dspace/bitstream/2445/147225/1/681991.pdf");
      expect(template).toContain("Download Now (Accepted Manuscript via Unpaywall)");
      expect(template).toContain('<svg name="pdf"');
    });

    it("should apply the articlePDFDownloadViaUnpaywallWording config property", function() {
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

      expect(template).toContain("Journal Article PDF");
    });

    it("should apply the articlePDFDownloadViaUnpaywallLinkText config property", function() {
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

      expect(template).toContain("Download PDF");
      expect(template).not.toContain("Download PDF (Accepted Manuscript via Unpaywall)");
    });
  });

  describe("summon model unpaywallManuscriptLinkTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallWording;
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText;
    });

    afterEach(function() {
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallWording;
      delete browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText;
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

      expect(unpaywallManuscriptArticleLinkUrl).toBeDefined();

      expect(template).toBeDefined();

      expect(template).toEqual(`<div class='browzine'><span class='contentType' style='undefined'>Article Link </span><a class='unpaywall-manuscript-article-link summonBtn customPrimaryLink' href='https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='https://assets.thirdiron.com/images/integrations/browzine-article-link-icon-2.svg' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/> Read Article (Accepted Manuscript via Unpaywall)</a></div>`);

      expect(template).toContain("Article Link");
      expect(template).toContain("https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6041472");
      expect(template).toContain("Read Article (Accepted Manuscript via Unpaywall)");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon-2.svg");
    });

    it("should apply the articleAcceptedManuscriptArticleLinkViaUnpaywallWording config property", function() {
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

      expect(template).toContain("Article Link");
    });

    it("should apply the articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText config property", function() {
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

      expect(template).toContain("Read Article Now (via Unpaywall)");
      expect(template).not.toContain("Read Article (Accepted Manuscript via Unpaywall)");
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
