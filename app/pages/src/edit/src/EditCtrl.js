(function(){
	'use strict';

	angular.module("app.pages")
		.controller("EditCtrl", ['$state', '$translate', 'mainFactory', function($state, $translate, mainFactory) {
			var vm = this;
			vm.user = {}; // Default form empty object
			vm.pwdType = 'password'; // Current password input type
			vm.pwdIcon = 'visibility_off'; // Current password icon
			vm.formDisabled = false;

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

			vm.submit = function(isValid) {
				if(isValid) {
					vm.formDisabled = true;
					mainFactory.setProfile(vm.user).then(function(data) {
						if(data) {
							$translate('msg.updateSuccessfully').then(function(data) {
								mainFactory.msg(data);
							});
							$state.go('profile');
						} else {
							vm.hasError = 'msg.updateFailed';
						}
						vm.formDisabled = false;
					}, function(data) {
						vm.hasError = data || "msg.requestFailed";
						vm.formDisabled = false;
					});
				}
			};
			vm.pwdVisible = function() {
				if (vm.pwdType === 'password') {
			    	vm.pwdType = 'text';
					vm.pwdIcon = 'visibility';
			    } else {
			      	vm.pwdType = 'password';
					vm.pwdIcon = 'visibility_off';
			    }
			};
		}]);
})();