(function(){
	'use strict';

	angular.module('app.directives')
		.controller('ToolbarCtrl', ['$scope', '$translate', '$mdSidenav', 'appConfig', 'mainFactory', function($scope, $translate, $mdSidenav, appConfig, mainFactory) {
			var vm = this;
			vm.isFabOpen = false; // The state of FAB speed dial
			vm.langs = appConfig.langs; // Arrays of languages from constant
			
			vm.isLoggedIn = mainFactory.isLoggedIn; // The state of login
			vm.toggleSideNav = function() {
				$mdSidenav('left').toggle();
			};

			/**
			 * Switch language
			 */
			vm.switchLang = function(lang) {
				$translate.use(lang);
			};

			/**
			 * Check lang is current language
			 */
			vm.currentLang = function(lang) {
				return ($translate.proposedLanguage() || $translate.use() === lang);
			};

			// On opening, add a delayed property which shows tooltips after the speed dial has opened
			// so that they have the proper position; if closing, immediately hide the tooltips
			$scope.$watch('isFabOpen', function(isOpen) {
				if (isOpen) {
					$timeout(function() {
						$scope.tooltipVisible = vm.isFabOpen;
					}, 600);
				} else {
					$scope.tooltipVisible = vm.isFabOpen;
				}
			});
		}]);
})();