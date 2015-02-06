(function() {
  angular
    .module('segue.submission.errors', [])
    .service('FormErrors', function($rootScope) {
      var self = this;
      var errors = {};
      var codes = _(tv4.errorCodes).invert().value();

      self.clear = function() {
        errors = {};
        $rootScope.$broadcast('errors:clear');
      };

      self.set = function(errors) {
        _.each(errors, function(error) {
          var field = error.field || error.params.key || error.dataPath.replace('/','');
          var label = error.label || codes[error.code].toLowerCase();
          var path = field + "." + label;
          $rootScope.$broadcast('errors:set', path);
          console.log(path);
        });
      };
      return self;
    })
    .directive('formErrorAny', function() {
      return function(scope, elem, attr) {
        elem.addClass("ng-hide");
        elem.addClass("error");
        scope.$on('errors:clear', function(e) { elem.addClass('ng-hide'); });
        scope.$on('errors:set',   function(e) { elem.removeClass('ng-hide'); });
      };
    })
    .directive('formError', function() {
      return function(scope, elem, attr) {
        elem.addClass("ng-hide");
        elem.addClass("error");
        var myError = attr.formError;

        scope.$on('errors:clear', function(e, name) {
          elem.addClass("ng-hide");
        });
        scope.$on('errors:set', function(e, name) {
          if (myError == name) {
            elem.removeClass("ng-hide");
          }
        });
      };
    });
})();