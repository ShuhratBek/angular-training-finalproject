(function(){
	'use strict';

	angular.module('app.directives')
		.directive('toolbar', function() {
			return {
				restrict: 'EA',
				replace: true,
				transclude: true,
				templateUrl: ns.directives + 'toolbar/tpl/toolbar.tpl.html',
				controller: 'ToolbarCtrl',
				controllerAs: 'tb'
			};
		});
})();