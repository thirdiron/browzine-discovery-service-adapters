browzine.primo = (function() {
  var libraryId = browzine.libraryId;
  var api = libraryIdOverride(urlRewrite(browzine.api));
  var apiKey = browzine.apiKey;

  function urlRewrite(url) {
    if (!url) {
      return;
    } else if (url.indexOf("staging-api.thirdiron.com") > -1) {
      return url;
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

        if (contentType.indexOf("article") > -1 || contentType.indexOf("review") > -1) {
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

  function getArticleEOCNoticeUrl(scope, data) {
    var articleEocNoticeUrl = null;

    if (isArticle(scope)) {
      if (data && data.expressionOfConcernNoticeUrl) {
        articleEocNoticeUrl = data.expressionOfConcernNoticeUrl;
      }
    }
    return articleEocNoticeUrl;
  }

  function getProblematicJournalArticleNoticeUrl(scope, data) {
    var problematicJournalArticleNoticeUrl = null;

    if (isArticle(scope)) {
      if (data && data.problematicJournalArticleNoticeUrl) {
        problematicJournalArticleNoticeUrl = data.problematicJournalArticleNoticeUrl;
      }
    }
    return problematicJournalArticleNoticeUrl;
  }

  function getDocumentDeliveryFulfillmentUrl(scope, data) {
    var documentDeliveryUrl = null;

    if (isArticle(scope)) {
      if (data && data.documentDeliveryFulfillmentUrl) {
        documentDeliveryUrl = data.documentDeliveryFulfillmentUrl;
      }
    }
    return documentDeliveryUrl;
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

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
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

  function showExpressionOfConcern() {
    var featureEnabled = false;
    var config = browzine.articleExpressionOfConcernEnabled;

    if(typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    };

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

  function showProblematicJournal() {
    var featureEnabled = false;
    var config = browzine.problematicJournalEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }

  function showDocumentDeliveryFulfillment() {
    var featureEnabled = false;
    var config = browzine.documentDeliveryFulfillmentEnabled;

    if (typeof config === "undefined" || config === null || config === true) {
      featureEnabled = true;
    }

    return featureEnabled;
  }

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

  function showEocNoticeUI(articleEocNoticeUrl) {
    return articleEocNoticeUrl && showExpressionOfConcern();
  }

  function showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl) {
    return !!problematicJournalArticleNoticeUrl && showProblematicJournal();
  }

  function showDocumentDeliveryFulfillmentUI(documentDeliveryFulfillmentUrl) {
    return !!documentDeliveryFulfillmentUrl && showDocumentDeliveryFulfillment();
  }

  function getPdfIconSvg(className, width, marginRight) {
    var color = browzine.iconColor || "#000000";

    var template = "<svg xmlns='http://www.w3.org/2000/svg' class='{className}' data-icon='pdf-download' viewBox='0 0 384 512' width='{width}' height='16' fill='{color}' aria-hidden='true' focusable='false' style='margin-bottom: -3px; margin-right: {marginRight};'><path d='M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zm-22.6 22.7c2.1 2.1 3.5 4.6 4.2 7.4H256V32.5c2.8.7 5.3 2.1 7.4 4.2l83.9 83.9zM336 480H48c-8.8 0-16-7.2-16-16V48c0-8.8 7.2-16 16-16h176v104c0 13.3 10.7 24 24 24h104v304c0 8.8-7.2 16-16 16zm-22-171.2c-13.5-13.3-55-9.2-73.7-6.7-21.2-12.8-35.2-30.4-45.1-56.6 4.3-18 12-47.2 6.4-64.9-4.4-28.1-39.7-24.7-44.6-6.8-5 18.3-.3 44.4 8.4 77.8-11.9 28.4-29.7 66.9-42.1 88.6-20.8 10.7-54.1 29.3-58.8 52.4-3.5 16.8 22.9 39.4 53.1 6.4 9.1-9.9 19.3-24.8 31.3-45.5 26.7-8.8 56.1-19.8 82-24 21.9 12 47.6 19.9 64.6 19.9 27.7.1 28.9-30.2 18.5-40.6zm-229.2 89c5.9-15.9 28.6-34.4 35.5-40.8-22.1 35.3-35.5 41.5-35.5 40.8zM180 175.5c8.7 0 7.8 37.5 2.1 47.6-5.2-16.3-5-47.6-2.1-47.6zm-28.4 159.3c11.3-19.8 21-43.2 28.8-63.7 9.7 17.7 22.1 31.7 35.1 41.5-24.3 4.7-45.4 15.1-63.9 22.2zm153.4-5.9s-5.8 7-43.5-9.1c41-3 47.7 6.4 43.5 9.1z'/></svg>";

    template = template.replace(/{className}/g, className);
    template = template.replace(/{width}/g, width);
    template = template.replace(/{marginRight}/g, marginRight);
    template = template.replace(/{color}/g, color);

    return template;
  };
  function getArticleLinkIconSvg(className, width, marginRight) {
    var color = browzine.iconColor || "#000000";

    var template = "<svg xmlns='http://www.w3.org/2000/svg' class='{className}' data-icon='article-link' viewBox='0 0 384 512' width='{width}' height='16' fill='{color}' aria-hidden='true' focusable='false' style='margin-bottom: -3px; margin-right: {marginRight};'><path d='M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zm-22.6 22.7c2.1 2.1 3.5 4.6 4.2 7.4H256V32.5c2.8.7 5.3 2.1 7.4 4.2l83.9 83.9zM336 480H48c-8.8 0-16-7.2-16-16V48c0-8.8 7.2-16 16-16h176v104c0 13.3 10.7 24 24 24h104v304c0 8.8-7.2 16-16 16zm-48-244v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm0 64v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm0 64v8c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12z'></path></svg>";

    template = template.replace(/{className}/g, className);
    template = template.replace(/{width}/g, width);
    template = template.replace(/{marginRight}/g, marginRight);
    template = template.replace(/{color}/g, color);

    return template;
  };
  function getRetractionWatchIconSvg(className, width, marginRight) {
    var color = "#EB0000";

    var template = "<svg xmlns='http://www.w3.org/2000/svg' class='{className}' data-icon='retraction-watch' viewBox='0 0 576 512' width='{width}' height='16' fill='{color}' aria-hidden='true' focusable='false' style='margin-bottom: -3px; margin-right: {marginRight};'><path d='M248.747 204.705l6.588 112c.373 6.343 5.626 11.295 11.979 11.295h41.37a12 12 0 0 0 11.979-11.295l6.588-112c.405-6.893-5.075-12.705-11.979-12.705h-54.547c-6.903 0-12.383 5.812-11.978 12.705zM330 384c0 23.196-18.804 42-42 42s-42-18.804-42-42 18.804-42 42-42 42 18.804 42 42zm-.423-360.015c-18.433-31.951-64.687-32.009-83.154 0L6.477 440.013C-11.945 471.946 11.118 512 48.054 512H527.94c36.865 0 60.035-39.993 41.577-71.987L329.577 23.985zM53.191 455.002L282.803 57.008c2.309-4.002 8.085-4.002 10.394 0l229.612 397.993c2.308 4-.579 8.998-5.197 8.998H58.388c-4.617.001-7.504-4.997-5.197-8.997z'></path></svg>";

    template = template.replace(/{className}/g, className);
    template = template.replace(/{width}/g, width);
    template = template.replace(/{marginRight}/g, marginRight);
    template = template.replace(/{color}/g, color);

    return template;
  };
  function getBookIconSvg(className) {
    var color = browzine.iconColor || "#000000";

    var template = "<svg xmlns='http://www.w3.org/2000/svg' class='{className}' data-icon='open-book' viewBox='0 0 465 465' width='15' height='15' fill='{color}' stroke='{color}' aria-hidden='true' focusable='false' style='margin-bottom: -2px; margin-right: 2.5px;'><g><path d='M240,356.071V132.12c0-4.143-3.357-7.5-7.5-7.5s-7.5,3.357-7.5,7.5v223.951c0,4.143,3.357,7.5,7.5,7.5 S240,360.214,240,356.071z' stroke-width='12.5'/><path d='M457.5,75.782c-15.856,0-35.614-6.842-56.533-14.085c-26.492-9.174-56.521-19.571-87.663-19.571 c-36.035,0-58.019,15.791-70.115,29.038c-4.524,4.956-8.03,9.922-10.688,14.327c-2.658-4.405-6.164-9.371-10.688-14.327 c-12.097-13.247-34.08-29.038-70.115-29.038c-31.143,0-61.171,10.397-87.663,19.571C43.114,68.94,23.356,75.782,7.5,75.782 c-4.143,0-7.5,3.357-7.5,7.5v302.092c0,4.143,3.357,7.5,7.5,7.5c18.38,0,39.297-7.243,61.441-14.911 c25.375-8.786,54.136-18.745,82.755-18.745c24.54,0,44.403,8.126,59.038,24.152c2.792,3.058,7.537,3.273,10.596,0.48 s3.273-7.537,0.48-10.596c-12.097-13.246-34.08-29.037-70.114-29.037c-31.143,0-61.171,10.397-87.663,19.571 C46.298,369.931,29.396,375.782,15,377.422V90.41c16.491-1.571,34.755-7.896,53.941-14.539 c25.375-8.786,54.136-18.745,82.755-18.745c57.881,0,73.025,45.962,73.634,47.894c0.968,3.148,3.876,5.298,7.17,5.298 s6.202-2.149,7.17-5.298c0.146-0.479,15.383-47.894,73.634-47.894c28.619,0,57.38,9.959,82.755,18.745 c19.187,6.644,37.45,12.968,53.941,14.539v287.012c-14.396-1.64-31.298-7.491-49.033-13.633 c-26.492-9.174-56.521-19.571-87.663-19.571c-36.036,0-58.02,15.791-70.115,29.038c-2.793,3.06-2.578,7.803,0.48,10.596 c3.06,2.793,7.804,2.578,10.596-0.48c14.635-16.027,34.498-24.153,59.039-24.153c28.619,0,57.38,9.959,82.755,18.745 c22.145,7.668,43.062,14.911,61.441,14.911c4.143,0,7.5-3.357,7.5-7.5V83.282C465,79.14,461.643,75.782,457.5,75.782z' stroke-width='12.5'/><path d='M457.5,407.874c-15.856,0-35.614-6.842-56.533-14.085c-26.492-9.174-56.521-19.571-87.663-19.571 c-33.843,0-55.291,13.928-67.796,26.596l-26.017-0.001c-12.505-12.668-33.954-26.595-67.795-26.595 c-31.143,0-61.171,10.397-87.663,19.571c-20.919,7.243-40.677,14.085-56.533,14.085c-4.143,0-7.5,3.357-7.5,7.5s3.357,7.5,7.5,7.5 c18.38,0,39.297-7.243,61.441-14.911c25.375-8.786,54.136-18.745,82.755-18.745c24.54,0,44.403,8.126,59.038,24.152 c1.421,1.556,3.431,2.442,5.538,2.442l32.454,0.001c2.107,0,4.117-0.887,5.538-2.442c14.635-16.027,34.498-24.153,59.039-24.153 c28.619,0,57.38,9.959,82.755,18.745c22.145,7.668,43.062,14.911,61.441,14.911c4.143,0,7.5-3.357,7.5-7.5 S461.643,407.874,457.5,407.874z' stroke-width='12.5'/></g></svg>";

    template = template.replace(/{className}/g, className);
    template = template.replace(/{color}/g, color);

    return template;
  };
  function directToPDFTemplate(directToPDFUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl, documentDeliveryFulfillmentUrl) {
    var pdfIcon = getPdfIconSvg;
    var pdfIconWidth = "12";
    var pdfIconMarginRight = "4.5px";
    var articlePDFDownloadLinkText = browzine.articlePDFDownloadLinkText || browzine.primoArticlePDFDownloadLinkText  || "Download PDF";

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = getRetractionWatchIconSvg;
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "Retracted Article";
    } else if (showEocNoticeUI(articleEocNoticeUrl)) {
      directToPDFUrl = articleEocNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg;
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.articleExpressionOfConcernText || "Expression of Concern";
    } else if (showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl)) {
      directToPDFUrl = problematicJournalArticleNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg;
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.problematicJournalText || "Problematic Journal";
    } else if (!directToPDFUrl && showDocumentDeliveryFulfillmentUI(documentDeliveryFulfillmentUrl)) {
      directToPDFUrl = documentDeliveryFulfillmentUrl;
      // pdfIcon stays the same
      articlePDFDownloadLinkText = browzine.documentDeliveryFulfillmentText || "Request PDF";
    }

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='browzine-direct-to-pdf-link' href='{directToPDFUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{pdfIcon} " +
                          "<span class='browzine-web-link-text'>{articlePDFDownloadLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon("browzine-pdf-icon", pdfIconWidth, pdfIconMarginRight));

    return template;
  };

  function articleLinkTemplate(articleLinkUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl, documentDeliveryFulfillmentUrl) {
    var linkIcon = getArticleLinkIconSvg;
    var linkIconWidth = "12";
    var linkIconMarginRight = "4.5px";
    var articleLinkText = browzine.articleLinkText  || "Read Article";

    if (showRetractionWatchUI(articleRetractionUrl)) {
      articleLinkUrl = articleRetractionUrl;
      linkIcon = getRetractionWatchIconSvg;
      linkIconWidth = "15";
      linkIconMarginRight = "1.5px";
      articleLinkText = browzine.articleRetractionWatchText || "Retracted Article";
    } else if (showEocNoticeUI(articleEocNoticeUrl)) {
      articleLinkUrl = articleEocNoticeUrl;
      linkIcon = getRetractionWatchIconSvg;
      linkIconWidth = "15";
      linkIconMarginRight = "1.5px";
      articleLinkText = browzine.articleExpressionOfConcernText || "Expression of Concern";
    } else if (showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl)) {
      articleLinkUrl = problematicJournalArticleNoticeUrl;
      linkIcon = getRetractionWatchIconSvg;
      linkIconWidth = "15";
      linkIconMarginRight = "1.5px";
      articleLinkText = browzine.problematicJournalText || "Problematic Journal";
    } else if (!articleLinkUrl && showDocumentDeliveryFulfillmentUI(documentDeliveryFulfillmentUrl)) {
      articleLinkUrl = documentDeliveryFulfillmentUrl;
      // link icon stays the same
      articleLinkText = browzine.documentDeliveryFulfillmentText || "Request PDF";
    }

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='browzine-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{linkIcon} " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon("browzine-article-link-icon", linkIconWidth, linkIconMarginRight));

    return template;
  };

  function retractionWatchLinkTemplate(articleRetractionUrl) {
    var articleLinkUrl = articleRetractionUrl;
    var linkIcon = getRetractionWatchIconSvg;
    var linkIconWidth = "15";
    var linkIconMarginRight = "1.5px";
    var articleLinkText = browzine.articleRetractionWatchText || "Retracted Article";

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='browzine-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{linkIcon} " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon("browzine-article-link-icon", linkIconWidth, linkIconMarginRight));

    return template;
  };

  function eocLinkTemplate(articleEocNoticeUrl) {
    var articleLinkUrl = articleEocNoticeUrl;
    var linkIcon = getRetractionWatchIconSvg;
    var linkIconWidth = "15";
    var linkIconMarginRight = "1.5px";
    var articleLinkText = browzine.articleExpressionOfConcernText || "Expression of Concern";

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='browzine-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{linkIcon} " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon("browzine-article-link-icon", linkIconWidth, linkIconMarginRight));

    return template;
  };

  function problematicJournalArticleNoticeLinkTemplate(problematicJournalArticleNoticeUrl) {
    var articleLinkUrl = problematicJournalArticleNoticeUrl;
    var linkIcon = getRetractionWatchIconSvg;
    var linkIconWidth = "15";
    var linkIconMarginRight = "1.5px";
    var articleLinkText = browzine.problematicJournalText || "Problematic Journal";

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='browzine-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{linkIcon} " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon("browzine-article-link-icon", linkIconWidth, linkIconMarginRight));

    return template;
  };

  function documentDeliveryFulfillmentLinkTemplate(documentDeliveryFulfillmentUrl) {
    var articleLinkUrl = documentDeliveryFulfillmentUrl;
    var linkIcon = getPdfIconSvg;
    var linkIconWidth = "15";
    var linkIconMarginRight = "1.5px";
    var articleLinkText = browzine.documentDeliveryFulfillmentText || "Request PDF";

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='browzine-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{linkIcon} " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon("browzine-article-link-icon", linkIconWidth, linkIconMarginRight));

    return template;
  };


  function browzineWebLinkTemplate(scope, browzineWebLink) {
    var browzineWebLinkText = "";
    var bookIcon = getBookIconSvg;

    if (isJournal(scope)) {
      browzineWebLinkText = browzine.journalBrowZineWebLinkText || browzine.primoJournalBrowZineWebLinkText || "View Journal Contents";
    }

    if (isArticle(scope)) {
      browzineWebLinkText = browzine.articleBrowZineWebLinkText || browzine.primoArticleBrowZineWebLinkText || "View Issue Contents";
    }

    var template = "<div class='browzine' style='line-height: 1.4em;'>" +
                      "<a class='browzine-web-link' href='{browzineWebLink}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{bookIcon} " +
                          "<span class='browzine-web-link-text'>{browzineWebLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{browzineWebLink}/g, browzineWebLink);
    template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
    template = template.replace(/{bookIcon}/g, bookIcon("browzine-book-icon"));

    return template;
  };

  function unpaywallArticlePDFTemplate(directToPDFUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl, documentDeliveryFulfillmentUrl) {
    var pdfIcon = getPdfIconSvg;
    var pdfIconWidth = "12";
    var pdfIconMarginRight = "4.5px";
    var articlePDFDownloadLinkText = browzine.articlePDFDownloadViaUnpaywallText  || "Download PDF (via Unpaywall)";

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = getRetractionWatchIconSvg;
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "Retracted Article";
    } else if (showEocNoticeUI(articleEocNoticeUrl)) {
      directToPDFUrl = articleEocNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg;
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.articleExpressionOfConcernText || "Expression of Concern";
    } else if (showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl)) {
      //We don't want to show the PDF link for problematic journal articles as we're already showing the problematic journal article notice

      return null;
    } else if (!directToPDFUrl && showDocumentDeliveryFulfillmentUI(documentDeliveryFulfillmentUrl)) {
      directToPDFUrl = documentDeliveryFulfillmentUrl;
      // pdfIcon stays the same
      articlePDFDownloadLinkText = browzine.documentDeliveryFulfillmentText || "Request PDF";
    }

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='unpaywall-article-pdf-link' href='{directToPDFUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{pdfIcon} " +
                          "<span class='browzine-web-link-text'>{articlePDFDownloadLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon("browzine-pdf-icon", pdfIconWidth, pdfIconMarginRight));

    return template;
  };

  //TODO: BZ 8196 - Will address the need here for retraction/eoc handling as well as ironing out some logic.
  function unpaywallArticleLinkTemplate(articleLinkUrl) {
    var linkIcon = getArticleLinkIconSvg;
    var articleLinkText = browzine.articleLinkViaUnpaywallText  || "Read Article (via Unpaywall)";

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='unpaywall-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{linkIcon} " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon("browzine-article-link-icon", "12", "4.5px"));

    return template;
  };

  function unpaywallManuscriptPDFTemplate(directToPDFUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl) {
    var pdfIcon = getPdfIconSvg;
    var pdfIconWidth = "12";
    var pdfIconMarginRight = "4.5px";
    var articlePDFDownloadLinkText = browzine.articleAcceptedManuscriptPDFViaUnpaywallText  || "Download PDF (Accepted Manuscript via Unpaywall)";

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = getRetractionWatchIconSvg;
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "Retracted Article";
    } else if (showEocNoticeUI(articleEocNoticeUrl)) {
      directToPDFUrl = articleEocNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg;
      pdfIconWidth = "15";
      pdfIconMarginRight = "1.5px";
      articlePDFDownloadLinkText = browzine.articleExpressionOfConcernText || "Expression of Concern";
    } else if (showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl)) {
      //We don't want to show the link for problematic journal articles as we're already showing the problematic journal article notice

      return null;
    }

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='unpaywall-manuscript-article-pdf-link' href='{directToPDFUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{pdfIcon} " +
                          "<span class='browzine-web-link-text'>{articlePDFDownloadLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{directToPDFUrl}/g, directToPDFUrl);
    template = template.replace(/{articlePDFDownloadLinkText}/g, articlePDFDownloadLinkText);
    template = template.replace(/{pdfIcon}/g, pdfIcon("browzine-pdf-icon", pdfIconWidth, pdfIconMarginRight));

    return template;
  };

  function unpaywallManuscriptLinkTemplate(articleLinkUrl) {
    var linkIcon = getArticleLinkIconSvg;
    var articleLinkText = browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallText  || "Read Article (Accepted Manuscript via Unpaywall)";

    var template = "<div class='browzine' style='line-height: 1.4em; margin-right: 4.5em;'>" +
                      "<a class='unpaywall-manuscript-article-link' href='{articleLinkUrl}' target='_blank' onclick='browzine.primo.transition(event, this)'>" +
                          "{linkIcon} " +
                          "<span class='browzine-article-link-text'>{articleLinkText}</span> " +
                          "<md-icon md-svg-icon='primo-ui:open-in-new' class='md-primoExplore-theme' aria-hidden='true' style='height: 15px; width: 15px; min-height: 15px; min-width: 15px; margin-top: -2px;'><svg width='100%' height='100%' viewBox='0 0 24 24' y='504' xmlns='http://www.w3.org/2000/svg' fit='' preserveAspectRatio='xMidYMid meet' focusable='false'><path d='M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z'></path></svg></md-icon>" +
                      "</a>" +
                   "</div>";

    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{linkIcon}/g, linkIcon("browzine-article-link-icon", "12", "4.5px"));

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
    var scope;

    if ($scope && $scope.$ctrl && $scope.$ctrl.parentCtrl && $scope.$ctrl.parentCtrl.$element) {
      // Pre-Primo Angular 1.8.3
      // 3i Normal Integration: ✓
      // Primo Studio Integration: ✓

      // Post-Primo Angular 1.8.3
      // 3i Normal Integration: ✗
      // Primo Studio Integration: ✗
      scope = $scope.$ctrl.parentCtrl;
    } else if ($scope && $scope.$parent && $scope.$parent.$ctrl && $scope.$parent.$ctrl.$element) {
      // Pre-Primo Angular 1.8.3
      // 3i Normal Integration: ✓
      // Primo Studio Integration: ✗

      // Post-Primo Angular 1.8.3
      // 3i Normal Integration: ✓
      // Primo Studio Integration: ✗
      scope = $scope.$parent.$ctrl;
    } else if ($scope && $scope.$parent && $scope.$parent.$ctrl && $scope.$parent.$ctrl.parentCtrl && $scope.$parent.$ctrl.parentCtrl.$element) {
      // Pre-Primo Angular 1.8.3
      // 3i Normal Integration: ✗
      // Primo Studio Integration: ✗

      // Post-Primo Angular 1.8.3
      // 3i Normal Integration: ✗
      // Primo Studio Integration: ✓
      scope = $scope.$parent.$ctrl.parentCtrl;
    }

    return scope;
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

  function shouldAvoidUnpaywall(response) {
    if (response.hasOwnProperty('meta') && response.meta.hasOwnProperty('avoidUnpaywall')) {
      return response.meta.avoidUnpaywall;
    } else {
      return false;
    };
  }

  function shouldIgnoreUnpaywallResponse(response, unpaywallResponse) {
    if (response.hasOwnProperty('data') && response.data.hasOwnProperty('avoidUnpaywallPublisherLinks')) {
      if (unpaywallResponse.best_oa_location && unpaywallResponse.best_oa_location.host_type === "publisher") {
        return true;
      }
    }
    return false;
  }

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
        var articleEocNoticeUrl = getArticleEOCNoticeUrl(scope, data);
        var problematicJournalArticleNoticeUrl = getProblematicJournalArticleNoticeUrl(scope, data);
        var documentDeliveryFulfillmentUrl = getDocumentDeliveryFulfillmentUrl(scope, data);

        var element = getElement(scope);

        var libKeyLinkOptimizer = document.createElement("div");
        libKeyLinkOptimizer.className = "libkey-link-optimizer";
        libKeyLinkOptimizer.style = "display: flex; justify-content: flex-start;";

        if (directToPDFUrl && isArticle(scope) && showDirectToPDFLink()) {
          var template = directToPDFTemplate(directToPDFUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl, documentDeliveryFulfillmentUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }

        if ((!directToPDFUrl || (showFormatChoice() && !articleRetractionUrl && !articleEocNoticeUrl && !problematicJournalArticleNoticeUrl)) && articleLinkUrl && isArticle(scope) && showArticleLink()) {
          var template = articleLinkTemplate(articleLinkUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl, documentDeliveryFulfillmentUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }

        if (!directToPDFUrl && !articleLinkUrl && articleRetractionUrl && isArticle(scope) && showRetractionWatch()) {
          var template = retractionWatchLinkTemplate(articleRetractionUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }

        if (!directToPDFUrl && !articleLinkUrl && !articleRetractionUrl && articleEocNoticeUrl && isArticle(scope) && showExpressionOfConcern()) {
          var template = eocLinkTemplate(articleEocNoticeUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }

        if (!directToPDFUrl && !articleLinkUrl && !articleRetractionUrl && !articleEocNoticeUrl && problematicJournalArticleNoticeUrl && isArticle(scope) && showProblematicJournal()) {
          var template = problematicJournalArticleNoticeLinkTemplate(problematicJournalArticleNoticeUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }

        if (!directToPDFUrl && !articleLinkUrl && !articleRetractionUrl && !articleEocNoticeUrl && !problematicJournalArticleNoticeUrl && isArticle(scope) && documentDeliveryFulfillmentUrl && showDocumentDeliveryFulfillment()) {
          var template = documentDeliveryFulfillmentLinkTemplate(documentDeliveryFulfillmentUrl);
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

        if (browzineWebLink && browzineEnabled && isArticle(scope) && (directToPDFUrl || articleLinkUrl || documentDeliveryFulfillmentUrl) && showArticleBrowZineWebLinkText()) {
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

        var response = JSON.parse(request.response || '{}');
        var shouldAvoidUnpaywallLiveCall = shouldAvoidUnpaywall(response);
        if (shouldAvoidUnpaywallLiveCall) {
          return
        }

        var endpoint = getUnpaywallEndpoint(scope);
        if (endpoint && isUnpaywallEnabled()) {
          var requestUnpaywall = new XMLHttpRequest();
          requestUnpaywall.open("GET", endpoint, true);
          requestUnpaywall.setRequestHeader("Content-type", "application/json");

          requestUnpaywall.onload = function() {
            if (requestUnpaywall.readyState == XMLHttpRequest.DONE && requestUnpaywall.status == 200) {
              var responseUnpaywall = JSON.parse(requestUnpaywall.response);

              if (!responseUnpaywall.genre || responseUnpaywall.genre !== "journal-article") {
                return;
              }

              if (shouldIgnoreUnpaywallResponse(response, responseUnpaywall)) {
                return;
              }

              var unpaywallArticlePDFUrl = getUnpaywallArticlePDFUrl(responseUnpaywall);
              var unpaywallArticleLinkUrl = getUnpaywallArticleLinkUrl(responseUnpaywall);
              var unpaywallManuscriptArticlePDFUrl = getUnpaywallManuscriptArticlePDFUrl(responseUnpaywall);
              var unpaywallManuscriptArticleLinkUrl = getUnpaywallManuscriptArticleLinkUrl(responseUnpaywall);
              var articleRetractionUrl = getArticleRetractionUrl(scope, data);
              var articleEocNoticeUrl = getArticleEOCNoticeUrl(scope, data);
              var problematicJournalArticleNoticeUrl = getProblematicJournalArticleNoticeUrl(scope, data);

              var template;
              var pdfAvailable = false;

              if (unpaywallArticlePDFUrl && browzine.articlePDFDownloadViaUnpaywallEnabled) {
                template = unpaywallArticlePDFTemplate(unpaywallArticlePDFUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl);
                pdfAvailable = true;
              } else if (unpaywallArticleLinkUrl && browzine.articleLinkViaUnpaywallEnabled ) {
                template = unpaywallArticleLinkTemplate(unpaywallArticleLinkUrl);
              } else if (unpaywallManuscriptArticlePDFUrl && browzine.articleAcceptedManuscriptPDFViaUnpaywallEnabled) {
                template = unpaywallManuscriptPDFTemplate(unpaywallManuscriptArticlePDFUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl);
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
    getArticleEOCNoticeUrl: getArticleEOCNoticeUrl,
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
    showExpressionOfConcern: showExpressionOfConcern,
    showProblematicJournal: showProblematicJournal,
    showFormatChoice: showFormatChoice,
    showLinkResolverLink: showLinkResolverLink,
    showDocumentDeliveryFulfillment: showDocumentDeliveryFulfillment,
    enableLinkOptimizer: enableLinkOptimizer,
    transition: transition,
    directToPDFTemplate: directToPDFTemplate,
    articleLinkTemplate: articleLinkTemplate,
    retractionWatchLinkTemplate: retractionWatchLinkTemplate,
    eocLinkTemplate: eocLinkTemplate,
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
