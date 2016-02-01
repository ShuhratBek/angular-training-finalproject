(function(){
	'use strict';

	angular.module('tree', [])
	.directive('treeView', function() {
	    return {     
	        restrict: 'E',
	        replace: true,
	        scope: {
	            tree: '=source'
	        },
	        templateUrl: ns.directives + 'treeview/src/tpl/treeview_container.tpl.html',
	        controller: ["$scope", "TreeviewFactory", function ($scope, TreeviewFactory) {
	        	if(!$scope.tree) {
	        		TreeviewFactory.get(0).then(function(data) {
	                	if(data) {
	                		$scope.tree = {};
	                		$scope.tree.nodes=data;
	                	}
	                });
	        	}

	        	$scope.notFound = function() {
	        		return $scope.query && $scope.query.length > 0 && $scope.count() === 0;
	        	};

	        	$scope.clearSearch = function() {
	        		$scope.query = '';
	        		$scope.countSearch();
	        	};

	        	$scope.count = function() {
	        		return TreeviewFactory.getSearchCount();
	        	};

	        	$scope.countSearch = function() {
	        		TreeviewFactory.countSearch($scope.tree.nodes, $scope.query);
	        	};

	        	$scope.$on('callTreeCount', function() {
				    $scope.countSearch();
				});
	        }]
	    };
	})
	.directive('treeNode', function() {
	    return {     
	        restrict: 'E',
	        replace: true,
	        scope: {
	            tree: '=source',
	            query: '=query'
	        },
	        templateUrl: ns.directives + 'treeview/src/tpl/treeview.tpl.html'
	    };
	})
	.factory("TreeviewFactory", function($http, $filter) {
		var treeView = {
				get: getNodes,
				getSearchCount: getSearchCount,
				countSearch: countSearch
			};
		var searchItems = 0;
		return treeView;
		
		function getNodes(id) {
			if(!id) {
				id = 0;
			}
			return $http.get('nodes/' + id).then(successCallback, errorCallback);
		}

		function successCallback(response) {
			var res = response.data;
			if(res.nodes) {
				return $filter('limitTo')(res.nodes, 10);
			} else {
				return false;
			}
		}

		function errorCallback(response) {
			return false;
		}

		function getSearchCount() {
			return searchItems;
		}

    	function countSearch(nodes, query) {
    		searchItems = 0;
    		if(query && query.length > 0){
    			inNodes(nodes, query);
    		}
    	}
    	function inNodes(nodes, query) {
    		angular.forEach(nodes, function(value, key) {
    			if(value.title.toLowerCase().indexOf(angular.lowercase(query)) >= 0){
        			searchItems++;
        		}
    			inNodes(value.nodes, query);
    		});
    	}
	})
	.directive('subNode', function ($compile) {
	    return {
	        restrict: 'E',
	        replace: true,
	        scope:{
	            node: '=cnode',
	            query: '=query'
	        },
	        templateUrl: ns.directives + 'treeview/src/tpl/node.tpl.html', // HTML for a single node.
	        link: function ($scope, $element) {
	            if ($scope.node && $scope.node.nodes) {
	                $scope.node.childrenVisibility = true;
	                var childNode = $compile('<tree-node ng-if="!node.childrenVisibility" source="node" query="query" count="count"></tree-node>')($scope);
	                $element.append(childNode);
	            } else {
	                $scope.node.childrenVisibility = false;
	            }
	        },
	        controller: ["$rootScope", "$scope", "TreeviewFactory", function ($rootScope, $scope, TreeviewFactory) {
	            $scope.toggleVisibility = function (node) {
	                if(node.nodes) {
	                    node.childrenVisibility = !node.childrenVisibility;
	                }
	                if(!node.childrenVisibility) {
		                TreeviewFactory.get(node.id).then(function(data) {
		                	if(data) {
		                		node.nodes=data;
		                		$rootScope.$broadcast('callTreeCount');
		                	}
		                });
		            }
	            };
	            $scope.search = function(item) {
	    			return $scope.query && $scope.query.length > 0 && item.title.toLowerCase().indexOf(angular.lowercase($scope.query)) >= 0;
	            };
	            $scope.icon = function(node) {
	                if (angular.isArray(node.nodes)) {
	                	if(node.childrenVisibility) {
	                		return 'add_box';
	                	} else {
	                		return 'indeterminate_check_box';
	                	}
	                } else {
	                	return 'description';
	                }
	            };
	            // Here We are marking check/un-check all the nodes.
	            // $scope.checkNode = function (selectednode) {

	            //     if (selectednode.checked != undefined) {
	            //         var has_child = angular.isArray(selectednode.nodes);
	            //         if (has_child = true)
	            //         {
	            //             checkChildren(selectednode);
	            //         }
	            //     }
	            //     function checkChildren(c) {
	            //         angular.forEach(c.nodes, function (c) {
	            //             c.checked = selectednode.checked;
	            //         });

	            //     }
	            // };
	        }]
	    };
	})
	.directive('more', function() {
	    return {
	        restrict: 'E',
	        replace: true,
	        scope:{
	            node: '=cnode'
	        },
	        templateUrl: ns.directives + 'treeview/src/tpl/more.tpl.html',
	        controller: ["$rootScope", "$scope", "TreeviewFactory", function ($rootScope, $scope, TreeviewFactory) {
	            $scope.more = function (node) {
	                TreeviewFactory.get(node.length).then(function(data) {
	                	if(data) {
	                		angular.forEach(data, function(c) {
								node.push(c);
	                		});
							$rootScope.$broadcast('callTreeCount');
	                	}
	                });
	            };
	        }]
	    };
	});
})();