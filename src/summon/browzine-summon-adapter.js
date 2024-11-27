browzine.summon = (function() {
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

  function getPdfIconSvg() {
    var color = browzine.iconColor || "#639add";

    var template = '<svg name="pdf" alt="pdf icon" class="browzine-pdf-icon" viewBox="0 0 16 16" width="15.5px"><path d="M5.523 12.424c.14-.082.293-.162.459-.238a7.878 7.878 0 0 1-.45.606c-.28.337-.498.516-.635.572a.266.266 0 0 1-.035.012.282.282 0 0 1-.026-.044c-.056-.11-.054-.216.04-.36.106-.165.319-.354.647-.548zm2.455-1.647c-.119.025-.237.05-.356.078a21.148 21.148 0 0 0 .5-1.05 12.045 12.045 0 0 0 .51.858c-.217.032-.436.07-.654.114zm2.525.939a3.881 3.881 0 0 1-.435-.41c.228.005.434.022.612.054.317.057.466.147.518.209a.095.095 0 0 1 .026.064.436.436 0 0 1-.06.2.307.307 0 0 1-.094.124.107.107 0 0 1-.069.015c-.09-.003-.258-.066-.498-.256zM8.278 6.97c-.04.244-.108.524-.2.829a4.86 4.86 0 0 1-.089-.346c-.076-.353-.087-.63-.046-.822.038-.177.11-.248.196-.283a.517.517 0 0 1 .145-.04c.013.03.028.092.032.198.005.122-.007.277-.038.465z"></path> <path fill="{color}" d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3zM4.165 13.668c.09.18.23.343.438.419.207.075.412.04.58-.03.318-.13.635-.436.926-.786.333-.401.683-.927 1.021-1.51a11.651 11.651 0 0 1 1.997-.406c.3.383.61.713.91.95.28.22.603.403.934.417a.856.856 0 0 0 .51-.138c.155-.101.27-.247.354-.416.09-.181.145-.37.138-.563a.844.844 0 0 0-.2-.518c-.226-.27-.596-.4-.96-.465a5.76 5.76 0 0 0-1.335-.05 10.954 10.954 0 0 1-.98-1.686c.25-.66.437-1.284.52-1.794.036-.218.055-.426.048-.614a1.238 1.238 0 0 0-.127-.538.7.7 0 0 0-.477-.365c-.202-.043-.41 0-.601.077-.377.15-.576.47-.651.823-.073.34-.04.736.046 1.136.088.406.238.848.43 1.295a19.697 19.697 0 0 1-1.062 2.227 7.662 7.662 0 0 0-1.482.645c-.37.22-.699.48-.897.787-.21.326-.275.714-.08 1.103z"></path></svg>';

    template = template.replace(/{color}/g, color);

    return template;
  }

  function getBookIconSvg() {
    var color = browzine.iconColor || "#639add";

    var template = '<svg name="book" alt="book icon" class="browzine-book-icon" width="16px" viewBox="0 0 526 434" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="browzine-open-book-icon-1" fill="{color}" transform="translate(7.000000, 7.000000)"><path d="M241.618552,55.7857207 C232.151375,26.3203553 207.77015,11.5876726 168.474879,11.5876726 C129.179608,11.5876726 76.8941653,24.1287042 11.6185517,49.2107674 L11.6185517,346.505747 C71.2023037,323.297721 118.863283,311.693708 154.60149,311.693708 C190.590991,322.63818 222.073848,357.764826 241.262978,358.587673 C241.16729,340.930135 241.285815,239.996151 241.618552,55.7857207 Z" id="Path-2"></path><path d="M499.999449,55.7857207 C490.532272,26.3203553 466.151048,11.5876726 426.855777,11.5876726 C387.560506,11.5876726 335.275063,24.1287042 269.999449,49.2107674 L269.999449,346.505747 C329.583202,323.297721 377.244181,311.693708 412.982388,311.693708 C448.971888,322.63818 480.454746,357.764826 499.643876,358.587673 C499.548188,340.930135 499.666712,239.996151 499.999449,55.7857207 Z" id="Path-2" transform="translate(384.999449, 185.087673) scale(-1, 1) translate(-384.999449, -185.087673) "></path><path d="M344.971286,0 C379.260972,0 412.325161,10.6415785 441.494847,20.0313871 C464.528241,27.444771 486.283286,34.4477219 503.741935,34.4477219 C508.30369,34.4477219 512,37.8847153 512,42.1241515 L512,42.1241515 L512,351.32357 C512,355.56403 508.30369,359 503.741935,359 C483.505273,359 460.474082,351.586616 436.09077,343.738234 C408.150985,334.745553 376.482959,324.552278 344.971286,324.552278 C317.949798,324.552278 296.07914,332.869434 279.964903,349.273452 C279.113304,350.14049 278.096775,350.784232 277.000418,351.201089 L276.99961,330.702434 C291.282552,319.592502 313.151786,309.198395 344.971286,309.198395 C379.260972,309.198395 412.325161,319.839974 441.494847,329.229783 C461.022417,335.516267 479.632791,341.504905 495.483871,343.183484 L495.483871,343.183484 L495.483871,49.4198301 C477.326039,47.811874 457.217101,41.3391086 436.09077,34.5388155 C408.150985,25.5461341 376.482959,15.3528592 344.971286,15.3528592 C309.687885,15.3528592 288.737148,30.039209 277.000735,43.3352913 L277.000134,21.5040389 C291.28361,10.3941064 313.152669,0 344.971286,0 Z M167.030916,0 C198.848787,0 220.716859,10.3936191 235.000643,21.5032576 L235.003099,43.1198859 C223.319986,29.87399 202.436991,15.3528592 167.028714,15.3528592 C135.517041,15.3528592 103.849015,25.5461341 75.9092301,34.5388155 C54.784,41.3380851 34.6739613,47.811874 16.516129,49.4198301 L16.516129,49.4198301 L16.516129,343.183484 C32.3672086,341.504905 50.9775828,335.516267 70.5051527,329.228759 C99.6748387,319.83895 132.737927,309.197372 167.028714,309.197372 C198.848685,309.197372 220.717699,319.59294 235.001366,330.703227 L235.000654,351.199798 C233.903438,350.782964 232.88611,350.138967 232.033996,349.271405 C215.919759,332.86841 194.049101,324.551255 167.028714,324.551255 C135.517041,324.551255 103.849015,334.74453 75.9092301,343.737211 C51.5270194,351.585593 28.495828,359 8.25806452,359 C3.69630968,359 0,355.563007 0,351.322547 L0,351.322547 L0,42.1241515 C0,37.8836918 3.69630968,34.4477219 8.25806452,34.4477219 C25.716714,34.4477219 47.4717591,27.444771 70.5073548,20.0313871 C99.6770409,10.6415785 132.740129,0 167.030916,0 Z" id="Combined-Shape" stroke="#629ADD" stroke-width="13.7634409" fill-rule="nonzero"></path><path d="M503.741935,402.716077 C486.283286,402.716077 464.528241,395.18252 441.494847,387.207432 C412.325161,377.106168 379.260972,365.658288 344.971286,365.658288 C307.707596,365.658288 284.091733,380.994065 270.322787,394.942486 L241.676112,394.941385 C227.907166,380.992963 204.290202,365.658288 167.028714,365.658288 C132.737927,365.658288 99.6748387,377.106168 70.5051527,387.207432 C47.4717591,395.18252 25.716714,402.716077 8.25806452,402.716077 C3.69630968,402.716077 0,406.412387 0,410.974142 C0,415.535897 3.69630968,419.232206 8.25806452,419.232206 C28.495828,419.232206 51.5270194,411.257118 75.9092301,402.814073 C103.849015,393.140026 135.517041,382.174417 167.028714,382.174417 C194.049101,382.174417 215.919759,391.121755 232.033996,408.767587 C233.598624,410.48086 235.811785,411.456413 238.131751,411.456413 L273.866047,411.457514 C276.186013,411.457514 278.399174,410.48086 279.963802,408.768688 C296.078039,391.121755 317.948697,382.174417 344.970185,382.174417 C376.481858,382.174417 408.149884,393.140026 436.089669,402.814073 C460.472981,411.257118 483.504172,419.232206 503.740834,419.232206 C508.302589,419.232206 511.998899,415.535897 511.998899,410.974142 C511.998899,406.412387 508.30369,402.716077 503.741935,402.716077 Z" id="Path" stroke="#629ADD" stroke-width="13.7634409" fill-rule="nonzero"></path></g></g></svg> ';

    template = template.replace(/{color}/g, color);

    return template;
  }

  function getPaperIconSvg() {
    var color = browzine.iconColor || "#639add";

    var template = '<svg name="paper" alt="paper icon" class="browzine-paper-icon" width="16px" viewBox="0 0 384 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Artboard" fill="{color}" fill-rule="nonzero"><g id="file-alt"><path d="M224,136 L224,0 L24,0 C10.7,0 0,10.7 0,24 L0,488 C0,501.3 10.7,512 24,512 L360,512 C373.3,512 384,501.3 384,488 L384,160 L248,160 C234.8,160 224,149.2 224,136 Z M288,372 C288,378.6 282.6,384 276,384 L108,384 C101.4,384 96,378.6 96,372 L96,364 C96,357.4 101.4,352 108,352 L276,352 C282.6,352 288,357.4 288,364 L288,372 Z M288,308 C288,314.6 282.6,320 276,320 L108,320 C101.4,320 96,314.6 96,308 L96,300 C96,293.4 101.4,288 108,288 L276,288 C282.6,288 288,293.4 288,300 L288,308 Z M288,236 L288,244 C288,250.6 282.6,256 276,256 L108,256 C101.4,256 96,250.6 96,244 L96,236 C96,229.4 101.4,224 108,224 L276,224 C282.6,224 288,229.4 288,236 Z M384,121.9 L384,128 L256,128 L256,0 L262.1,0 C268.5,0 274.6,2.5 279.1,7 L377,105 C381.5,109.5 384,115.6 384,121.9 Z" id="Shape"></path></g></g></g></svg> ';

    template = template.replace(/{color}/g, color);

    return template;
  }

  function getRetractionWatchIconSvg() {
    return '<svg name="warning" alt="warning icon" class="browzine-warning-icon" width="16px" viewBox="0 0 576 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="retraction-watch-icon-4" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="exclamation-triangle" transform="translate(1.000000, 0.000000)" fill="#EB0000" fill-rule="nonzero"><path d="M569.517287,440.013005 C587.975287,472.007005 564.806287,512 527.940287,512 L48.0542867,512 C11.1172867,512 -11.9447133,471.945005 6.47728668,440.013005 L246.423287,23.9850049 C264.890287,-8.02399507 311.143287,-7.96599507 329.577287,23.9850049 L569.517287,440.013005 Z M288.000287,354.000005 C262.595287,354.000005 242.000287,374.595005 242.000287,400.000005 C242.000287,425.405005 262.595287,446.000005 288.000287,446.000005 C313.405287,446.000005 334.000287,425.405005 334.000287,400.000005 C334.000287,374.595005 313.405287,354.000005 288.000287,354.000005 Z M244.327287,188.654005 L251.745287,324.654005 C252.092287,331.018005 257.354287,336.000005 263.727287,336.000005 L312.273287,336.000005 C318.646287,336.000005 323.908287,331.018005 324.255287,324.654005 L331.673287,188.654005 C332.048287,181.780005 326.575287,176.000005 319.691287,176.000005 L256.308287,176.000005 C249.424287,176.000005 243.952287,181.780005 244.327287,188.654005 L244.327287,188.654005 Z" id="Shape"></path></g></g></svg> ';
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

  function enableLinkOptimizer() {
    var featureEnabled = false;
    var config = browzine.enableLinkOptimizer;

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

  function showEocNoticeUI(articleEocNoticeUrl) {
    return articleEocNoticeUrl && showExpressionOfConcern();
  }

  function showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl) {
    return !!problematicJournalArticleNoticeUrl;
  }

  function directToPDFTemplate(directToPDFUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl) {
    var pdfIcon = getPdfIconSvg();
    var pdfIconWidth = "13";

    var articlePDFDownloadWording = "View Now";
    var articlePDFDownloadLinkText = "PDF";

    if (+browzine.version >= 2) {
      articlePDFDownloadWording = browzine.articlePDFDownloadWording || articlePDFDownloadWording;
      articlePDFDownloadLinkText = browzine.articlePDFDownloadLinkText || articlePDFDownloadLinkText;
    }

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "More Info";
    } else if (showEocNoticeUI(articleEocNoticeUrl)) {
      directToPDFUrl = articleEocNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.articleExpressionOfConcernWording || "Expression of Concern";
      articlePDFDownloadLinkText = browzine.articleExpressionOfConcernText || "More Info";
    } else if (showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl)) {
      directToPDFUrl = problematicJournalArticleNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.problematicJournalWording || "Problematic Journal";
      articlePDFDownloadLinkText = browzine.problematicJournalText || "More Info";
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

  function articleLinkTemplate(articleLinkUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl) {
    var paperIcon = getPaperIconSvg();

    var articleLinkTextWording = "View Now";
    var articleLinkText = "Article Page";

    if (+browzine.version >= 2) {
      articleLinkTextWording = browzine.articleLinkTextWording || articleLinkTextWording;
      articleLinkText = browzine.articleLinkText || articleLinkText;
    }

    if (showRetractionWatchUI(articleRetractionUrl)) {
      articleLinkUrl = articleRetractionUrl;
      paperIcon = getRetractionWatchIconSvg();
      articleLinkTextWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articleLinkText = browzine.articleRetractionWatchText || "More Info";
    } else if (showEocNoticeUI(articleEocNoticeUrl)) {
      articleLinkUrl = articleEocNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articleLinkTextWording = browzine.articleExpressionOfConcernWording || "Expression of Concern";
      articleLinkText = browzine.articleExpressionOfConcernText || "More Info";
    } else if (showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl)) {
      articleLinkUrl = problematicJournalArticleNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.problematicJournalWording || "Problematic Journal";
      articlePDFDownloadLinkText = browzine.problematicJournalText || "More Info";
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articleLinkTextWording}</span>" +
      "<a class='browzine-article-link summonBtn customPrimaryLink' href='{articleLinkUrl}' target='_blank' onclick='browzine.summon.transition(event, this)'>{paperIcon}<span style='margin-left: 0px;'>{articleLinkText}</span></a>" +
    "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{paperIcon}/g, paperIcon);

    return template;
  };

  function retractionWatchLinkTemplate(articleRetractionUrl) {
    var articleLinkUrl = articleRetractionUrl;
    var paperIcon = getRetractionWatchIconSvg();

    var articleLinkTextWording = "Retracted Article";
    var articleLinkText = "More Info";

    if (+browzine.version >= 2) {
      articleLinkTextWording = browzine.articleRetractionWatchTextWording || articleLinkTextWording;
      articleLinkText = browzine.articleRetractionWatchText || articleLinkText;
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articleLinkTextWording}</span>" +
      "<a class='browzine-article-link summonBtn customPrimaryLink' href='{articleLinkUrl}' target='_blank' onclick='browzine.summon.transition(event, this)'>{paperIcon}<span style='margin-left: 0px;'>{articleLinkText}</span></a>" +
    "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{paperIcon}/g, paperIcon);

    return template;
  };

  function eocLinkTemplate(articleEocNoticeUrl) {
    var articleLinkUrl = articleEocNoticeUrl;
    var paperIcon = getRetractionWatchIconSvg();

   var articleLinkTextWording = browzine.articleExpressionOfConcernWording || "Expression of Concern";
   var articleLinkText = browzine.articleExpressionOfConcernText || "More Info";

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articleLinkTextWording}</span>" +
      "<a class='browzine-article-link summonBtn customPrimaryLink' href='{articleLinkUrl}' target='_blank' onclick='browzine.summon.transition(event, this)'>{paperIcon}<span style='margin-left: 0px;'>{articleLinkText}</span></a>" +
    "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{paperIcon}/g, paperIcon);

    return template;
  };

  function problematicJournalArticleNoticeLinkTemplate(problematicJournalArticleNoticeUrl) {
    var articleLinkUrl = problematicJournalArticleNoticeUrl;
    var paperIcon = getRetractionWatchIconSvg();

   var articleLinkTextWording = browzine.problematicJournalWording || "Problematic Journal";
   var articleLinkText = browzine.problematicJournalText || "More Info";

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articleLinkTextWording}</span>" +
      "<a class='browzine-article-link summonBtn customPrimaryLink' href='{articleLinkUrl}' target='_blank' onclick='browzine.summon.transition(event, this)'>{paperIcon}<span style='margin-left: 0px;'>{articleLinkText}</span></a>" +
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
    var bookIcon = getBookIconSvg();

    if (isJournal(scope)) {
      wording = "View the Journal";
      browzineWebLinkText = "Browse Now";

      if (+browzine.version >= 2) {
        wording = browzine.journalWording || wording;
        browzineWebLinkText = browzine.journalBrowZineWebLinkText || browzineWebLinkText;
      }
    }

    if (isArticle(scope)) {
      wording = "View in Context";
      browzineWebLinkText = "Browse Journal";

      if (+browzine.version >= 2) {
        wording = browzine.articleWording || wording;
        browzineWebLinkText = browzine.articleBrowZineWebLinkText || browzineWebLinkText;
      }
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{wording}</span><a class='browzine-web-link summonBtn customPrimaryLink' href='{browzineWebLink}' target='_blank' onclick='browzine.summon.transition(event, this)'>{bookIcon}<span style='margin-left: 2px;'>{browzineWebLinkText}</span></a>" +
    "</div>";

    template = template.replace(/{wording}/g, wording);
    template = template.replace(/{browzineWebLink}/g, browzineWebLink);
    template = template.replace(/{browzineWebLinkText}/g, browzineWebLinkText);
    template = template.replace(/{bookIcon}/g, bookIcon);

    return template;
  };

  function unpaywallArticlePDFTemplate(directToPDFUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl) {
    var pdfIcon = getPdfIconSvg();
    var pdfIconWidth = "13";

    var articlePDFDownloadWording = "View Now (via Unpaywall)";
    var articlePDFDownloadLinkText = "PDF";

    if (+browzine.version >= 2) {
      articlePDFDownloadWording = browzine.articlePDFDownloadViaUnpaywallWording || articlePDFDownloadWording;
      articlePDFDownloadLinkText = browzine.articlePDFDownloadViaUnpaywallLinkText || articlePDFDownloadLinkText;
    }

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "More Info";
    } else if (showEocNoticeUI(articleEocNoticeUrl)) {
      directToPDFUrl = articleEocNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.articleExpressionOfConcernWording || "Expression of Concern";
      articlePDFDownloadLinkText = browzine.articleExpressionOfConcernText || "More Info";
    } else if (showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl)) {
      directToPDFUrl = problematicJournalArticleNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.problematicJournalWording || "Problematic Journal";
      articlePDFDownloadLinkText = browzine.problematicJournalText || "More Info";
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
    var paperIcon = getPaperIconSvg();

    var articleLinkTextWording = "View Now (via Unpaywall)";
    var articleLinkText = "Article Page";

    if (+browzine.version >= 2) {
      articleLinkTextWording = browzine.articleLinkViaUnpaywallWording || articleLinkTextWording;
      articleLinkText = browzine.articleLinkViaUnpaywallLinkText || articleLinkText;
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articleLinkTextWording}</span><a class='unpaywall-article-link summonBtn customPrimaryLink' href='{articleLinkUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{paperIcon}<span style='margin-left: 3px;'>{articleLinkText}</span></a>" +
    "</div>";

    template = template.replace(/{articleLinkTextWording}/g, articleLinkTextWording);
    template = template.replace(/{articleLinkUrl}/g, articleLinkUrl);
    template = template.replace(/{articleLinkText}/g, articleLinkText);
    template = template.replace(/{paperIcon}/g, paperIcon);

    return template;
  };

  function unpaywallManuscriptPDFTemplate(directToPDFUrl, articleRetractionUrl, articleEocNoticeUrl, problematicJournalArticleNoticeUrl) {
    var pdfIcon = getPdfIconSvg();
    var pdfIconWidth = "13";

    var articlePDFDownloadWording = "View Now (Accepted Manuscript via Unpaywall)";
    var articlePDFDownloadLinkText = "PDF";

    if (+browzine.version >= 2) {
      articlePDFDownloadWording = browzine.articleAcceptedManuscriptPDFViaUnpaywallWording || articlePDFDownloadWording;
      articlePDFDownloadLinkText = browzine.articleAcceptedManuscriptPDFViaUnpaywallLinkText || articlePDFDownloadLinkText;
    }

    if (showRetractionWatchUI(articleRetractionUrl)) {
      directToPDFUrl = articleRetractionUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.articleRetractionWatchTextWording || "Retracted Article";
      articlePDFDownloadLinkText = browzine.articleRetractionWatchText || "More Info";
    } else if (showEocNoticeUI(articleEocNoticeUrl)) {
      directToPDFUrl = articleEocNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.articleExpressionOfConcernWording || "Expression of Concern";
      articlePDFDownloadLinkText = browzine.articleExpressionOfConcernText || "More Info";
    } else if (showProblematicJournalArticleNoticeUI(problematicJournalArticleNoticeUrl)) {
      directToPDFUrl = problematicJournalArticleNoticeUrl;
      pdfIcon = getRetractionWatchIconSvg();
      articlePDFDownloadWording = browzine.problematicJournalWording || "Problematic Journal";
      articlePDFDownloadLinkText = browzine.problematicJournalText || "More Info";
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
    var paperIcon = getPaperIconSvg();

    var articleLinkTextWording = "View Now (via Unpaywall)";
    var articleLinkText = "Article Page";

    if (+browzine.version >= 2) {
      articleLinkTextWording = browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallWording || articleLinkTextWording;
      articleLinkText = browzine.articleAcceptedManuscriptArticleLinkViaUnpaywallLinkText || articleLinkText;
    }

    var template = "<div class='browzine'>" +
      "<span class='contentType' style='margin-right: 4.5px;'>{articleLinkTextWording}</span><a class='unpaywall-manuscript-article-link summonBtn customPrimaryLink' href='{articleLinkUrl}' target='_blank' style='text-decoration: underline; color: #333;' onclick='browzine.summon.transition(event, this)'>{paperIcon}<span style='margin-left: 3px;'>{articleLinkText}</span></a>" +
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
        var articleEocNoticeUrl = getArticleEOCNoticeUrl(scope, data);
        var problematicJournalArticleNoticeUrl = getProblematicJournalArticleNoticeUrl(scope, data);
        var unpaywallUsable = getUnpaywallUsable(scope, data);

        var libKeyLinkOptimizer = document.createElement("div");
        libKeyLinkOptimizer.className = "libkey-link-optimizer";
        libKeyLinkOptimizer.style = "display: flex; justify-content: flex-start;";

        if (directToPDFUrl && isArticle(scope) && showDirectToPDFLink()) {
          var template = directToPDFTemplate(directToPDFUrl, articleRetractionUrl, articleEocNoticeUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }

        if ((!directToPDFUrl || (showFormatChoice() && !articleRetractionUrl && !articleEocNoticeUrl)) && articleLinkUrl && isArticle(scope) && showDirectToPDFLink() && showArticleLink()) {
          var template = articleLinkTemplate(articleLinkUrl, articleRetractionUrl, articleEocNoticeUrl);
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

        if (!directToPDFUrl && !articleLinkUrl && !articleRetractionUrl && !articleEocNoticeUrl && problematicJournalArticleNoticeUrl && isArticle(scope) && showExpressionOfConcern()) {
          var template = problematicJournalArticleNoticeLinkTemplate(problematicJournalArticleNoticeUrl);
          libKeyLinkOptimizer.innerHTML += template;
        }



        if (libKeyLinkOptimizer.innerHTML) {
          var secondaryTitle = libKeyLinkOptimizer.querySelector(".browzine:nth-child(2) .contentType");

          if (secondaryTitle) {
            secondaryTitle.remove();
          }

          $(documentSummary).find(".docFooter .row:eq(0)").prepend(libKeyLinkOptimizer);
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

        if (!showLinkResolverLink() && (directToPDFUrl || articleLinkUrl)) {
          var contentLinkElement = $(documentSummary).find(".availabilityContent");

          if (contentLinkElement) {
            contentLinkElement.remove();
          }
        }

        if ((directToPDFUrl || articleLinkUrl) && enableLinkOptimizer()) {
          var intervals = 0;

          (function poll() {
            var quickLinkElement = $(documentSummary).find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");

            if (quickLinkElement.length > 0) {
              quickLinkElement.remove();
            } else {
              if (intervals < 120) {
                intervals++;
                requestAnimationFrame(poll);
              }
            }
          })();
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
                $(documentSummary).find(".docFooter .row:eq(0)").prepend(template);
              }

              if (!showLinkResolverLink() && template) {
                var contentLinkElement = $(documentSummary).find(".availabilityContent");

                if (contentLinkElement) {
                  contentLinkElement.remove();
                }
              }

              if (template) {
                var intervals = 0;

                (function poll() {
                  var quickLinkElement = $(documentSummary).find(".docFooter .availabilityFullText a[display-text='::i18n.translations.PDF']");

                  if (quickLinkElement.length > 0) {
                    quickLinkElement.remove();
                  } else {
                    if (intervals < 120) {
                      intervals++;
                      requestAnimationFrame(poll);
                    }
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
    getArticleEOCNoticeUrl: getArticleEOCNoticeUrl,
    isUnknownVersion: isUnknownVersion,
    isTrustedRepository: isTrustedRepository,
    getUnpaywallArticlePDFUrl: getUnpaywallArticlePDFUrl,
    getUnpaywallArticleLinkUrl: getUnpaywallArticleLinkUrl,
    getUnpaywallManuscriptArticlePDFUrl: getUnpaywallManuscriptArticlePDFUrl,
    getUnpaywallManuscriptArticleLinkUrl: getUnpaywallManuscriptArticleLinkUrl,
    getUnpaywallUsable: getUnpaywallUsable,
    showJournalCoverImages: showJournalCoverImages,
    showJournalBrowZineWebLinkText: showJournalBrowZineWebLinkText,
    showArticleBrowZineWebLinkText: showArticleBrowZineWebLinkText,
    showDirectToPDFLink: showDirectToPDFLink,
    showArticleLink: showArticleLink,
    showPrintRecords: showPrintRecords,
    showRetractionWatch: showRetractionWatch,
    showExpressionOfConcern: showExpressionOfConcern,
    showFormatChoice: showFormatChoice,
    showLinkResolverLink: showLinkResolverLink,
    enableLinkOptimizer: enableLinkOptimizer,
    isFiltered: isFiltered,
    transition: transition,
    browzineWebLinkTemplate: browzineWebLinkTemplate,
    directToPDFTemplate: directToPDFTemplate,
    articleLinkTemplate: articleLinkTemplate,
    retractionWatchLinkTemplate: retractionWatchLinkTemplate,
    eocLinkTemplate: eocLinkTemplate,
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
