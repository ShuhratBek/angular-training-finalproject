(function(){
	'use strict';

	angular.module('app.directives')
		.directive('errorBox', function() {
			return {
				restrict: 'EA',
				transclude: true,
				templateUrl: ns.directives + 'error_box/tpl/errorBox.tpl.html'
			};
		});
})();