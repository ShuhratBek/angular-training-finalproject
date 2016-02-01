(function(){
	'use strict';

	angular.module('app.directives')
		.controller('SidebarCtrl', ['$mdSidenav', 'mainFactory', function($mdSidenav, mainFactory) {
			var vm = this;
			vm.isLoggedIn = mainFactory.isLoggedIn; // The state of login
			mainFactory.profile().then(function(data) {
				vm.user = data;
			})
		}]);
})();