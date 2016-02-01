(function(){
	'use strict';
	
	angular.module('app.directives')
		.directive('ageValidation', function() {
			return {
				require: 'ngModel',
				link: function(scope, elm, attrs, ctrl) {
					// validate incorrect
					ctrl.$validators.incorrect = function(modelValue, viewValue) {
				        return isNumber(viewValue);
				    };

					ctrl.$validators.noSpaces = function(modelValue, viewValue) {
						return (/^[^\s]+$/).test(viewValue);
					};

  					if (angular.isDefined(attrs.ageMin)) {
						ctrl.$validators.ageMin = function(modelValue, viewValue) {
							if(isNumber(viewValue)) {
					        	return  toInt(attrs.ageMin) <= toInt(viewValue);
					        }
					    };
  					}

  					if (angular.isDefined(attrs.ageMax)) {
						ctrl.$validators.ageMax = function(modelValue, viewValue) {
							if(isNumber(viewValue)) {
					        	return toInt(viewValue) <= toInt(attrs.ageMax);
					        }
					    };
  					}

  					function toInt(val) {
  						return parseInt(val, 10);
  					}

  					function isNumber(val) {
  						return (/^(?!\s.*$)[1-9]+[0-9]+(?!\s.*$)$/).test(val);
  					}
				}
			};
		});
})();