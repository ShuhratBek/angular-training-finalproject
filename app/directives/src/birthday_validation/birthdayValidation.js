(function(){
	'use strict';
	
	angular.module('app.directives')
		.directive('birthdayValidation', function($window) {
			return {
				require: 'ngModel',
				link: function(scope, elm, attrs, ctrl) {
					// Connect to Moment.js				
	                var moment = $window.moment;

	                // Check date is valid
	                function isDate(value) {
	                    var m = moment(value, 'DD MMMM YYYY', true);
	                    return m.isValid();
	                };

	                // validate
					ctrl.$validators.incorrect = function(modelValue, viewValue) {
				        return isDate(viewValue);
				    };
				}
			};
		});
})();