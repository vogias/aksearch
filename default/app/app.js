/*
* Mathioudakis Theodore
* Agro-Know Technologies - 2013
*/


/*Define ng-app module*/
var listing = angular.module('akListing',[ 'ngRoute' , 'ui.bootstrap', 'djds4rce.angular-socialshare']);
/* var listing = angular.module('akListing',['ngRoute','mainController','listingController']); */

/*listing.run([
      '$rootScope', function ($rootScope) {
          $rootScope.facebookAppId = '273143156120711'; // set your facebook app id here
      }
  ]);
*/
angular.module('akListing').run(function($FB){
  $FB.init('754584587985536');
});

/* $locationProvider Configuration */
/*
listing.config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.html5Mode(true)
	}]);
*/

listing.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        };
    });

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

