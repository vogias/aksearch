/*
* Mathioudakis Theodore
* Agro-Know Technologies - 2013
*/


/*Define ng-app module*/
var listing = angular.module('akListing',[ 'ngRoute' , 'ui.bootstrap']);
/* var listing = angular.module('akListing',['ngRoute','mainController','listingController']); */

/* $locationProvider Configuration */
/*
listing.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true)
	}]);
*/



/* Shared Properties Service */
listing.service('sharedProperties',
	function () {
	    var total = 0;
	    var activeFacets = [];
	    var inactiveFacets = [];

	    return {
	        getTotal: function () {
	            return total;
	        },

	        setTotal: function(value) {
	            total = value;
	        },
	    };
	});

/*Routing*/

listing.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			// - (AKIF)
			//educational resources
			when('/search/', {
				templateUrl: drupalVariables.root + '/templates/search.html',
				controller: 'listingController'
			}).
			when('/search/:search_param', {
				templateUrl: drupalVariables.root + '/templates/search.html',
				controller: 'listingController'
			}).
			//view-item
			when('/item', {
				templateUrl: drupalVariables.root + '/templates/item.html',
				controller: 'viewItemController'
			}).
			when('/item/:itemId', {
				templateUrl: drupalVariables.root + '/templates/item.html',
				controller: 'viewItemController'
			}).
			//general
			when('/', {
/* 				templateUrl: drupalVariables.root + '/templates/main.html', */
				templateUrl: drupalVariables.root + '/templates/search.html',
				controller: 'mainController'
			}).
			otherwise({
				redirectTo: '/'
			});
	}]);

