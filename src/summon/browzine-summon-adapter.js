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
      endpoint = api + "/articles/doi/" + doi + "?include=journal";
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

  function getPdfIconSvg() {
    var color = browzine.iconColor || "#639add";

    var template = '<svg name="pdf" alt="PDF icon" class="browzine-pdf-icon" viewBox="0 0 16 16" style=""><path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path> <path fill="{color}" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path></svg>';

    template = template.replace(/{color}/g, color);

    return template;
  }

  function getRetractionWatchIconSvg() {
    return '<svg width="17" viewBox="0 0 576 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>retraction-watch-icon-4</title><g id="retraction-watch-icon-4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="exclamation-triangle" transform="translate(1.000000, 0.000000)" fill="#EB0000" fill-rule="nonzero"><path d="M569.517287,440.013005 C587.975287,472.007005 564.806287,512 527.940287,512 L48.0542867,512 C11.1172867,512 -11.9447133,471.945005 6.47728668,440.013005 L246.423287,23.9850049 C264.890287,-8.02399507 311.143287,-7.96599507 329.577287,23.9850049 L569.517287,440.013005 Z M288.000287,354.000005 C262.595287,354.000005 242.000287,374.595005 242.000287,400.000005 C242.000287,425.405005 262.595287,446.000005 288.000287,446.000005 C313.405287,446.000005 334.000287,425.405005 334.000287,400.000005 C334.000287,374.595005 313.405287,354.000005 288.000287,354.000005 Z M244.327287,188.654005 L251.745287,324.654005 C252.092287,331.018005 257.354287,336.000005 263.727287,336.000005 L312.273287,336.000005 C318.646287,336.000005 323.908287,331.018005 324.255287,324.654005 L331.673287,188.654005 C332.048287,181.780005 326.575287,176.000005 319.691287,176.000005 L256.308287,176.000005 C249.424287,176.000005 243.952287,181.780005 244.327287,188.654005 L244.327287,188.654005 Z" id="Shape"></path></g></g></svg>';
  }

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

    if (config === true) {
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

  function showRetractionWatchUI(articleRetractionUrl) {
    return articleRetractionUrl && showRetractionWatch();
  };

  function directToPDFTemplate(directToPDFUrl, articleRetractionUrl) {
    var pdfIcon = getPdfIconSvg();
    var pdfIconWidth = "13";

    var articlePDFDownloadWording = "View Now";
    var articlePDFDownloadLinkText = "PDF";

    if (browzine.version >= 2) {
      articlePDFDownloadWording = browzine.articlePDFDownloadWording || articlePDFDownloadWording;
      articlePDFDownloadLinkText = browzine.articlePDFDownloadLinkText || articlePDFDownloadLinkText;
    }

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "More Info";
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articlePDFDownloadWording}</span>" +
      "<a class='browzine-direct-to-pdf-link summonBtn customPrimaryLink' href='{directToPDFUrl}' target='_blank' onclick='browzine.summon.transition(event, this)'>{pdfIcon}<span style='margin-left: 3px;'>{articlePDFDownloadLinkText}</span></a>" +
    "</div>";

    template = template.replace(/{articlePDFDownloadWording}/g, articlePDFDownloadWording);
    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);
    template = template.replace(/{pdfIconWidth}/g, pdfIconWidth);

    return template;
  };

  function articleLinkTemplate(articleLinkUrl) {
    var paperIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon-2.svg";

    var articleLinkTextWording = "View Now";
    var articleLinkText = "Article Page";

    if (browzine.version >= 2) {
      articleLinkTextWording = browzine.articleLinkTextWording || articleLinkTextWording;
      articleLinkText = browzine.articleLinkText || articleLinkText;
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articleLinkTextWording}</span><a class='browzine-article-link summonBtn customPrimaryLink' href='{articleLinkUrl}' target='_blank' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='{paperIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/> {articleLinkText}</a>" +
    "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{paperIcon}/g, paperIcon);

    return template;
  };

  function browzineWebLinkTemplate(scope, browzineWebLink) {
    var wording = "";
    var browzineWebLinkText = "";
    var bookIcon = "https://assets.thirdiron.com/images/integrations/browzine-open-book-icon-2.svg";

    if (isJournal(scope)) {
      wording = "View the Journal";
      browzineWebLinkText = "Browse Now";

      if (browzine.version >= 2) {
        wording = browzine.journalWording || wording;
        browzineWebLinkText = browzine.journalBrowZineWebLinkText || browzineWebLinkText;
      }
    }

    if (isArticle(scope)) {
      wording = "View in Context";
      browzineWebLinkText = "Browse Journal";

      if (browzine.version >= 2) {
        wording = browzine.articleWording || wording;
        browzineWebLinkText = browzine.articleBrowZineWebLinkText || browzineWebLinkText;
      }
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{wording}</span><a class='browzine-web-link summonBtn customPrimaryLink' href='{browzineWebLink}' target='_blank' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine Book Icon' class='browzine-book-icon' src='{bookIcon}' style='margin-right: 2px; margin-bottom: 1px;' width='16' height='16'/> {browzineWebLinkText}</a>" +
    "</div>";

    template = template.replace(/{wording}/g, wording);
    template = template.replace(/{browzineWebLink}/g, browzineWebLink);
    template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
    template = template.replace(/{bookIcon}/g, bookIcon);

    return template;
  };

  function unpaywallArticlePDFTemplate(directToPDFUrl, articleRetractionUrl) {
    var pdfIcon = getPdfIconSvg();
    var pdfIconWidth = "13";

    var articlePDFDownloadWording = "View Now (via Unpaywall)";
    var articlePDFDownloadLinkText = "PDF";

    if (browzine.version >= 2) {
      articlePDFDownloadWording = browzine.articlePDFDownloadViaUnpaywallWording || articlePDFDownloadWording;
      articlePDFDownloadLinkText = browzine.articlePDFDownloadViaUnpaywallLinkText || articlePDFDownloadLinkText;
    }

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "More Info";
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articlePDFDownloadWording}</span>" +
      "<a class='unpaywall-article-pdf-link summonBtn customPrimaryLink' href='{directToPDFUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{pdfIcon}<span style='margin-left: 3px;'>{articlePDFDownloadLinkText}</span></a>" +
    "</div>";

    template = template.replace(/{articlePDFDownloadWording}/g, articlePDFDownloadWording);
    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);
    template = template.replace(/{pdfIconWidth}/g, pdfIconWidth);

    return template;
  };

  function unpaywallArticleLinkTemplate(articleLinkUrl) {
    var paperIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon-2.svg";

    var articleLinkTextWording = "View Now (via Unpaywall)";
    var articleLinkText = "Article Page";

    if (browzine.version >= 2) {
      articleLinkTextWording = browzine.articleLinkViaUnpaywallWording || articleLinkTextWording;
      articleLinkText = browzine.articleLinkViaUnpaywallLinkText || articleLinkText;
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articleLinkTextWording}</span><a class='unpaywall-article-link summonBtn customPrimaryLink' href='{articleLinkUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='{paperIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/> {articleLinkText}</a>" +
    "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{paperIcon}/g, paperIcon);

    return template;
  };

  function unpaywallManuscriptPDFTemplate(directToPDFUrl, articleRetractionUrl) {
    var pdfIcon = getPdfIconSvg();
    var pdfIconWidth = "13";

    var articlePDFDownloadWording = "View Now (Accepted Manuscript via Unpaywall)";
    var articlePDFDownloadLinkText = "PDF";

    if (browzine.version >= 2) {
      articlePDFDownloadWording = browzine.articleAcceptedManuscriptPDFViaUnpaywallWording || articlePDFDownloadWording;
      articlePDFDownloadLinkText = browzine.articleAcceptedManuscriptPDFViaUnpaywallLinkText || articlePDFDownloadLinkText;
    }

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "More Info";
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articlePDFDownloadWording}</span>" +
      "<a class='unpaywall-manuscript-article-pdf-link summonBtn customPrimaryLink' href='{directToPDFUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{pdfIcon}<span style='margin-left: 3px;'>{articlePDFDownloadLinkText}</span></a>" +
    "</div>";

    template = template.replace(/{articlePDFDownloadWording}/g, articlePDFDownloadWording);
    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon);
    template = template.replace(/{pdfIconWidth}/g, pdfIconWidth);

    return template;
  };

  function unpaywallManuscriptLinkTemplate(articleLinkUrl) {
    var paperIcon = "https://assets.thirdiron.com/images/integrations/browzine-article-link-icon-2.svg";

    var articleLinkTextWording = "View Now (via Unpaywall)";
    var articleLinkText = "Article Page";

    if (browzine.version >= 2) {
      articleLinkTextWording = browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallWording || articleLinkTextWording;
      articleLinkText = browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText || articleLinkText;
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articleLinkTextWording}</span><a class='unpaywall-manuscript-article-link summonBtn customPrimaryLink' href='{articleLinkUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'><img alt='BrowZine Article Link Icon' class='browzine-article-link-icon' src='{paperIcon}' style='margin-bottom: 2px; margin-right: 4.5px;' width='13' height='17'/> {articleLinkText}</a>" +
    "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{paperIcon}/g, paperIcon);

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

  function getPrimaryColor(documentSummary) {
    var primaryColor = "";

    var customPrimaryLink = $(documentSummary).find(".customPrimaryLink");

    if (customPrimaryLink && customPrimaryLink.length > 0) {
      var element = customPrimaryLink[0];

      if (element) {
        var computedStyle = window.getComputedStyle(element);

        if (computedStyle && computedStyle.color) {
          primaryColor = computedStyle.color;
        } else if (element.style && element.style.color) {
          primaryColor = element.style.color;
        }
      }
    }

    return primaryColor;
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
    getPrimaryColor: getPrimaryColor,
    shouldEnhance: shouldEnhance,
    getIssn: getIssn,
    getDoi: getDoi,
    getEndpoint: getEndpoint,
    getUnpaywallEndpoint: getUnpaywallEndpoint,
    getData: getData,
    getIncludedJournal: getIncludedJournal,
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
