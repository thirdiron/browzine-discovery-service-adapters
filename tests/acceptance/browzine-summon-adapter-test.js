describe("BrowZine Summon Adapter", function() {
  var compile, scope, directiveElement, httpBackend;

  function getCompiledElement() {
    var compiledDirective = compile(angular.element("<div class='documentSummary' document-summary><div class='coverImage'><img src=''/></div><div class='docFooter'><div class='row'></div></div></div>"))(scope);
    scope.$digest();
    return compiledDirective;
  }

  describe("search results journal", function() {
    beforeEach(function() {
      module('summonApp.directives');

      inject(function ($compile, $rootScope, $httpBackend) {
        compile = $compile;
        scope = $rootScope.$new();
        httpBackend = $httpBackend;

        scope.document = {
          content_type: "Journal",
          issns: ["0028-4793"]
        };

        var url = "https://apiconnector.thirdiron.com/v1/libraries/118/journals?ISSN=00284793";

        httpBackend.whenGET(url).respond({
          "data": [{
            "id": 10292,
            "type": "journals",
            "title": "New England Journal of Medicine (NEJM)",
            "issn": "00284793",
            "sjrValue": 14.619,
            "coverImageUrl": "https://assets.thirdiron.com/images/covers/0028-4793.png",
            "browzineEnabled": true,
            "browzineWebLink": "https://browzine.com/libraries/118/journals/10292"
          }]
        });
      });

      directiveElement = getCompiledElement();
    });

    it("should have an enhanced browse journal in browzine option", function() {
      httpBackend.flush();

      var template = directiveElement.find(".browzine");
      expect(template).toBeDefined();
      expect(template.text().trim()).toEqual("View the Journal: Browse Now");
      expect(template.find("a.browzine-web-link").attr("href")).toEqual("https://browzine.com/libraries/118/journals/10292");
      expect(template.find("a.browzine-web-link").attr("target")).toEqual("_blank");
      expect(template.find("img.browzine-book-icon").attr("src")).toEqual("https://s3.amazonaws.com/thirdiron-assets/images/integrations/browzine_open_book_icon.png");
    });

    it("should have an enhanced browzine journal cover", function() {
      httpBackend.flush();

      var coverImage = directiveElement.find(".coverImage img");
      expect(coverImage).toBeDefined();
      expect(coverImage.attr("src")).toEqual("https://assets.thirdiron.com/images/covers/0028-4793.png");
    });
  });
});
