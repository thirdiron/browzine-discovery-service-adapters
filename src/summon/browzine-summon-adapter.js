browzine.summon = (function() {
  var libraryId = browzine.libraryId;
  var api = libraryIdOverride(urlRewrite(browzine.api));
  var apiKey = browzine.apiKey;

  function urlRewrite(url) {
    if (!url) {
      return;
    }

    return url.indexOf("public-api.thirdiron.com") > -1 ? url : url.replace("api.thirdiron.com", "public-api.thirdiron.com");
  };

  function libraryIdOverride(url) {
    var override = url;
    var libraryId = browzine.libraryId;

    if (libraryId) {
      var baseUrl = "https://public-api.thirdiron.com/public/v1/libraries/{libraryId}";
      override = baseUrl.replace(/{libraryId}/g, libraryId);
    }

    return override;
  };

  function isArticle(scope) {
    var result = false;

    if (scope.document) {
      if (scope.document.content_type) {
        var contentType = scope.document.content_type.trim().toLowerCase();
        if (contentType === "journal article") {
          result = true;
        }
      }
    }

    return result;
  };

  function isJournal(scope) {
    var result = false;

    if (scope.document) {
      if (scope.document.content_type) {
        var contentType = scope.document.content_type.trim().toLowerCase();
        if (contentType === "journal" || contentType === "ejournal") {
          result = true;
        }
      }
    }

    return result;
  };

  function getIssn(scope) {
    var issn = "";

    if (scope.document) {
      if (scope.document.issns) {
        if (scope.document.issns.length > 1) {
          issn = scope.document.issns.filter(function(issn) {
            return (issn.length < 10) && (/[\S]{4}\-[\S]{4}/.test(issn));
          }).join(",").trim().replace(/-/g, "");
        } else {
          if (scope.document.issns[0]) {
            issn = scope.document.issns[0].trim().replace("-", "");
          }
        }
      }

      if (scope.document.eissns && !issn) {
        if (scope.document.eissns.length > 1) {
          issn = scope.document.eissns.filter(function(issn) {
            return (issn.length < 10) && (/[\S]{4}\-[\S]{4}/.test(issn));
          }).join(",").trim().replace(/-/g, "");
        } else {
          if (scope.document.eissns[0]) {
            issn = scope.document.eissns[0].trim().replace("-", "");
          }
        }
      }
    }

    return encodeURIComponent(issn);
  };

  function getDoi(scope) {
    var doi = "";

    if (scope.document) {
      if (scope.document.dois && scope.document.dois[0]) {
        doi = scope.document.dois[0].trim();
      }
    }

    return encodeURIComponent(doi);
  };

  function getEndpoint(scope) {
    var endpoint = "";

    if (isJournal(scope) && getIssn(scope)) {
      var issn = getIssn(scope);
      endpoint = api + "/search?issns=" + issn;
    }

    if (isArticle(scope) && getDoi(scope)) {
      var doi = getDoi(scope);
      endpoint = api + "/articles/doi/" + doi + "?include=journal,library";
    }

    if (isArticle(scope) && !getDoi(scope) && getIssn(scope)) {
      var issn = getIssn(scope);
      endpoint = api + "/search?issns=" + issn;
    }

    endpoint += "&access_token=" + apiKey;

    return endpoint;
  };

  function getUnpaywallEndpoint(scope) {
    var endpoint;
    var email = browzine.unpaywallEmailAddressKey;

    if (isArticle(scope) && getDoi(scope) && email) {
      var doi = getDoi(scope);
      endpoint = "https://api.unpaywall.org/v2/" + doi + "?email=" + email;
    }

    return endpoint;
  };

  function getData(response) {
    var data = {};

    if (Array.isArray(response.data)) {
      data = response.data.filter(function(journal) {
        return journal.browzineEnabled === true;
      }).pop();
    } else {
      data = response.data;
    }

    return data;
  };

  function getIncludedJournal(response) {
    var journal = null;

    if (response.included) {
      journal = Array.isArray(response.included) ? response.included[0] : response.included;
    }

    return journal;
  };

  function getIncludedLibrary(response) {
    var library = null;

    if (response.included && Array.isArray(response.included)) {
      library = response.included.filter(function(obj) {
        return obj.type === "libraries";
      }).pop();
    }

    return library;
  };

  function getBrowZineWebLink(data) {
    var browzineWebLink = null;

    if (data && data.browzineWebLink) {
      browzineWebLink = data.browzineWebLink;
    }

    return browzineWebLink;
  };

  function getCoverImageUrl(scope, data, journal) {
    var coverImageUrl = null;

    if (isJournal(scope) && getIssn(scope)) {
      if (data && data.coverImageUrl) {
        coverImageUrl = data.coverImageUrl;
      }
    }

    if (isArticle(scope) && getDoi(scope)) {
      if (journal && journal.coverImageUrl) {
        coverImageUrl = journal.coverImageUrl;
      }
    }

    if (isArticle(scope) && !getDoi(scope) && getIssn(scope)) {
      if (data && data.coverImageUrl) {
        coverImageUrl = data.coverImageUrl;
      }
    }

    return coverImageUrl;
  };

  function getBrowZineEnabled(scope, data, journal) {
    var browzineEnabled = false;

    if (isJournal(scope)) {
      if (data && data.browzineEnabled) {
        browzineEnabled = data.browzineEnabled;
      }
    }

    if (isArticle(scope)) {
      if (journal && journal.browzineEnabled) {
        browzineEnabled = journal.browzineEnabled;
      }
    }

    return browzineEnabled;
  };

  function isDefaultCoverImage(coverImageUrl) {
    var defaultCoverImage = false;

    if (coverImageUrl && coverImageUrl.toLowerCase().indexOf("default") > -1) {
      defaultCoverImage = true;
    }

    return defaultCoverImage;
  };

  function getDirectToPDFUrl(scope, data) {
    var directToPDFUrl = null;

    if (isArticle(scope)) {
      if (data && data.fullTextFile) {
        directToPDFUrl = data.fullTextFile;
      }
    }

    return directToPDFUrl;
  };

  function getArticleLinkUrl(scope, data) {
    var articleLinkUrl = null;

    if (isArticle(scope)) {
      if (data && data.contentLocation) {
        articleLinkUrl = data.contentLocation;
      }
    }

    return articleLinkUrl;
  };

  function getArticleRetractionUrl(scope, data) {
    var articleRetractionUrl = null;

    if (isArticle(scope)) {
      if (data && data.retractionNoticeUrl) {
        articleRetractionUrl = data.retractionNoticeUrl;
      }
    }

    return articleRetractionUrl;
  };

  function isTrustedRepository(response) {
    var validation = false;

    if (response.best_oa_location && response.best_oa_location.url_for_pdf) {
      if (response.best_oa_location.url_for_pdf.indexOf('nih.gov') > -1 || response.best_oa_location.url_for_pdf.indexOf('europepmc.org') > -1) {
        validation = true;
      }
    }

    return validation;
  };

  function isUnknownVersion(response) {
    var validation = false;

    if (response.best_oa_location) {
      if (!response.best_oa_location.version || response.best_oa_location.version === '') {
        validation = true;
      }
    }

    return validation;
  };

  function getUnpaywallArticlePDFUrl(response) {
    var url;

    if (response.best_oa_location) {
      if (response.best_oa_location.host_type === "publisher" || response.best_oa_location.host_type === "repository") {
        if (response.best_oa_location.version === "publishedVersion" || (isUnknownVersion(response) && isTrustedRepository(response))) {
          if (response.best_oa_location.url_for_pdf) {
            url = response.best_oa_location.url_for_pdf;
          }
        }
      }
    }

    return url;
  };

  function getUnpaywallArticleLinkUrl(response) {
    var url;

    if (response.best_oa_location) {
      if (response.best_oa_location.host_type === "publisher" || response.best_oa_location.host_type === "repository") {
        if (response.best_oa_location.version === "publishedVersion") {
          if (!response.best_oa_location.url_for_pdf) {
            url = response.best_oa_location.url_for_landing_page;
          }
        }
      }
    }

    return url;
  };

  function getUnpaywallManuscriptArticlePDFUrl(response) {
    var url;

    if (response.best_oa_location) {
      if (response.best_oa_location.host_type === "repository") {
        if (response.best_oa_location.version === "acceptedVersion" || (isUnknownVersion(response) && !isTrustedRepository(response))) {
          if (response.best_oa_location.url_for_pdf) {
            url = response.best_oa_location.url_for_pdf;
          }
        }
      }
    }

    return url;
  };

  function getUnpaywallManuscriptArticleLinkUrl(response) {
    var url;

    if (response.best_oa_location) {
      if (response.best_oa_location.host_type === "repository") {
        if (response.best_oa_location.version === "acceptedVersion") {
          if (!response.best_oa_location.url_for_pdf) {
            url = response.best_oa_location.url_for_landing_page;
          }
        }
      }
    }

    return url;
  };

  function showJournalCoverImages() {
    var featureEnabled = false;
    var config = browzine.journalCoverImagesEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showJournalBrowZineWebLinkText() {
    var featureEnabled = false;
    var config = browzine.journalBrowZineWebLinkTextEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showArticleBrowZineWebLinkText() {
    var featureEnabled = false;
    var config = browzine.articleBrowZineWebLinkTextEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showDirectToPDFLink() {
    var featureEnabled = false;
    var config = browzine.articlePDFDownloadLinkEnabled;
    var prefixConfig = browzine.summonArticlePDFDownloadLinkEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    if (typeof prefixConfig !== "undefined" && prefixConfig !== null && prefixConfig === false) {
      featureEnabled = false;
    }

    return featureEnabled;
  };

  function showArticleLink() {
    var featureEnabled = false;
    var config = browzine.articleLinkEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showPrintRecords() {
    var featureEnabled = false;
    var config = browzine.printRecordsIntegrationEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showLibKeyOneLinkView() {
    var featureEnabled = false;
    var config = browzine.libKeyOneLinkView;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showRetractionWatch() {
    var featureEnabled = false;
    var config = browzine.articleRetractionWatchEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function isFiltered(scope) {
    var result = false;

    if (scope && scope.document) {
      if (scope.document.is_print && !showPrintRecords()) {
        result = true;
      }
    }

    return result;
  };

  function transition(event, anchor) {
    // We’ve seen some discovery services intercept basic a href links, and have
    // been encouraged to intercept clicks more closely. We should continue
    // intercepting clicks like this unless we hear feedback from discovery
    // service vendors that this is no longer desired or necessary.
    event.preventDefault();
    event.stopPropagation();

    window.open(anchor.href, anchor.target);

    return false;
  };

  function directToPDFTemplate(directToPDFUrl, articleRetractionUrl) {
    var pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg";
    var pdfIconWidth = "13";
    var articlePDFDownloadWording = browzine.articlePDFDownloadWording || browzine.summonArticlePDFDownloadWording || "Article PDF";
    var articlePDFDownloadLinkText = browzine.articlePDFDownloadLinkText || browzine.summonArticlePDFDownloadLinkText || "Download Now";

    if (articleRetractionUrl && showRetractionWatch()) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg";
      pdfIconWidth = "17";
      articlePDFDownloadWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "More Info";
    }

    var template = "<div class='browzine'>" +
                     "{articlePDFDownloadWording} <a class='browzine-direct-to-pdf-link' href='{directToPDFUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{articlePDFDownloadLinkText}</a> <img alt='BrowZine PDF Icon' class='browzine-pdf-icon' src='{pdfIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='{pdfIconWidth}' height='17'/>" +
                   "</div>";

    template = template.replace(/{articlePDFDownloadWording}/g, articlePDFDownloadWording);
    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);
    template = template.replace(/{pdfIconWidth}/g, pdfIconWidth);

    return template;
  };

  function articleLinkTemplate(articleLinkUrl) {
    var linkIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg";
    var articleLinkTextWording = browzine.articleLinkTextWording || "Article Link";
    var articleLinkText = browzine.articleLinkText || "Read Article";

    var template = "<div class='browzine'>" +
                     "{articleLinkTextWording} <a class='browzine-article-link' href='{articleLinkUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{articleLinkText}</a> <img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='{linkIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/>" +
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

    if (isJournal(scope)) {
      wording = browzine.journalWording || browzine.summonJournalWording || "View the Journal";
      browzineWebLinkText = browzine.journalBrowZineWebLinkText || browzine.summonJournalBrowZineWebLinkText || "Browse Now";
    }

    if (isArticle(scope)) {
      wording = browzine.articleWording || browzine.summonArticleWording || "View Complete Issue";
      browzineWebLinkText = browzine.articleBrowZineWebLinkText || browzine.summonArticleBrowZineWebLinkText || "Browse Now";
    }

    var template = "<div class='browzine'>" +
                     "{wording} <a class='browzine-web-link' href='{browzineWebLink}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{browzineWebLinkText}</a> <img alt='BrowZine Book Icon' class='browzine-book-icon' src='{bookIcon}' style='margin-bottom: 1px;' width='16' height='16'/>" +
                   "</div>";

    template = template.replace(/{wording}/g, wording);
    template = template.replace(/{browzineWebLink}/g, browzineWebLink);
    template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
    template = template.replace(/{bookIcon}/g, bookIcon);

    return template;
  };

  function unpaywallArticlePDFTemplate(directToPDFUrl, articleRetractionUrl) {
    var pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg";
    var pdfIconWidth = "13";
    var articlePDFDownloadWording = browzine.articlePDFDownloadViaUnpaywallWording || "Article PDF";
    var articlePDFDownloadLinkText = browzine.articlePDFDownloadViaUnpaywallLinkText || "Download Now (via Unpaywall)";

    if (articleRetractionUrl && showRetractionWatch()) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg";
      pdfIconWidth = "17";
      articlePDFDownloadWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "More Info";
    }

    var template = "<div class='browzine'>" +
                     "{articlePDFDownloadWording} <a class='unpaywall-article-pdf-link' href='{directToPDFUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{articlePDFDownloadLinkText}</a> <img alt='BrowZine PDF Icon' class='browzine-pdf-icon' src='{pdfIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='{pdfIconWidth}' height='17'/>" +
                   "</div>";

    template = template.replace(/{articlePDFDownloadWording}/g, articlePDFDownloadWording);
    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);
    template = template.replace(/{pdfIconWidth}/g, pdfIconWidth);

    return template;
  };

  function unpaywallArticleLinkTemplate(articleLinkUrl) {
    var linkIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg";
    var articleLinkTextWording = browzine.articleLinkViaUnpaywallWording || "Article Link";
    var articleLinkText = browzine.articleLinkViaUnpaywallLinkText || "Read Article (via Unpaywall)";

    var template = "<div class='browzine'>" +
                     "{articleLinkTextWording} <a class='unpaywall-article-link' href='{articleLinkUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{articleLinkText}</a> <img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='{linkIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/>" +
                   "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon);

    return template;
  };

  function unpaywallManuscriptPDFTemplate(directToPDFUrl, articleRetractionUrl) {
    var pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg";
    var pdfIconWidth = "13";
    var articlePDFDownloadWording = browzine.articleAcceptedManuscriptPDFViaUnpaywallWording || "Article PDF";
    var articlePDFDownloadLinkText = browzine.articleAcceptedManuscriptPDFViaUnpaywallLinkText || "Download Now (Accepted Manuscript via Unpaywall)";

    if (articleRetractionUrl && showRetractionWatch()) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg";
      pdfIconWidth = "17";
      articlePDFDownloadWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "More Info";
    }

    var template = "<div class='browzine'>" +
                     "{articlePDFDownloadWording} <a class='unpaywall-manuscript-article-pdf-link' href='{directToPDFUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{articlePDFDownloadLinkText}</a> <img alt='BrowZine PDF Icon' class='browzine-pdf-icon' src='{pdfIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='{pdfIconWidth}' height='17'/>" +
                   "</div>";

    template = template.replace(/{articlePDFDownloadWording}/g, articlePDFDownloadWording);
    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);
    template = template.replace(/{pdfIconWidth}/g, pdfIconWidth);

    return template;
  };

  function unpaywallManuscriptLinkTemplate(articleLinkUrl) {
    var linkIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg";
    var articleLinkTextWording = browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallWording || "Article Link";
    var articleLinkText = browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText || "Read Article (Accepted Manuscript via Unpaywall)";

    var template = "<div class='browzine'>" +
                     "{articleLinkTextWording} <a class='unpaywall-manuscript-article-link' href='{articleLinkUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{articleLinkText}</a> <img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='{linkIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/>" +
                   "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon);

    return template;
  };

  function isUnpaywallEnabled() {
    return browzine.articlePDFDownloadViaUnpaywallEnabled || browzine.articleLinkViaUnpaywallEnabled || browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled || browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;
  };

  function getScope(documentSummary) {
    return angular.element(documentSummary).scope();
  };

  function shouldEnhance(scope) {
    var validation = false;

    if (!isFiltered(scope)) {
      if (isJournal(scope) && getIssn(scope)) {
        validation = true;
      }

      if (isArticle(scope) && getDoi(scope)) {
        validation = true;
      }

      if (isArticle(scope) && !getDoi(scope) && getIssn(scope)) {
        validation = true;
      }
    }

    return validation;
  };

  function adapter(documentSummary) {
    var scope = getScope(documentSummary);

    if (!shouldEnhance(scope)) {
      return;
    }

    var endpoint = getEndpoint(scope);

    var request = new XMLHttpRequest();
    request.open("GET", endpoint, true);
    request.setRequestHeader("Content-type", "application/json");

    request.onload = function() {
      if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
        var response = JSON.parse(request.response);

        var data = getData(response);
        var journal = getIncludedJournal(response);
        var library = getIncludedLibrary(response);

        var browzineWebLink = getBrowZineWebLink(data);
        var coverImageUrl = getCoverImageUrl(scope, data, journal);
        var browzineEnabled = getBrowZineEnabled(scope, data, journal);
        var defaultCoverImage = isDefaultCoverImage(coverImageUrl);
        var directToPDFUrl = getDirectToPDFUrl(scope, data);
        var articleLinkUrl = getArticleLinkUrl(scope, data);
        var articleRetractionUrl = getArticleRetractionUrl(scope, data);

        if (directToPDFUrl && isArticle(scope) && showDirectToPDFLink()) {
          var template = directToPDFTemplate(directToPDFUrl, articleRetractionUrl);
          $(documentSummary).find(".docFooter .row:eq(0)").prepend(template);
        }

        if (!directToPDFUrl && articleLinkUrl && isArticle(scope) && showDirectToPDFLink() && showArticleLink()) {
          var template = articleLinkTemplate(articleLinkUrl);
          $(documentSummary).find(".docFooter .row:eq(0)").prepend(template);
        }

        if (browzineWebLink && browzineEnabled && isJournal(scope) && showJournalBrowZineWebLinkText()) {
          var template = browzineWebLinkTemplate(scope, browzineWebLink);
          $(documentSummary).find(".docFooter .row:eq(0)").append(template);
        }

        if (browzineWebLink && browzineEnabled && isArticle(scope) && (directToPDFUrl || articleLinkUrl) && showArticleBrowZineWebLinkText()) {
          var template = browzineWebLinkTemplate(scope, browzineWebLink);
          $(documentSummary).find(".docFooter .row:eq(0)").append(template);
        }

        if (coverImageUrl && !defaultCoverImage && showJournalCoverImages()) {
          $(documentSummary).find(".coverImage img").attr("src", coverImageUrl).attr("ng-src", coverImageUrl).css("box-shadow", "1px 1px 2px #ccc");
        }

        if (showLibKeyOneLinkView() && (directToPDFUrl || articleLinkUrl)) {
          var contentLinkElement = $(documentSummary).find(".availabilityContent");

          if (contentLinkElement) {
            contentLinkElement.remove();
          }
        }

        if (showLibKeyOneLinkView() && directToPDFUrl) {
          var quickLinkElement = $(documentSummary).find("span.customPrimaryLinkContainer");

          if (quickLinkElement) {
            quickLinkElement.remove();
          }
        }
      }

      if ((request.readyState == XMLHttpRequest.DONE && request.status == 404) || (isArticle(scope) && (!directToPDFUrl && !articleLinkUrl))) {
        var endpoint = getUnpaywallEndpoint(scope);

        if (endpoint && isUnpaywallEnabled()) {
          var requestUnpaywall = new XMLHttpRequest();
          requestUnpaywall.open("GET", endpoint, true);
          requestUnpaywall.setRequestHeader("Content-type", "application/json");

          requestUnpaywall.onload = function() {
            if (requestUnpaywall.readyState == XMLHttpRequest.DONE && requestUnpaywall.status == 200) {
              var response = JSON.parse(requestUnpaywall.response);

              var unpaywallArticlePDFUrl = getUnpaywallArticlePDFUrl(response);
              var unpaywallArticleLinkUrl = getUnpaywallArticleLinkUrl(response);
              var unpaywallManuscriptArticlePDFUrl = getUnpaywallManuscriptArticlePDFUrl(response);
              var unpaywallManuscriptArticleLinkUrl = getUnpaywallManuscriptArticleLinkUrl(response);
              var articleRetractionUrl = getArticleRetractionUrl(scope, data);

              var template;
              var pdfAvailable = false;

              if (unpaywallArticlePDFUrl && browzine.articlePDFDownloadViaUnpaywallEnabled) {
                template = unpaywallArticlePDFTemplate(unpaywallArticlePDFUrl, articleRetractionUrl);
                pdfAvailable = true;
              } else if (unpaywallArticleLinkUrl && browzine.articleLinkViaUnpaywallEnabled ) {
                template = unpaywallArticleLinkTemplate(unpaywallArticleLinkUrl);
              } else if (unpaywallManuscriptArticlePDFUrl && browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled) {
                template = unpaywallManuscriptPDFTemplate(unpaywallManuscriptArticlePDFUrl, articleRetractionUrl);
                pdfAvailable = true;
              } else if (unpaywallManuscriptArticleLinkUrl && browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled) {
                template = unpaywallManuscriptLinkTemplate(unpaywallManuscriptArticleLinkUrl);
              }

              if (template) {
                $(documentSummary).find(".docFooter .row:eq(0)").prepend(template);
              }

              if (showLibKeyOneLinkView() && template) {
                var contentLinkElement = $(documentSummary).find(".availabilityContent");

                if (contentLinkElement) {
                  contentLinkElement.remove();
                }
              }

              if (showLibKeyOneLinkView() && template && pdfAvailable) {
                var quickLinkElement = $(documentSummary).find("span.customPrimaryLinkContainer");

                if (quickLinkElement) {
                  quickLinkElement.remove();
                }
              }
            }
          };

          requestUnpaywall.send();
        }
      }
    };

    request.send();
  };

  return {
    adapter: adapter,
    getScope: getScope,
    shouldEnhance: shouldEnhance,
    getIssn: getIssn,
    getDoi: getDoi,
    getEndpoint: getEndpoint,
    getUnpaywallEndpoint: getUnpaywallEndpoint,
    getData: getData,
    getIncludedJournal: getIncludedJournal,
    getIncludedLibrary: getIncludedLibrary,
    getBrowZineWebLink: getBrowZineWebLink,
    getCoverImageUrl: getCoverImageUrl,
    getBrowZineEnabled: getBrowZineEnabled,
    isDefaultCoverImage: isDefaultCoverImage,
    getDirectToPDFUrl: getDirectToPDFUrl,
    getArticleLinkUrl: getArticleLinkUrl,
    getArticleRetractionUrl: getArticleRetractionUrl,
    isUnknownVersion: isUnknownVersion,
    isTrustedRepository: isTrustedRepository,
    getUnpaywallArticlePDFUrl: getUnpaywallArticlePDFUrl,
    getUnpaywallArticleLinkUrl: getUnpaywallArticleLinkUrl,
    getUnpaywallManuscriptArticlePDFUrl: getUnpaywallManuscriptArticlePDFUrl,
    getUnpaywallManuscriptArticleLinkUrl: getUnpaywallManuscriptArticleLinkUrl,
    showJournalCoverImages: showJournalCoverImages,
    showJournalBrowZineWebLinkText: showJournalBrowZineWebLinkText,
    showArticleBrowZineWebLinkText: showArticleBrowZineWebLinkText,
    showDirectToPDFLink: showDirectToPDFLink,
    showArticleLink: showArticleLink,
    showPrintRecords: showPrintRecords,
    showLibKeyOneLinkView: showLibKeyOneLinkView,
    showRetractionWatch: showRetractionWatch,
    isFiltered: isFiltered,
    transition: transition,
    browzineWebLinkTemplate: browzineWebLinkTemplate,
    directToPDFTemplate: directToPDFTemplate,
    articleLinkTemplate: articleLinkTemplate,
    unpaywallArticlePDFTemplate: unpaywallArticlePDFTemplate,
    unpaywallArticleLinkTemplate: unpaywallArticleLinkTemplate,
    unpaywallManuscriptPDFTemplate: unpaywallManuscriptPDFTemplate,
    unpaywallManuscriptLinkTemplate: unpaywallManuscriptLinkTemplate,
    isUnpaywallEnabled: isUnpaywallEnabled,
    urlRewrite: urlRewrite,
    libraryIdOverride: libraryIdOverride,
  };
}());

$(function() {
  if (!browzine) {
    return;
  }

  var results = document.querySelector("#results") || document;
  var documentSummaries = results.querySelectorAll(".documentSummary");

  Array.prototype.forEach.call(documentSummaries, function(documentSummary) {
    browzine.summon.adapter(documentSummary);
  });

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.attributeName === "document-summary") {
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
