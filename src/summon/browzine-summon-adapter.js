browzine.summon = (function() {
  var libraryId = browzine.libraryId;
  var api = libraryIdOverride(urlRewrite(browzine.api));
  var apiKey = browzine.apiKey;

  function urlRewrite(url) {
    if(!url) {
      return;
    }

    return url.indexOf("public-api.thirdiron.com") > -1 ? url : url.replace("api.thirdiron.com", "public-api.thirdiron.com");
  };

  function libraryIdOverride(url) {
    var override = url;
    var libraryId = browzine.libraryId;

    if(libraryId) {
      var baseUrl = "https://public-api.thirdiron.com/public/v1/libraries/{libraryId}";
      override = baseUrl.replace(/{libraryId}/g, libraryId);
    }

    return override;
  };

  function isArticle(scope) {
    var result = false;

    if(scope.document) {
      if(scope.document.content_type) {
        var contentType = scope.document.content_type.trim().toLowerCase();
        if(contentType === "journal article") {
          result = true;
        }
      }
    }

    return result;
  };

  function isJournal(scope) {
    var result = false;

    if(scope.document) {
      if(scope.document.content_type) {
        var contentType = scope.document.content_type.trim().toLowerCase();
        if(contentType === "journal" || contentType === "ejournal") {
          result = true;
        }
      }
    }

    return result;
  };

  function getIssn(scope) {
    var issn = "";

    if(scope.document) {
      if(scope.document.issns) {
        issn = scope.document.issns[0].trim().replace("-", "");
      }

      if(scope.document.eissns && !issn) {
        issn = scope.document.eissns[0].trim().replace("-", "");
      }
    }

    return encodeURIComponent(issn);
  };

  function getDoi(scope) {
    var doi = "";

    if(scope.document) {
      if(scope.document.dois) {
        doi = scope.document.dois[0].trim();
      }
    }

    return encodeURIComponent(doi);
  };

  function getEndpoint(scope) {
    var endpoint = "";

    if(isJournal(scope) && getIssn(scope)) {
      var issn = getIssn(scope);
      endpoint = api + "/search?issns=" + issn;
    }

    if(isArticle(scope) && getDoi(scope)) {
      var doi = getDoi(scope);
      endpoint = api + "/articles/doi/" + doi + "?include=journal";
    }

    if(isArticle(scope) && !getDoi(scope) && getIssn(scope)) {
      var issn = getIssn(scope);
      endpoint = api + "/search?issns=" + issn;
    }

    endpoint += "&access_token=" + apiKey;

    return endpoint;
  };

  function getData(response) {
    return Array.isArray(response.data) ? response.data[0] : response.data;
  };

  function getIncludedJournal(response) {
    var journal = null;

    if(response.included) {
      journal = Array.isArray(response.included) ? response.included[0] : response.included;
    }

    return journal;
  };

  function getBrowZineWebLink(data) {
    var browzineWebLink = null;

    if(data && data.browzineWebLink) {
      browzineWebLink = data.browzineWebLink;
    }

    return browzineWebLink;
  };

  function getCoverImageUrl(scope, data, journal) {
    var coverImageUrl = null;

    if(isJournal(scope) && getIssn(scope)) {
      if(data && data.coverImageUrl) {
        coverImageUrl = data.coverImageUrl;
      }
    }

    if(isArticle(scope) && getDoi(scope)) {
      if(journal && journal.coverImageUrl) {
        coverImageUrl = journal.coverImageUrl;
      }
    }

    if(isArticle(scope) && !getDoi(scope) && getIssn(scope)) {
      if(data && data.coverImageUrl) {
        coverImageUrl = data.coverImageUrl;
      }
    }

    return coverImageUrl;
  };

  function getBrowZineEnabled(scope, data, journal) {
    var browzineEnabled = false;

    if(isJournal(scope)) {
      if(data && data.browzineEnabled) {
        browzineEnabled = data.browzineEnabled;
      }
    }

    if(isArticle(scope)) {
      if(journal && journal.browzineEnabled) {
        browzineEnabled = journal.browzineEnabled;
      }
    }

    return browzineEnabled;
  };

  function isDefaultCoverImage(coverImageUrl) {
    var defaultCoverImage = false;

    if(coverImageUrl && coverImageUrl.toLowerCase().indexOf("default") > -1) {
      defaultCoverImage = true;
    }

    return defaultCoverImage;
  };

  function getDirectToPDFUrl(scope, data) {
    var directToPDFUrl = null;

    if(isArticle(scope)) {
      if(data.fullTextFile) {
        directToPDFUrl = data.fullTextFile;
      }
    }

    return directToPDFUrl;
  };

  function getArticleLinkUrl(scope, data) {
    var articleLinkUrl = null;

    if(isArticle(scope)) {
      if(data.contentLocation) {
        articleLinkUrl = data.contentLocation;
      }
    }

    return articleLinkUrl;
  };

  function showJournalCoverImages() {
    var featureEnabled = false;
    var config = browzine.journalCoverImagesEnabled;

    if(typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showJournalBrowZineWebLinkText() {
    var featureEnabled = false;
    var config = browzine.journalBrowZineWebLinkTextEnabled;

    if(typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showArticleBrowZineWebLinkText() {
    var featureEnabled = false;
    var config = browzine.articleBrowZineWebLinkTextEnabled;

    if(typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showDirectToPDFLink() {
    var featureEnabled = false;
    var config = browzine.articlePDFDownloadLinkEnabled;
    var prefixConfig = browzine.summonArticlePDFDownloadLinkEnabled;

    if(typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    if(typeof prefixConfig !== "undefined" && prefixConfig !== null && prefixConfig === false) {
      featureEnabled = false;
    }

    return featureEnabled;
  };

  function showArticleLink() {
    var featureEnabled = false;
    var config = browzine.articleLinkEnabled;

    if(config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showPrintRecords() {
    var featureEnabled = false;
    var config = browzine.printRecordsIntegrationEnabled;

    if(typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function isFiltered(scope) {
    var result = false;

    if(scope && scope.document) {
      if(scope.document.is_print && !showPrintRecords()) {
        result = true;
      }
    }

    return result;
  };

  function directToPDFTemplate(directToPDFUrl) {
    var pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg";
    var articlePDFDownloadWording = browzine.articlePDFDownloadWording || browzine.summonArticlePDFDownloadWording || "Article PDF";
    var articlePDFDownloadLinkText = browzine.articlePDFDownloadLinkText || browzine.summonArticlePDFDownloadLinkText || "Download Now";

    var template = "<div class='browzine'>" +
                     "{articlePDFDownloadWording}: <a class='browzine-direct-to-pdf-link' href='{directToPDFUrl}' target='_blank' style='text-decoration: underline; color: #333;'>{articlePDFDownloadLinkText}</a> <img alt='BrowZine PDF Icon' class='browzine-pdf-icon' src='{pdfIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/>" +
                   "</div>";

    template = template.replace(/{articlePDFDownloadWording}/g, articlePDFDownloadWording);
    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);

    return template;
  };

  function articleLinkTemplate(articleLinkUrl) {
    var linkIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg";
    var articleLinkTextWording = browzine.articleLinkTextWording || "Article Link";
    var articleLinkText = browzine.articleLinkText || "Read Article";

    var template = "<div class='browzine'>" +
                     "{articleLinkTextWording}: <a class='browzine-article-link' href='{articleLinkUrl}' target='_blank' style='text-decoration: underline; color: #333;'>{articleLinkText}</a> <img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='{linkIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/>" +
                   "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon);

    return template;
  };

  function browzineWebLinkTemplate(scope, browzineWebLink) {
    var wording = "";
    var browzineWebLinkText = "";
    var bookIcon = "https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg";

    if(isJournal(scope)) {
      wording = browzine.journalWording || browzine.summonJournalWording || "View the Journal";
      browzineWebLinkText = browzine.journalBrowZineWebLinkText || browzine.summonJournalBrowZineWebLinkText || "Browse Now";
    }

    if(isArticle(scope)) {
      wording = browzine.articleWording || browzine.summonArticleWording || "View Complete Issue";
      browzineWebLinkText = browzine.articleBrowZineWebLinkText || browzine.summonArticleBrowZineWebLinkText || "Browse Now";
    }

    var template = "<div class='browzine'>" +
                     "{wording}: <a class='browzine-web-link' href='{browzineWebLink}' target='_blank' style='text-decoration: underline; color: #333;'>{browzineWebLinkText}</a> <img alt='BrowZine Book Icon' class='browzine-book-icon' src='{bookIcon}' style='margin-bottom: 1px;' width='16' height='16'/>" +
                   "</div>";

    template = template.replace(/{wording}/g, wording);
    template = template.replace(/{browzineWebLink}/g, browzineWebLink);
    template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
    template = template.replace(/{bookIcon}/g, bookIcon);

    return template;
  };

  function getScope(documentSummary) {
    return angular.element(documentSummary).scope();
  };

  function shouldEnhance(scope) {
    var validation = false;

    if(!isFiltered(scope)) {
      if(isJournal(scope) && getIssn(scope)) {
        validation = true;
      }

      if(isArticle(scope) && getDoi(scope)) {
        validation = true;
      }

      if(isArticle(scope) && !getDoi(scope) && getIssn(scope)) {
        validation = true;
      }
    }

    return validation;
  };

  function adapter(documentSummary) {
    var scope = getScope(documentSummary);

    if(!shouldEnhance(scope)) {
      return;
    }

    var endpoint = getEndpoint(scope);

    $.getJSON(endpoint, function(response) {
      var data = getData(response);
      var journal = getIncludedJournal(response);

      var browzineWebLink = getBrowZineWebLink(data);
      var coverImageUrl = getCoverImageUrl(scope, data, journal);
      var browzineEnabled = getBrowZineEnabled(scope, data, journal);
      var defaultCoverImage = isDefaultCoverImage(coverImageUrl);
      var directToPDFUrl = getDirectToPDFUrl(scope, data);
      var articleLinkUrl = getArticleLinkUrl(scope, data);

      if(directToPDFUrl && isArticle(scope) && showDirectToPDFLink() && browzineEnabled) {
        var template = directToPDFTemplate(directToPDFUrl);
        $(documentSummary).find(".docFooter .row:eq(0)").prepend(template);
      }

      if(!directToPDFUrl && articleLinkUrl && isArticle(scope) && showDirectToPDFLink() && showArticleLink() && browzineEnabled) {
        var template = articleLinkTemplate(articleLinkUrl);
        $(documentSummary).find(".docFooter .row:eq(0)").prepend(template);
      }

      if(browzineWebLink && browzineEnabled && isJournal(scope) && showJournalBrowZineWebLinkText()) {
        var template = browzineWebLinkTemplate(scope, browzineWebLink);
        $(documentSummary).find(".docFooter .row:eq(0)").append(template);
      }

      if(browzineWebLink && browzineEnabled && isArticle(scope) && showArticleBrowZineWebLinkText()) {
        var template = browzineWebLinkTemplate(scope, browzineWebLink);
        $(documentSummary).find(".docFooter .row:eq(0)").append(template);
      }

      if(coverImageUrl && !defaultCoverImage && showJournalCoverImages()) {
        $(documentSummary).find(".coverImage img").attr("src", coverImageUrl).attr("ng-src", coverImageUrl).css("box-shadow", "1px 1px 2px #ccc");
      }
    });
  };

  return {
    adapter: adapter,
    getScope: getScope,
    shouldEnhance: shouldEnhance,
    getEndpoint: getEndpoint,
    getData: getData,
    getIncludedJournal: getIncludedJournal,
    getBrowZineWebLink: getBrowZineWebLink,
    getCoverImageUrl: getCoverImageUrl,
    getBrowZineEnabled: getBrowZineEnabled,
    isDefaultCoverImage: isDefaultCoverImage,
    getDirectToPDFUrl: getDirectToPDFUrl,
    getArticleLinkUrl: getArticleLinkUrl,
    showJournalCoverImages: showJournalCoverImages,
    showJournalBrowZineWebLinkText: showJournalBrowZineWebLinkText,
    showArticleBrowZineWebLinkText: showArticleBrowZineWebLinkText,
    showDirectToPDFLink: showDirectToPDFLink,
    showArticleLink: showArticleLink,
    showPrintRecords: showPrintRecords,
    isFiltered: isFiltered,
    browzineWebLinkTemplate: browzineWebLinkTemplate,
    directToPDFTemplate: directToPDFTemplate,
    articleLinkTemplate: articleLinkTemplate,
    urlRewrite: urlRewrite,
    libraryIdOverride: libraryIdOverride,
  };
}());

$(function() {
  if(!browzine) {
    return;
  }

  var results = document.querySelector("#results") || document;
  var documentSummaries = results.querySelectorAll(".documentSummary");

  Array.prototype.forEach.call(documentSummaries, function(documentSummary) {
    browzine.summon.adapter(documentSummary);
  });

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.attributeName === "document-summary") {
        var documentSummary = mutation.target;
        browzine.summon.adapter(documentSummary);
      }
    });
  });

  observer.observe(results, {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  });
});
