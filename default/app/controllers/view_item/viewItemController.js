/*
* @author Mathioudakis Theodore
* Agro-Know Technologies - 2013
*
*/

/*Define viewItemController controller in 'app' */
listing.controller("viewItemController", function($rootScope, $scope, $http, $location, $routeParams) {

	/*****************************************************************************************************************/
	/*							  	GENERAL												  						     */
	/*****************************************************************************************************************/
	var language_mapping=[], audience_mapping=[];
	language_mapping['en'] = "English";

	/*AKIF URL*/
	$scope.akif = 'http://api.greenlearningnetwork.com/search-api/v1/akif/';
	//$scope.item_resource_id = '';
	$scope.item_resource_url = '';
	$scope.user_id = 23;
	$scope.domain = 'http://greenlearningnetwork.org';
	$scope.ip = '83.212.100.142';


	$scope.item_number_of_visitors = 0;
	$scope.item_average_rating = 'no rating available yet';
	$scope.item_tags = ['No tags available yet.'];
	$scope.enable_rating_1 = true;
	$scope.enable_rating_2 = true;
	$scope.enable_rating_3 = true;

	//Elements default values
	$scope.item_title = "No title available for this language";
	$scope.item_description = "No description available for this language";

	/*****************************************************************************************************************/
	/*							  	FUNCTIONS												  						 */
	/*****************************************************************************************************************/

	/************************************************** GET ITEM *****************************/
	$rootScope.getItem = function() {

		var item_identifier = $routeParams.itemId.split('_')[0]; //SET_ID
		var item_set = $routeParams.itemId.split('_')[1];

		var headers = {'Content-Type':'application/json','Accept':'application/json;charset=utf-8'};

		$http({
			method : 'GET',
			url : $scope.akif + item_set + '/' + item_identifier, //..akif/ILUMINA/18169
			type: 'json',
			headers : headers
		})
		.success(function(data) {
			//parse array and create an JS Object Array
			//every item is a JSON
			console.log(data.results[0]);
			var thisJson = data.results[0];

			/*We define the parameters for the specific language. In case we don't get the element in the language
			we already have selected we will change it to 'en' in order to avoid empty elements. */
			if (thisJson.languageBlocks[$scope.selectedLanguage] !== undefined) {

				languageBlock = thisJson.languageBlocks[$scope.selectedLanguage];

				if(languageBlock.title !== undefined) {
					$scope.item_title = languageBlock.title;
				} else {
					$scope.item_title = thisJson.languageBlocks['en'].title;
				}

				if(languageBlock.description !== undefined){
					$scope.item_description = languageBlock.description;
				}  else {
					$scope.item_description = thisJson.languageBlocks['en'].description;
				}

				if(languageBlock.keywords !== undefined) $scope.item_keywords = languageBlock.keywords;

				if(languageBlock.coverage !== undefined) $scope.item_coverage = languageBlock.coverage;

			}

			//LANGUAGE
			thisJson.expressions[0].language !== undefined ? $scope.item_language = language_mapping[thisJson.expressions[0].language] : $scope.item_language = '-';

			//AGE RANGE
			thisJson.tokenBlock.ageRange !== undefined ? $scope.item_age_range = thisJson.tokenBlock.ageRange : $scope.item_age_range = '-';

			//KEY AUDIENCE
			$scope.item_roles = [];
			if(thisJson.tokenBlock.endUserRoles !== undefined) {
				for(i in thisJson.tokenBlock.endUserRoles) {
					$scope.item_roles.push(thisJson.tokenBlock.endUserRoles[i]);
				}
			}

			//CONTEXTS
			$scope.item_context = [];
			if(thisJson.tokenBlock.contexts !== undefined) {
				for(i in thisJson.tokenBlock.contexts) {
					$scope.item_context.push(thisJson.tokenBlock.contexts[i]);
				}
			}

			//LEARNING RESOURCE TYPE
			$scope.item_resource_types = [];
			if(thisJson.tokenBlock.learningResourceTypes !== undefined) {
				for(i in thisJson.tokenBlock.learningResourceTypes) {
					$scope.item_resource_types.push(thisJson.tokenBlock.learningResourceTypes[i]);
				}
			}
			console.log($scope.item_resource_types);

			//URL
			if(thisJson.expressions[0].manifestations[0].items[0].url != undefined) {
				$scope.item_resource_url = thisJson.expressions[0].manifestations[0].items[0].url;
			}

			//RIGHTS
			if(thisJson.rights.url !== undefined) $scope.item_rights = thisJson.rights.url;

			//ICON
			if ( thisJson.tokenBlock.learningResourceTypes.indexOf('pathway') > -1 ) { $scope.item_icon = 'pathway.jpg' }
			else if( thisJson.tokenBlock.learningResourceTypes.indexOf('image') > -1 ) { $scope.item_icon = 'image.png'}
			else if( thisJson.tokenBlock.learningResourceTypes.indexOf('presentation') > -1 ) { $scope.item_icon = 'presentation.png'}
			else if( thisJson.tokenBlock.learningResourceTypes.indexOf('video') > -1 ) { $scope.item_icon = 'video.png'}
			else if( thisJson.tokenBlock.learningResourceTypes.indexOf('learning asset') > -1 ) { $scope.item_icon = 'learning_asset.png'}
			else if( thisJson.tokenBlock.learningResourceTypes.indexOf('lesson plan') > -1 ) { $scope.item_icon = 'lesson_plan.png'}
			else if( thisJson.tokenBlock.learningResourceTypes.indexOf('exploration') > -1 ) { $scope.item_icon = 'exploration.png'}
			else if( thisJson.tokenBlock.learningResourceTypes.indexOf('educational game') > -1 ) { $scope.item_icon = 'educational_game.png'}


			//ORGANIZATION
			thisJson.contributors[0].organization !== undefined ? $scope.item_organization = thisJson.contributors[0].organization : $scope.item_organization = '-';
				/*
					if (thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology'] !== undefined) {
						console.log(thisJson.tokenBlock.taxonPaths);
						$scope.item_classification =[];

						for(i in thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology']) {
							urls = thisJson.tokenBlock.taxonPaths['Organic.Edunet Ontology'][i].split('::');
							for(j in urls) {
								$scope.item_classification.push(urls[j].split("#")[1]);
							}
						}
					} else {
						$scope.item_classification = '-';
					}
				*/


		})

	};


	/****************************************************************************************** Helper Method for CORS Request *******/
	function createCORSRequest(method, url) {
		var xhr = new XMLHttpRequest();
		if ("withCredentials" in xhr) {
			// Check if the XMLHttpRequest object has a "withCredentials" property.
			// "withCredentials" only exists on XMLHTTPRequest2 objects.
			xhr.open(method, url, true);
		}
		else if (typeof XDomainRequest != "undefined") {
			// Otherwise, check if XDomainRequest.
			// XDomainRequest only exists in IE, and is IE's way of making CORS requests.
			xhr = new XDomainRequest();
			xhr.open(method, url);
		}
		else {
			// Otherwise, CORS is not supported by the browser.
			xhr = null;
		}

		xhr.onerror = function() {
			console.log('XHR error!');
		};

		return xhr;
	}

});


