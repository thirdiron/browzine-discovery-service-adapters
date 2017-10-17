describe("Search Model", function() {
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

  it("should detect whether a journal search result can be enhanced", function() {
    var scope = {
      document: {
        content_type: "Journal",
        issns: ["0028-4793"]
      }
    };

    expect(search.shouldEnhance(scope)).toEqual(true);
  });

  it("should detect whether a eJournal search result can be enhanced", function() {
    var scope = {
      document: {
        content_type: "eJournal",
        issns: ["0028-479X"]
      }
    };

    expect(search.shouldEnhance(scope)).toEqual(true);
  });

  it("should detect whether an article search result can be enhanced", function() {
    var scope = {
      document: {
        content_type: "Journal Article",
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

  it("should include a coverImageUrl in the BrowZine API response for a journal", function() {
    var data = search.getData(journalResponse);
    expect(data).toBeDefined();
    expect(search.getCoverImageUrl(data, journalResponse)).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
  });

  it("should include a coverImageUrl in the BrowZine API response for an article", function() {
    var data = search.getData(articleResponse);
    expect(data).toBeDefined();
    expect(search.getCoverImageUrl(data, articleResponse)).toEqual("https://assets.thirdiron.com/images/covers/0959-8138.png");
  });

  it("should not build a coverImageUrl when the BrowZine API response is missing the journal data type", function() {
    var data = search.getData(journalResponse);
    delete data.type;
    expect(data).toBeDefined();
    expect(search.getCoverImageUrl(data, journalResponse)).toBeNull();
  });

  it("should not build a coverImageUrl when the BrowZine API response is missing the article data type", function() {
    var data = search.getData(articleResponse);
    delete data.type;
    expect(data).toBeDefined();
    expect(search.getCoverImageUrl(data, journalResponse)).toBeNull();
  });

  it("should build an enhancement template for journal search results", function() {
    var data = search.getData(journalResponse);
    var browzineWebLink = search.getBrowZineWebLink(data);
    var template = search.buildTemplate(data, browzineWebLink);

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
});
