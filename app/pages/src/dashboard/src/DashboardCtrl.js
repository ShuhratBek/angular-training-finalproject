(function() {
	'use strict';

	angular.module('app.pages')
		.factory('socket', function (socketFactory) {

			return socketFactory({
				ioSocket: io.connect(':9999')
			});
		})
		.controller('DashboardCtrl', ['$scope', '$state', '$interval', 'socket', function($scope, $state, $interval, socket) {
			var colours = {
		      0: '#428bca',
		      1: '#5cb85c',
		      2: '#5bc0de',
		      3: '#f0ad4e',
		      4: '#d9534f'
		   };
		   var series = $scope.series = [];

		   var Series = function(vals) {
		      this.values = vals;
		      this.colour = colours[series.length];
		   };

		   $scope.addSeries = function() {
		      // var len = series.length + 1;
		      series.push(new Series([]));
		   };
			socket.on('chart', function (data) {
				series[0].values = data.values;
			});
		   $scope.addSeries();
		}]);
})();