(function(){
	'use strict';

	angular
		.module('app', [
			'ngAnimate', 
			'ngAria', 
			'ngSanitize', 
			'ngMessages', 
			'ngMaterial', 
			'ngResource',
			'ui.router',
			'ngCookies',
			'pascalprecht.translate',
			'ngIdle',
			'app.pages',
			'app.directives',
			'app.services',
			'btford.socket-io'
		]);
})();