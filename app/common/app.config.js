var ns = {};
ns.directives = './app/directives/src/';
ns.services = './app/services/';
ns.pages = './app/pages/src/';
ns.common = './app/common/';

(function(){
	'use strict';

	angular
		.module('app')
		.constant('appConfig', {
			langs: [
				{
					name: 'langs.RU.name',
					tooltip: 'langs.RU.tooltip',
					lang: 'ru'
				},
				{
					name: 'langs.EN.name',
					tooltip: 'langs.EN.tooltip',
					lang: 'en'
				}
			]
		})
		.config(['$mdThemingProvider', function($mdThemingProvider) {
			// Theme configuration for angular-material
			$mdThemingProvider
				.theme('default')
				.primaryPalette('teal');
		}])
		.config(['$translateProvider', function($translateProvider) {
			$translateProvider
				.useStaticFilesLoader({
					prefix: './lang/lang-',
					suffix: '.json'
				})
				.preferredLanguage('en')
				.useMissingTranslationHandlerLog()
				.useSanitizeValueStrategy(null);;
		}])
		.config(['KeepaliveProvider', 'IdleProvider', function(KeepaliveProvider, IdleProvider) {
			IdleProvider.idle(100000);
			IdleProvider.timeout(100000);
			KeepaliveProvider.interval(100000);
		}])
		.config(['$httpProvider', '$locationProvider', function($httpProvider, $locationProvider) {
			$httpProvider.interceptors.push(function($q, $location, $rootScope) {
	            return {
	              responseError: function(response) {
	                if(response.status === 401 || response.status === 403) {
	                  $location.path('/login');
	                }
	                return $q.reject(response);
	              }
	            };
          	});
		}])
		.run(['$rootScope', '$state', '$cookies', 'mainFactory', 'Idle', 'Keepalive', function($rootScope, $state, $cookies, mainFactory, Idle, Keepalive) {
			$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
				Idle.watch();
				if(toState.loginRequired && !mainFactory.isLoggedIn() && toState.name !== 'auth.login'){
					event.preventDefault();
					$state.go('logout');
				}
				if(mainFactory.isLoggedIn() && toState.name === 'auth.login'){
					event.preventDefault();
					$state.go('user.profile');
				}
			});
			$rootScope.$on('IdleTimeout', function() {
				mainFactory.logOut();
				$state.go('logout');
			});
		}]);
})();