(function(){
	'use strict';

	angular.module("app.pages")
		.controller("ProfileCtrl", ['$rootScope', 'mainFactory', function($rootScope, mainFactory) {
			var vm = this;
			vm.user = {}; // Default form empty object
			
			loadData(); // This realized to call many times when needed

			function loadData() {
				vm.formDisabled = true;
				mainFactory.profile().then(function(data) {
					vm.user = data;
					vm.formDisabled = false;
				}, function(data) {
					vm.formDisabled = false;
				});
			}
		}]);
})();