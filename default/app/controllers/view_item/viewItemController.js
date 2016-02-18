/*
 * @author Mathioudakis Theodore
 * Agro-Know Technologies - 2013
 *
 */

/*Define viewItemController controller in 'app' */
listing
		.controller(
				"viewItemController",
				function($rootScope, $scope, $http, $location, $routeParams) {

					/** ************************************************************************************************************** */
					/* GENERAL */
					/** ************************************************************************************************************** */
					var language_mapping = [], audience_mapping = [];
					language_mapping['en'] = "English";

					/* AKIF URL */
					$scope.akif = 'https://services.oer.geant.org/search/v1/akif/';
					// $scope.item_resource_id = '';
					$scope.item_resource_url = '';
					$scope.user_id = 23;
					$scope.domain = 'https://services.oer.geant.org';
					$scope.ip = 'services.oer.geant.org';
					$scope.format = '-';
					$scope.duration = '-';
					$scope.thumbnail = '';

					$scope.item_number_of_visitors = 0;
					$scope.item_average_rating = 'no rating available yet';
					$scope.item_tags = [ 'No tags available yet.' ];
					$scope.enable_rating_1 = true;
					$scope.enable_rating_2 = true;
					$scope.enable_rating_3 = true;

					// Elements default values
					$scope.item_title = "No title available for this language";
					$scope.item_description = "No description available for this language";

					/** ************************************************************************************************************** */
					/* FUNCTIONS */
					/** ************************************************************************************************************** */

					/**
					 * ************************************************ GET ITEM
					 * ****************************
					 */
					$rootScope.getItem = function() {

						var params = $routeParams.itemId;
						var item_identifier = params.split('~')[0]; // SET_ID
						var item_set = params.split('~')[1];

						var headers = {
							'Content-Type' : 'application/json',
							'Accept' : 'application/json;charset=utf-8'
						};

						$http(
								{
									method : 'GET',
									url : $scope.akif + item_set + '/'
											+ item_identifier, // ..akif/ILUMINA/18169
									type : 'json',
									headers : headers
								})
								.success(
										function(data) {

											// console.log(data.results);
											var thisJson = data.results;

											var record = {};

											$
													.each(
															thisJson.languageBlocks,
															function(key, val) {

																if (key != 'null') {

																	$
																			.each(
																					val,
																					function(
																							key2,
																							val2) {

																						if (key2 == 'title')
																							record.title = val2;
																						else if (key2 == 'description')
																							record.description = val2;
																						else if (key2 == 'keywords')
																							record.keywords = val2;
																					});
																}

															});

											var langBlock = JSON
													.parse($scope.sanitize(JSON
															.stringify(record)));

											$scope.item_title = langBlock.title;
											$scope.item_description = langBlock.description;
											$scope.item_keywords = langBlock.keywords;

											// LANGUAGE
											thisJson.expressions.language !== undefined ? $scope.item_language = language_mapping[thisJson.expressions.language]
													: $scope.item_language = '-';

											// AGE RANGE
											thisJson.tokenBlock.ageRange !== undefined ? $scope.item_age_range = thisJson.tokenBlock.ageRange
													: $scope.item_age_range = '-';

											// KEY AUDIENCE
											$scope.item_roles = [];
											if (thisJson.tokenBlock.endUserRoles !== undefined) {
												for (i in thisJson.tokenBlock.endUserRoles) {
													$scope.item_roles
															.push(thisJson.tokenBlock.endUserRoles[i]);
												}
											}

											// CONTEXTS
											$scope.item_context = [];
											if (thisJson.tokenBlock.contexts !== undefined) {
												for (i in thisJson.tokenBlock.contexts) {
													$scope.item_context
															.push(thisJson.tokenBlock.contexts[i]);
												}
											}

											// LEARNING RESOURCE TYPE
											$scope.item_resource_types = [];
											if (thisJson.tokenBlock.learningResourceTypes !== undefined) {
												for (i in thisJson.tokenBlock.learningResourceTypes) {
													$scope.item_resource_types
															.push(thisJson.tokenBlock.learningResourceTypes[i]);
												}
											}

											// URL
											if (thisJson.expressions.manifestations.items.url != undefined) {
												$scope.item_resource_url = thisJson.expressions.manifestations.items.url;
											}

											// Thumbnail
											if (thisJson.expressions.manifestations.thumbnail != undefined) {
												$scope.thumbnail = thisJson.expressions.manifestations.thumbnail;
												$scope.item_icon = $scope.thumbnail;
											}

											// format
											if (thisJson.expressions.manifestations.format != undefined) {
												$scope.format = thisJson.expressions.manifestations.format;
											}
											// duration
											if (thisJson.expressions.manifestations.duration != undefined) {
												$scope.duration = thisJson.expressions.manifestations.duration;
											}

											// RIGHTS

											if (thisJson.rights.description['en'] !== undefined)
												$scope.item_rights = thisJson.rights.description['en'];

											// ORGANIZATION
											thisJson.contributors.name !== undefined ? $scope.item_organization = thisJson.contributors.name
													: $scope.item_organization = '-';

										})

					};

					/**
					 * ****************************************************************************************
					 * Helper Method for CORS Request ******
					 */
					function createCORSRequest(method, url) {
						var xhr = new XMLHttpRequest();
						if ("withCredentials" in xhr) {
							// Check if the XMLHttpRequest object has a
							// "withCredentials" property.
							// "withCredentials" only exists on XMLHTTPRequest2
							// objects.
							xhr.open(method, url, true);
						} else if (typeof XDomainRequest != "undefined") {
							// Otherwise, check if XDomainRequest.
							// XDomainRequest only exists in IE, and is IE's way
							// of making CORS requests.
							xhr = new XDomainRequest();
							xhr.open(method, url);
						} else {
							// Otherwise, CORS is not supported by the browser.
							xhr = null;
						}

						xhr.onerror = function() {
							console.log('XHR error!');
						};

						return xhr;
					}

				});
