(function(){
	'use strict';

	angular.module("app.pages")
		.controller("ForgotCtrl", ['$mdDialog', '$filter', '$state', 'mainFactory', function($mdDialog, $filter, $state, mainFactory) {
			var vm = this;
			vm.user = {}; // Default form empty object
			vm.formDisabled = false;

			/**
			 * Submit form
			 */
			vm.submit = function(isValid) {
				if(isValid) {
					vm.formDisabled = true;
					mainFactory.forgot(vm.user).then(function(data){
						if(data) {
							var alert = $mdDialog.alert()
								.clickOutsideToClose(true)
								.title($filter('translate')("forgot.modal.title"))
								.textContent(data)
								.ariaLabel($filter('translate')("forgot.modal.aria"))
								.ok($filter('translate')("forgot.modal.ok"));
							$mdDialog.show(alert).finally(function() {
						    	$state.go('auth.login');
						    });
						} else {
							vm.hasError = 'msg.usernameNotFound';
						}
						vm.formDisabled = false;
					}, function(data) {
						vm.hasError = data || "msg.requestFailed";
						vm.formDisabled = false;
					});
				}
			};
		}]);
})();