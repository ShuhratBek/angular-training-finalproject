(function(){
  'use strict';

  angular
    .module('app')
      .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        //
        // For any unmatched url, redirect to /home
        $urlRouterProvider.otherwise("/");
        //
        // Now set up the states
        $stateProvider
          .state('auth', {
            abstract: true,
            templateUrl: ns.pages + "layout/auth.tpl.html"
          })
          .state('auth.login', {
            url: "/",
            templateUrl: ns.pages + "signin/src/tpl/signin.tpl.html",
            controller: "SigninCtrl",
            controllerAs: "vm",
            loginRequired: false
          })
          .state('auth.forgot', {
            url: "/forgot",
            templateUrl: ns.pages + "forgot/src/tpl/forgot.tpl.html",
            controller: "ForgotCtrl",
            controllerAs: "vm",
            loginRequired: false
          })
          .state('logout', {
            url: "/logout",
            controller: ['$state', 'mainFactory', function($state, mainFactory) {
              mainFactory.logOut();
              $state.go('auth.login');
            }],
            template: '<ui-view></ui-view>',
            loginRequired: true
          })
          .state('user', {
            abstract: true,
            templateUrl: ns.pages + "layout/user.tpl.html",
            controller: ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
              $scope.title = $state.current.title || 'title';
            }]
          })
          .state('user.profile', {
            url: "/profile",
            templateUrl: ns.pages + "profile/src/tpl/profile.tpl.html",
            controller: "ProfileCtrl",
            controllerAs: "vm",
            loginRequired: true,
            title: 'profile.title'
          })
          .state('user.edit', {
            url: "/edit",
            templateUrl: ns.pages + "edit/src/tpl/edit.tpl.html",
            controller: "EditCtrl",
            controllerAs: "vm",
            loginRequired: true,
            title: 'edit.title'
          })
          .state('user.dashboard', {
            url: "/dashboard",
            templateUrl: ns.pages + "dashboard/src/tpl/dashboard.tpl.html",
            controller: 'DashboardCtrl',
            controllerAs: 'vm',
            loginRequired: true,
            title: 'dashboard.title'
          })
          .state('user.treeview', {
            url: "/treeview",
            templateUrl: ns.pages + "treeview/src/tpl/treeview.tpl.html",
            controller: 'TreeviewCtrl',
            controllerAs: 'vm',
            loginRequired: true,
            title: 'treeview.title'
          });
      }]);
})();