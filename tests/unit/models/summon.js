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
    };
  });

  afterEach(function() {

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

    it("should not show article link by default when configuration property is undefined or null", function() {
      expect(summon.showArticleLink()).toEqual(false);
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

  describe("summon model directToPDFTemplate method >", function() {
    beforeEach(function() {
      delete browzine.articlePDFDownloadWording;
      delete browzine.summonArticlePDFDownloadWording;
      delete browzine.articlePDFDownloadLinkText;
      delete browzine.summonArticlePDFDownloadLinkText;
    });

    afterEach(function() {
      delete browzine.articlePDFDownloadWording;
      delete browzine.summonArticlePDFDownloadWording;
      delete browzine.articlePDFDownloadLinkText;
      delete browzine.summonArticlePDFDownloadLinkText;
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

      expect(template).toEqual("<div class='browzine'>Article PDF: <a class='browzine-direct-to-pdf-link' href='https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file' target='_blank' style='text-decoration: underline; color: #333;'>Download Now</a> <img alt='BrowZine PDF Icon' class='browzine-pdf-icon' src='https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/></div>");

      expect(template).toContain("Article PDF");
      expect(template).toContain("https://develop.browzine.com/libraries/XXX/articles/55134408/full-text-file");
      expect(template).toContain("Download Now");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg");

      expect(template).toContain("text-decoration: underline;");
      expect(template).toContain("color: #333;");
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
  });

  describe("summon model directToPDFTemplate method >", function() {
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

      expect(template).toEqual("<div class='browzine'>Article Link: <a class='browzine-article-link' href='https://develop.browzine.com/libraries/XXX/articles/55134408' target='_blank' style='text-decoration: underline; color: #333;'>Read Article</a> <img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/></div>");

      expect(template).toContain("Article Link");
      expect(template).toContain("https://develop.browzine.com/libraries/XXX/articles/55134408");
      expect(template).toContain("Read Article");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg");

      expect(template).toContain("text-decoration: underline;");
      expect(template).toContain("color: #333;");
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

      expect(template).toEqual("<div class='browzine'>View the Journal: <a class='browzine-web-link' href='https://browzine.com/libraries/XXX/journals/10292' target='_blank' style='text-decoration: underline; color: #333;'>Browse Now</a> <img alt='BrowZine Book Icon' class='browzine-book-icon' src='https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg' style='margin-bottom: 1px;' width='16' height='16'/></div>");
      expect(template).toContain("View the Journal");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/10292");
      expect(template).toContain("Browse Now");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");
      expect(template).toContain("text-decoration: underline;");
      expect(template).toContain("color: #333;");
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

      expect(template).toEqual("<div class='browzine'>View Complete Issue: <a class='browzine-web-link' href='https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575' target='_blank' style='text-decoration: underline; color: #333;'>Browse Now</a> <img alt='BrowZine Book Icon' class='browzine-book-icon' src='https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg' style='margin-bottom: 1px;' width='16' height='16'/></div>");

      expect(template).toContain("View Complete Issue");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
      expect(template).toContain("Browse Now");
      expect(template).toContain("https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg");

      expect(template).toContain("text-decoration: underline;");
      expect(template).toContain("color: #333;");
    });
  });
});
