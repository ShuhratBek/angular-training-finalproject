(function(){
	'use strict';

	angular.module("app.pages")
		.controller("SigninCtrl", ['$state', '$translate', 'mainFactory', function($state, $translate, mainFactory) {
			var vm = this;
			vm.user = {};
			vm.formDisabled = false;

			vm.submit = function(isValid) {
				if(isValid) {
					vm.hasError = '';
					vm.formDisabled = true;
					mainFactory.signIn(vm.user).then(function(data) {
						if(!data) {
							vm.hasError = 'msg.incorrectSignIn';
						} else {
							vm.hasError = '';

							$translate('welcome').then(function(data) {
								mainFactory.msg(data + vm.user.username + '!');
							});
							$state.go('user.profile');
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