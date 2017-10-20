describe("Search Model >", function() {
  var search = {}, journalResponse = {}, articleResponse = {};

  beforeEach(function() {
    search = browzine.search;

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
    };
  });

  afterEach(function() {

  });

  it("search model should exist", function() {
    expect(search).toBeDefined();
  });

  describe("search model getScope method >", function() {
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

      var scope = search.getScope(documentSummary);

      expect(scope).toBeDefined();
      expect(scope.document).toBeDefined();
      expect(scope.document.content_type).toBeDefined();
      expect(scope.document.issns).toBeDefined();

      expect(scope.document.content_type).toEqual("Journal");
      expect(scope.document.issns).toEqual(["0028-4793"]);
    });
  });

  describe("search model shouldEnhance method >", function() {
    it("should not enhance a search result without a document", function() {
      var scope = {};

      expect(search.shouldEnhance(scope)).toEqual(false);
    });

    it("should enhance a journal search result with an issn", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0028-4793"]
        }
      };

      expect(search.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance a journal search result with a lowercase content type", function() {
      var scope = {
        document: {
          content_type: "journal",
          issns: ["0028-4793"]
        }
      };

      expect(search.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance an eJournal search result with an issn", function() {
      var scope = {
        document: {
          content_type: "eJournal",
          issns: ["0028-479X"]
        }
      };

      expect(search.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance an article search result with a doi", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(search.shouldEnhance(scope)).toEqual(true);
    });

    it("should enhance an article search result with a lowercase content type", function() {
      var scope = {
        document: {
          content_type: "journal article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(search.shouldEnhance(scope)).toEqual(true);
    });

    it("should not enhance a journal search result without an issn or eissn", function() {
      var scope = {
        document: {
          content_type: "Journal"
        }
      };

      expect(search.shouldEnhance(scope)).toEqual(false);
    });

    it("should not enhance an article search result without a doi", function() {
      var scope = {
        document: {
          content_type: "Journal Article"
        }
      };

      expect(search.shouldEnhance(scope)).toEqual(false);
    });

    it("should not enhance a journal search result without a content type", function() {
      var scope = {
        document: {
          issns: ["0028-4793"]
        }
      };

      expect(search.shouldEnhance(scope)).toEqual(false);
    });

    it("should not enhance an article search result without a content type", function() {
      var scope = {
        document: {
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(search.shouldEnhance(scope)).toEqual(false);
    });
  });

  describe("search model getEndpoint method >", function() {
    it("should build a journal endpoint for a journal search result", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0028-4793"]
        }
      };

      expect(search.getEndpoint(scope)).toContain("search?issns=00284793");
    });

    it("should select the issn over the eissn when a journal search result includes both", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0028-4793"],
          eissns: ["0082-3974"]
        }
      };

      expect(search.getEndpoint(scope)).toContain("search?issns=00284793");
    });

    it("should select the eissn when the journal search result has no issn", function() {
      var scope = {
        document: {
          content_type: "Journal",
          eissns: ["0082-3974"]
        }
      };

      expect(search.getEndpoint(scope)).toContain("search?issns=00823974");
    });

    it("should build an article endpoint for an article search result", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(search.getEndpoint(scope)).toContain("articles/doi/10.1136%2Fbmj.h2575");
    });

    it("should build an article endpoint for an article search result and include its journal", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      expect(search.getEndpoint(scope)).toContain("articles/doi/10.1136%2Fbmj.h2575?include=journal");
    });
  });

  describe("search model getBrowZineWebLink method >", function() {
    it("should include a browzineWebLink in the BrowZine API response for a journal", function() {
      var data = search.getData(journalResponse);
      expect(data).toBeDefined();
      expect(search.getBrowZineWebLink(data)).toEqual("https://browzine.com/libraries/XXX/journals/10292");
    });

    it("should include a browzineWebLink in the BrowZine API response for an article", function() {
      var data = search.getData(articleResponse);
      expect(data).toBeDefined();
      expect(search.getBrowZineWebLink(data)).toEqual("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
    });
  });

  describe("search model getCoverImageUrl method >", function() {
    it("should include a coverImageUrl in the BrowZine API response for a journal", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0082-3974"]
        }
      };

      var data = search.getData(journalResponse);
      var journal = search.getIncludedJournal(journalResponse);

      expect(data).toBeDefined();
      expect(journal).toBeNull();

      expect(search.getCoverImageUrl(scope, data, journal)).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
    });

    it("should include a coverImageUrl in the BrowZine API response for an article", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = search.getData(articleResponse);
      var journal = search.getIncludedJournal(articleResponse);

      expect(data).toBeDefined();
      expect(journal).toBeDefined();

      expect(search.getCoverImageUrl(scope, data, journal)).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
    });
  });

  describe("search model buildTemplate method >", function() {
    it("should build an enhancement template for journal search results", function() {
      var scope = {
        document: {
          content_type: "Journal",
          issns: ["0082-3974"]
        }
      };

      var data = search.getData(journalResponse);
      var browzineWebLink = search.getBrowZineWebLink(data);
      var template = search.buildTemplate(scope, browzineWebLink);

      expect(data).toBeDefined();
      expect(browzineWebLink).toBeDefined();
      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine'>View the Journal: <a class='browzine-web-link' href='https://browzine.com/libraries/XXX/journals/10292' target='_blank' style='text-decoration: underline; color: #333;'>Browse Now</a> <img class='browzine-book-icon' src='https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png'/></div>");
      expect(template).toContain("View the Journal");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/10292");
      expect(template).toContain("Browse Now");
      expect(template).toContain("https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png");
      expect(template).toContain("text-decoration: underline;");
      expect(template).toContain("color: #333;");
    });

    it("should build an enhancement template for article search results", function() {
      var scope = {
        document: {
          content_type: "Journal Article",
          dois: ["10.1136/bmj.h2575"]
        }
      };

      var data = search.getData(articleResponse);
      var browzineWebLink = search.getBrowZineWebLink(data);
      var template = search.buildTemplate(scope, browzineWebLink);

      expect(data).toBeDefined();
      expect(browzineWebLink).toBeDefined();
      expect(template).toBeDefined();

      expect(template).toEqual("<div class='browzine'>View Complete Issue: <a class='browzine-web-link' href='https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575' target='_blank' style='text-decoration: underline; color: #333;'>Browse Now</a> <img class='browzine-book-icon' src='https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png'/></div>");
      expect(template).toContain("View Complete Issue");
      expect(template).toContain("https://browzine.com/libraries/XXX/journals/18126/issues/7764583?showArticleInContext=doi:10.1136/bmj.h2575");
      expect(template).toContain("Browse Now");
      expect(template).toContain("https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png");
      expect(template).toContain("text-decoration: underline;");
      expect(template).toContain("color: #333;");
    });
  });
});
