(function(){
	'use strict';

	angular.module('app.directives')
		.directive('sidebar', function() {
			return {
				restrict: 'EA',
				replace: true,
				templateUrl: ns.directives + 'sidebar/tpl/sidebar.tpl.html',
				controller: 'SidebarCtrl',
				controllerAs: 'sb'
			};
		});
})();