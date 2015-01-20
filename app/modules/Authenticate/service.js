(function() {
  "use strict";

  angular
    .module("segue.submission.authenticate.service", [
      'segue.submission',
      'http-auth-interceptor',
      'ngStorage',
      'restangular'
    ])
    .factory('authTokenInterceptor', function($window, LocalSession) {
      return {
        request: function (config) {
          config.headers = config.headers || {};
          config.headers.Authorization = 'Bearer '+ LocalSession.current().token;
          return config;
        }
      };
    })
    .config(function ($httpProvider) {
      $httpProvider.interceptors.push('authTokenInterceptor');
    })
    .service("LocalSession", function($localStorage, $rootScope) {
      var self = {};

      self.create = function(data) {
        $localStorage.session = { token: data.token, account: data.account };
        $rootScope.$broadcast('auth:login');
        return data.account;
      };

      self.current = function(data) {
        return $localStorage.session || {};
      };

      self.destroy = function() {
        delete $localStorage.session;
        $rootScope.$broadcast('auth:logout');
      };

      return self;
    })
    .service("Auth", function(Restangular, LocalSession) {
      var session = Restangular.service('session');

      self.logout = function() {
        LocalSession.destroy();
      };

      self.login = function(email, password) {
        LocalSession.destroy();
        return session.post({ email: email, password: password })
                      .then(LocalSession.create);
      };

      self.account = function() {
        return LocalSession.current().account;
      };
      self.token = function() {
        return LocalSession.current().token;
      };

      return self;
    });
})();
