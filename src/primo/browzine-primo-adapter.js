browzine.primo = (function() {
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

  function getResult(scope) {
    return scope.result || scope.item;
  };

  function isArticle(scope) {
    var validation = false;
    var result = getResult(scope);

    if (result && result.pnx) {
      if (result.pnx.display && result.pnx.display.type) {
        var contentType = result.pnx.display.type[0].trim().toLowerCase();

        if (contentType.indexOf("article") > -1) {
          validation = true;
        }
      }
    }

    return validation;
  };

  function isJournal(scope) {
    var validation = false;
    var result = getResult(scope);

    if (result && result.pnx) {
      if (result.pnx.display && result.pnx.display.type) {
        var contentType = result.pnx.display.type[0].trim().toLowerCase();

        if (contentType.indexOf("journal") > -1) {
          validation = true;
        }
      }
    }

    return validation;
  };

  function getIssn(scope) {
    var issn = "";
    var result = getResult(scope);

    if (result && result.pnx && result.pnx.addata) {
      if (result.pnx.addata.issn) {
        if (result.pnx.addata.issn.length > 1) {
          issn = result.pnx.addata.issn.filter(function(issn) {
            return (issn.length < 10) && (/[\S]{4}\-[\S]{4}/.test(issn));
          }).join(",").trim().replace(/-/g, "");
        } else {
          if (result.pnx.addata.issn[0]) {
            issn = result.pnx.addata.issn[0].trim().replace("-", "");
          }
        }
      }

      if (result.pnx.addata.eissn && !issn) {
        if (result.pnx.addata.eissn.length > 1) {
          issn = result.pnx.addata.eissn.filter(function(issn) {
            return (issn.length < 10) && (/[\S]{4}\-[\S]{4}/.test(issn));
          }).join(",").trim().replace(/-/g, "");
        } else {
          if (result.pnx.addata.eissn[0]) {
            issn = result.pnx.addata.eissn[0].trim().replace("-", "");
          }
        }
      }
    }

    return encodeURIComponent(issn);
  };

  function getDoi(scope) {
    var doi = "";
    var result = getResult(scope);

    if (result && result.pnx) {
      if (result.pnx.addata && result.pnx.addata.doi) {
        if (result.pnx.addata.doi[0]) {
          doi = result.pnx.addata.doi[0].trim();
        }
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

  function getUnpaywallUsable(scope, data) {
    if (!isArticle(scope)) {
      return false;
    }
    if (!data || !data.hasOwnProperty("unpaywallUsable")) {
      return true;
    }
    return !!data.unpaywallUsable;
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
    var prefixConfig = browzine.primoArticlePDFDownloadLinkEnabled;

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

  function showRetractionWatch() {
    var featureEnabled = false;
    var config = browzine.articleRetractionWatchEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showFormatChoice() {
    var featureEnabled = false;
    var config = browzine.showFormatChoice;

    if (config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function showLinkResolverLink() {
    var featureEnabled = false;
    var config = browzine.showLinkResolverLink;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function enableLinkOptimizer() {
    var featureEnabled = false;
    var config = browzine.enableLinkOptimizer;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  };

  function isFiltered(scope) {
    var validation = false;
    var result = getResult(scope);

    if (result && result.delivery) {
      if (result.delivery.deliveryCategory && result.delivery.deliveryCategory.length > 0) {
        var deliveryCategory = result.delivery.deliveryCategory[0].trim().toLowerCase();

        if (deliveryCategory === "alma-p" && !showPrintRecords()) {
          validation = true;
        }
      }
    }

    return validation;
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

  function showRetractionWatchUI(articleRetractionUrl) {
    return articleRetractionUrl && showRetractionWatch();
  };

  function directToPDFTemplate(directToPDFUrl, articleRetractionUrl) {
    var pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg";
    var pdfIconWidth = "12";
    var pdfIconMarginRight = "4.5px";
    var articlePDFDownloadLinkText = browzine.articlePDFDownloadLinkText || browzine.primoArticlePDFDownloadLinkText  || "Download PDF";

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg";
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "Retracted Article";
    }

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='browzine-direct-to-pdf-link' href='{directToPDFUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "<img alt='BrowZine PDF Icon' src='{pdfIcon}' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: {pdfIconMarginRight};' aria-hidden='true' width='{pdfIconWidth}' height='16'/> " +
                          "<span class='browzine-web-link-text'>{articlePDFDownloadLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);
    template = template.replace(/{pdfIconWidth}/g, pdfIconWidth);
    template = template.replace(/{pdfIconMarginRight}/g, pdfIconMarginRight);

    return template;
  };

  function articleLinkTemplate(articleLinkUrl, articleRetractionUrl) {
    var linkIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg";
    var linkIconWidth = "12";
    var linkIconMarginRight = "4.5px";
    var articleLinkText = browzine.articleLinkText  || "Read Article";

    if (showRetractionWatchUI(articleRetractionUrl)) {
      articleLinkUrl = articleRetractionUrl;
      linkIcon = "https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg";
      linkIconWidth = "15";
      linkIconMarginRight = "1.5px";
      articleLinkText = browzine.articleRetractionWatchText || "Retracted Article";
    }

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='browzine-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "<img alt='BrowZine Article Link Icon' src='{linkIcon}' class='browzine-article-link-icon' style='margin-bottom: -3px; margin-right: {linkIconMarginRight};' aria-hidden='true' width='{linkIconWidth}' height='16'/> " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon);
    template = template.replace(/{linkIconWidth}/g, linkIconWidth);
    template = template.replace(/{linkIconMarginRight}/g, linkIconMarginRight);

    return template;
  };

  function retractionWatchLinkTemplate(articleRetractionUrl) {
    var articleLinkUrl = articleRetractionUrl;
    var linkIcon = "https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg";
    var linkIconWidth = "15";
    var linkIconMarginRight = "1.5px";
    var articleLinkText = browzine.articleRetractionWatchText || "Retracted Article";

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='browzine-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "<img alt='BrowZine Article Link Icon' src='{linkIcon}' class='browzine-article-link-icon' style='margin-bottom: -3px; margin-right: {linkIconMarginRight};' aria-hidden='true' width='{linkIconWidth}' height='16'/> " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon);
    template = template.replace(/{linkIconWidth}/g, linkIconWidth);
    template = template.replace(/{linkIconMarginRight}/g, linkIconMarginRight);

    return template;
  };

  function browzineWebLinkTemplate(scope, browzineWebLink) {
    var browzineWebLinkText = "";
    var bookIcon = "https://assets.thirdiron.com/images/integrations/browzine-open-book-icon.svg";

    if (isJournal(scope)) {
      browzineWebLinkText = browzine.journalBrowZineWebLinkText || browzine.primoJournalBrowZineWebLinkText || "View Journal Contents";
    }

    if (isArticle(scope)) {
      browzineWebLinkText = browzine.articleBrowZineWebLinkText || browzine.primoArticleBrowZineWebLinkText || "View Issue Contents";
    }

    var template = "<div class='browzine' style='line-height: 1.4em;'>" +
                      "<a class='browzine-web-link' href='{browzineWebLink}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "<img alt='BrowZine Book Icon' src='{bookIcon}' class='browzine-book-icon' style='margin-bottom: -2px; margin-right: 2.5px;' aria-hidden='true' width='15' height='15'/> " +
                          "<span class='browzine-web-link-text'>{browzineWebLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{browzineWebLink}/g, browzineWebLink);
    template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
    template = template.replace(/{bookIcon}/g, bookIcon);

    return template;
  };

  function unpaywallArticlePDFTemplate(directToPDFUrl, articleRetractionUrl) {
    var pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg";
    var pdfIconWidth = "12";
    var pdfIconMarginRight = "4.5px";
    var articlePDFDownloadLinkText = browzine.articlePDFDownloadViaUnpaywallText  || "Download PDF (via Unpaywall)";

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg";
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "Retracted Article";
    }

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='unpaywall-article-pdf-link' href='{directToPDFUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "<img alt='BrowZine PDF Icon' src='{pdfIcon}' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: {pdfIconMarginRight};' aria-hidden='true' width='{pdfIconWidth}' height='16'/> " +
                          "<span class='browzine-web-link-text'>{articlePDFDownloadLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);
    template = template.replace(/{pdfIconWidth}/g, pdfIconWidth);
    template = template.replace(/{pdfIconMarginRight}/g, pdfIconMarginRight);

    return template;
  };

  function unpaywallArticleLinkTemplate(articleLinkUrl) {
    var linkIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg";
    var articleLinkText = browzine.articleLinkViaUnpaywallText  || "Read Article (via Unpaywall)";

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='unpaywall-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "<img alt='BrowZine Article Link Icon' src='{linkIcon}' class='browzine-article-link-icon' style='margin-bottom: -3px; margin-right: 4.5px;' aria-hidden='true' width='12' height='16'/> " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon);

    return template;
  };

  function unpaywallManuscriptPDFTemplate(directToPDFUrl, articleRetractionUrl) {
    var pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-pdf-download-icon.svg";
    var pdfIconWidth = "12";
    var pdfIconMarginRight = "4.5px";
    var articlePDFDownloadLinkText = browzine.articleAcceptedManuscriptPDFViaUnpaywallText  || "Download PDF (Accepted Manuscript via Unpaywall)";

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = "https://assets.thirdiron.com/images/integrations/browzine-retraction-watch-icon.svg";
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "Retracted Article";
    }

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='unpaywall-manuscript-article-pdf-link' href='{directToPDFUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "<img alt='BrowZine PDF Icon' src='{pdfIcon}' class='browzine-pdf-icon' style='margin-bottom: -3px; margin-right: {pdfIconMarginRight};' aria-hidden='true' width='{pdfIconWidth}' height='16'/> " +
                          "<span class='browzine-web-link-text'>{articlePDFDownloadLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);
    template = template.replace(/{pdfIconWidth}/g, pdfIconWidth);
    template = template.replace(/{pdfIconMarginRight}/g, pdfIconMarginRight);

    return template;
  };

  function unpaywallManuscriptLinkTemplate(articleLinkUrl) {
    var linkIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon.svg";
    var articleLinkText = browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallText  || "Read Article (Accepted Manuscript via Unpaywall)";

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='unpaywall-manuscript-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "<img alt='BrowZine Article Link Icon' src='{linkIcon}' class='browzine-article-link-icon' style='margin-bottom: -3px; margin-right: 4.5px;' aria-hidden='true' width='12' height='16'/> " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon);

    return template;
  };

  function isUnpaywallEnabled() {
    return browzine.articlePDFDownloadViaUnpaywallEnabled || browzine.articleLinkViaUnpaywallEnabled || browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled || browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallEnabled;
  };

  function getElement(scope) {
    return scope.$element;
  };

  function getElementParent(element) {
    return element[0].offsetParent || element[0];
  };

  function getScope($scope) {
    return $scope && $scope.$parent && $scope.$parent.$ctrl ? $scope.$parent.$ctrl : undefined;
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

  function searchResult($scope) {
    var scope = getScope($scope);

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

        var browzineWebLink = getBrowZineWebLink(data);
        var coverImageUrl = getCoverImageUrl(scope, data, journal);
        var browzineEnabled = getBrowZineEnabled(scope, data, journal);
        var defaultCoverImage = isDefaultCoverImage(coverImageUrl);
        var directToPDFUrl = getDirectToPDFUrl(scope, data);
        var unpaywallUsable = getUnpaywallUsable(scope, data);
        var articleLinkUrl = getArticleLinkUrl(scope, data);
        var articleRetractionUrl = getArticleRetractionUrl(scope, data);

        var element = getElement(scope);

        var libKeyLinkOptimizer = document.createElement("div");
        libKeyLinkOptimizer.className = "libkey-link-optimizer";
        libKeyLinkOptimizer.style = "display: flex; justify-content: flex-start;";

        if (directToPDFUrl && isArticle(scope) && showDirectToPDFLink()) {
          var template = directToPDFTemplate(directToPDFUrl, articleRetractionUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }

        if ((!directToPDFUrl || (showFormatChoice() && !articleRetractionUrl)) && articleLinkUrl && isArticle(scope) && showDirectToPDFLink() && showArticleLink()) {
          var template = articleLinkTemplate(articleLinkUrl, articleRetractionUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }

        if (!directToPDFUrl && !articleLinkUrl && articleRetractionUrl && isArticle(scope) && showRetractionWatch()) {
          var template = retractionWatchLinkTemplate(articleRetractionUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }

        if (libKeyLinkOptimizer.innerHTML) {
          (function poll() {
            var elementParent = getElementParent(element);
            var availabilityLine = elementParent.querySelector("prm-search-result-availability-line .layout-align-start-start");

            if (availabilityLine) {
              availabilityLine.insertAdjacentHTML('afterbegin', libKeyLinkOptimizer.outerHTML);
            } else {
              requestAnimationFrame(poll);
            }
          })();
        }

        if (browzineWebLink && browzineEnabled && isJournal(scope) && showJournalBrowZineWebLinkText()) {
          var template = browzineWebLinkTemplate(scope, browzineWebLink);
          element.append(template);
        }

        if (browzineWebLink && browzineEnabled && isArticle(scope) && (directToPDFUrl || articleLinkUrl) && showArticleBrowZineWebLinkText()) {
          var template = browzineWebLinkTemplate(scope, browzineWebLink);
          element.append(template);
        }

        if (coverImageUrl && !defaultCoverImage && showJournalCoverImages()) {
          (function poll() {
            var elementParent = getElementParent(element);
            var coverImages = elementParent.querySelectorAll("prm-search-result-thumbnail-container img");

            if (coverImages && coverImages[0] && coverImages[0].className.indexOf("fan-img") > -1) {
              Array.prototype.forEach.call(coverImages, function(coverImage) {
                coverImage.src = coverImageUrl;
              });
            } else {
              requestAnimationFrame(poll);
            }
          })();
        }

        if (!showLinkResolverLink() && (directToPDFUrl || articleLinkUrl)) {
          var elementParent = getElementParent(element);
          var contentLinkElement = elementParent.querySelector("prm-search-result-availability-line .layout-align-start-start .layout-row");

          if (contentLinkElement) {
            contentLinkElement.remove();
          }
        }

        if ((directToPDFUrl || articleLinkUrl) && enableLinkOptimizer()) {
          var elementParent = getElementParent(element);
          var quickLinkElement = elementParent.querySelector("prm-quick-link");

          if (quickLinkElement) {
            quickLinkElement.remove();
          }
        }
      }

      if ((request.readyState == XMLHttpRequest.DONE && request.status == 404) || (isArticle(scope) && (!directToPDFUrl && !articleLinkUrl && unpaywallUsable))) {
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
                var element = getElement(scope);

                (function poll() {
                  var elementParent = getElementParent(element);
                  var availabilityLine = elementParent.querySelector("prm-search-result-availability-line .layout-align-start-start");

                  if (availabilityLine) {
                    availabilityLine.insertAdjacentHTML('afterbegin', template);
                  } else {
                    requestAnimationFrame(poll);
                  }
                })();
              }

              if (!showLinkResolverLink() && template) {
                var element = getElement(scope);

                (function poll() {
                  var elementParent = getElementParent(element);
                  var contentLinkElement = elementParent.querySelector("prm-search-result-availability-line .layout-align-start-start .layout-row");

                  if (contentLinkElement) {
                    contentLinkElement.remove();
                  } else {
                    requestAnimationFrame(poll);
                  }
                })();
              }

              if (template) {
                var element = getElement(scope);

                (function poll() {
                  var elementParent = getElementParent(element);
                  var quickLinkElement = elementParent.querySelector("prm-quick-link");

                  if (quickLinkElement) {
                    quickLinkElement.remove();
                  } else {
                    requestAnimationFrame(poll);
                  }
                })();
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
    searchResult: searchResult,
    urlRewrite: urlRewrite,
    libraryIdOverride: libraryIdOverride,
    getResult: getResult,
    isArticle: isArticle,
    isJournal: isJournal,
    getIssn: getIssn,
    getDoi: getDoi,
    isFiltered: isFiltered,
    getEndpoint: getEndpoint,
    getUnpaywallEndpoint: getUnpaywallEndpoint,
    shouldEnhance: shouldEnhance,
    getData: getData,
    getIncludedJournal: getIncludedJournal,
    getBrowZineWebLink: getBrowZineWebLink,
    getCoverImageUrl: getCoverImageUrl,
    getBrowZineEnabled: getBrowZineEnabled,
    isDefaultCoverImage: isDefaultCoverImage,
    getDirectToPDFUrl: getDirectToPDFUrl,
    getUnpaywallUsable: getUnpaywallUsable,
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
    showRetractionWatch: showRetractionWatch,
    showFormatChoice: showFormatChoice,
    showLinkResolverLink: showLinkResolverLink,
    enableLinkOptimizer: enableLinkOptimizer,
    transition: transition,
    directToPDFTemplate: directToPDFTemplate,
    articleLinkTemplate: articleLinkTemplate,
    retractionWatchLinkTemplate: retractionWatchLinkTemplate,
    browzineWebLinkTemplate: browzineWebLinkTemplate,
    unpaywallArticlePDFTemplate: unpaywallArticlePDFTemplate,
    unpaywallArticleLinkTemplate: unpaywallArticleLinkTemplate,
    unpaywallManuscriptPDFTemplate: unpaywallManuscriptPDFTemplate,
    unpaywallManuscriptLinkTemplate: unpaywallManuscriptLinkTemplate,
    isUnpaywallEnabled: isUnpaywallEnabled,
    getElement: getElement,
    getElementParent: getElementParent,
    getScope: getScope,
  };
}());
