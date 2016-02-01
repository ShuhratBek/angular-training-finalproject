(function() {
	'use strict';

	angular.module('chart', [])
		.factory('Point', function() {
			function Point(x, y) {
				this.x = x;
				this.y = y;
			};

			Point.prototype.toString = function() {
				return this.x + ',' + this.y;
			};

			return Point;
		})
		.constant('chartConfig', {
			height: 400,
			width: 800
		})
		.controller('chartCtrl', ['$scope', 'Point', '$element', '$window', function($scope, Point, $element, $window) {
			var series;
			var vm = this;

			vm.gridLines = 5;
			vm.grid = [];
			vm.gridOffset = 50;

			vm.yLabels = [];
			vm.yLabelConfig = {
				style: 'color:#606060;cursor:default;font-size:11px;fill:#606060;width:428px;text-overflow:clip;',
				textAnchor: 'end',
				opacity: 1
			};
			vm.xLabelConfig = {
				style: "color:#606060;cursor:default;font-size:11px;fill:#606060;width:99px;text-overflow:clip;",
				textAnchor: "middle"
			}
			vm.xLabelx = 0;
			vm.series = series = [];

			vm.addSeries = function(seriesScope) {
				series.push(seriesScope);
			};

			vm.setLines = function() {
				var maxValue = 0;
				var maxValuesLen = 0;

				angular.forEach(series, function(series) {
					if (series.values.length > maxValuesLen) maxValuesLen = series.values.length;
					angular.forEach(series.values, function(value) {
						if (value > maxValue) maxValue = value;
					});
				});
				angular.forEach(series, function(series) {
					series.points = [];
					vm.xLabels = [];
					angular.forEach(series.values, function(value, index) {
						var x = (index * ($scope.width-vm.gridOffset) / maxValuesLen)+vm.gridOffset || 0;
						var y = value * ($scope.height / maxValue);
						series.points.push(new Point(x, y));
					  	var xLabel = {};
					  	xLabel.style = vm.yLabelConfig.style;
					  	xLabel.textAnchor = vm.xLabelConfig.textAnchor;
					  	xLabel.x = (index * ($scope.width-vm.gridOffset) / maxValuesLen)+vm.gridOffset || 0;
					  	xLabel.text = vm.xLabelx;
					  	vm.xLabels.push(xLabel);
					vm.xLabelx++;
					});
				});
				vm.grid = [];
				vm.yLabels = [];
				var total = Math.ceil(Math.max(maxValue, 0) / (vm.gridLines));
				for(var i=0;i<=vm.gridLines;i++) {
					var line = {};
					var y = $scope.height - (i * ($scope.height / vm.gridLines));
					line.d = 'M ' + vm.gridOffset + ' ' + y + ' L ' + ($scope.width-vm.gridOffset) + ' ' + y;
					line.stroke = '#D8D8D8';
					line.width = 1;
				  	vm.grid.push(line);
				  	var yLabel = {};
				  	yLabel.style = vm.yLabelConfig.style;
				  	yLabel.textAnchor = vm.yLabelConfig.textAnchor;
				  	yLabel.opacity = vm.yLabelConfig.opacity;
				  	yLabel.x = vm.gridOffset/2;
				  	yLabel.y = $scope.height - y;
				  	yLabel.text = Math.max(maxValue - (i*total),0);
				  	vm.yLabels.push(yLabel);
				}
			};
		}])
		.directive('chart', ['chartConfig', function(chartConfig) {
			return {
				restrict: 'EA',
				replace: true,
				controller: 'chartCtrl',
				controllerAs: 'ct',
				templateUrl: ns.directives + 'chart/src/tpl/chart.tpl.html',
				transclude: true,
				scope: {
					h: '@h',
					w: '@w'
				},
				link: function(scope, element, attrs, ctrl) {
					scope.height = angular.isDefined(scope.h) ? scope.$eval(scope.h) : chartConfig.height;
					scope.width = angular.isDefined(scope.w) ? scope.$eval(scope.w): chartConfig.width;
				}
			};
		}])
		.directive('chartSeries', ['$parse', function($parse) {
			return {
				restrict: 'EA',
				require: '^chart',
				replace: true,
				templateNamespace: 'svg',
				template: '<g><g><polyline class="path" ng-attr-points="{{points.join(\' \')}}" transform="translate(0,0)" /></g><chart-dots></chart-dots></g>',
				scope: {
					vals: '@values'
				},
				link: function(scope, element, attrs, ctrl) {
					var getValues = $parse(scope.vals);

					scope.values = getValues();
					ctrl.addSeries(scope);
					scope.$watchCollection('vals', function() {
						scope.values = $parse(scope.vals)();
						ctrl.setLines();
						var target = document.querySelector('polyline');
						angular.element(target).removeClass('path').addClass('path');
					});
				}
			};
		}])
		// .directive('chartGrid', function() {
		// 	return {
		// 		restrict: 'EA',
		// 		require: '^chart',
		// 		replace: true,
		// 		templateNamespace: 'svg',
		// 		template: '<g class="grid" zIndex="1">' + 
		// 						'<path ng-repeat="gr in att.grid" fill="none" ng-attr-d="{{gr.d}}" stroke="#D8D8D8" stroke-width="1" zIndex="1" opacity="1"></path>' + 
		// 					'</g>',
		// 		scope: {
		// 			att: '$att'
		// 		}
		// 	};
		// })
		.directive('chartDots', function() {
			return {
				restrict: 'EA',
				replace: true,
				template: '<g class="dots" zIndex="1"><circle ng-repeat="cr in points" ng-attr-cx="{{cr.x}}" ng-attr-cy="{{cr.y}}" r="5" stroke="{{colour}}" stroke-width="2" fill="white"></circle></g>'
			};
		});
})();