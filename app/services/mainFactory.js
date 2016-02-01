(function(){
	'use strict';

	angular.module('app.services', [])
		.factory('mainFactory', ['$rootScope', '$http', '$cookies', '$state', '$mdToast', '$translate', '$filter', function($rootScope, $http, $cookies, $state, $mdToast, $translate, $filter) {
			var user = {
					signIn: signIn,
					isLoggedIn: isLoggedIn,
					logOut: logOut,
					msg: msg,
					profile: profile,
					forgot: forgot,
					setLoading: setLoading,
					isLoading: isLoading,
					setProfile: setProfile
				},
				loadingState = false;

			return user;

			function signIn(formData) {
	            return $http.post('login', formData).then(successCallback, errorCallback);
	            function successCallback(response) {
	            	var data = response.data;
	            	if(data.success === true){
		            	var globals = {
		    				currentUser: {
		    					id: data.id,
		    					username: formData.username
		    				}
		    			};
						$cookies.put('globals', angular.toJson(globals));
						return true;
		        	} else {
		        		return false;
		        	}
	            }
	            function errorCallback(response) {
	            	return response.data;
	            }
			}

			function forgot(formData) {
	            return $http.post('forgot', formData).then(successCallback, errorCallback);
	            function successCallback(response) {
	            	var data = response.data;
	            	if(data.success === true){
		            	return data.password;
		        	} else {
		        		return false;
		        	}
	            }
	            function errorCallback(response) {
	            	return response.data;
	            }
			}

			function profile() {
	            var globals = angular.fromJson($cookies.get('globals')) || {};

				return $http.get('getprofile/' + globals.currentUser.id).then(successCallback, errorCallback);

				function successCallback(response) {
					var res = response.data;
					if(res.success === true) {
						res.data.username = globals.currentUser.username;
						return res.data;
					} else {
						$translate('msg.error').then(function(data){
							user.msg(data);
						});
						return {};
					}
				}

				function errorCallback(response) {
					$translate('msg.requestFailed').then(function(data){
						user.msg(response.data || data);
					});
				}
			}

			function setProfile(formData) {
	            var globals = angular.fromJson($cookies.get('globals')) || {};

				return $http.post('setprofile/' + globals.currentUser.id, formData).then(successCallback, errorCallback);

				function successCallback(response) {
					return response.data;
				}

				function errorCallback(response) {
					return response.data;
				}
			}

			function isLoggedIn(){
				var cookies = angular.fromJson($cookies.get('globals')) || {};
	    		if(cookies.currentUser) {
	    			return true;
	    		} else {
	    			return false;
	    		}
			}

			function logOut() {
	            $cookies.remove('globals');
			}

			function msg(text) {
				$mdToast.showSimple(text);
			}

			function setLoading(state) {
				this.loadingState = state;
			}

			function isLoading() {
				return this.loadingState;
			}
		}]);
})();