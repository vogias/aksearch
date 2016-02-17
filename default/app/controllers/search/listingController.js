/*
 * @author Mathioudakis Theodore
 * Agro-Know Technologies - 2013
 */

listing
		.controller(
				"listingController",
				function($rootScope, $routeParams, $scope, $http, $location,
						sharedProperties) {

					/* variable to calculate the progress of http get request */
					$scope.http_get_prog = 37;

					/*
					 * @function findElements(init, pagination_type) : creates
					 * the request for Search API and makes the call @param init :
					 * true if function called in initialization. @param init
					 */
					$rootScope.findElements = function(init, pagination_type) {
						// enable loading indicator : true/false
						$scope.loading = true;
						// enable error message : true/false
						$scope.error = false;

						// If query defined in URL
						if ($routeParams.q) {
							$rootScope.query = 'q=' + $routeParams.q;
						}

						// Search '*' @ initial search
						if (init) {
							if (!$rootScope.query) {
								$rootScope.query = 'q=*';
							}

							// URL facets
							var flg = true; // needed for clearing the
							// activeFacets at first time
							// -check url
							for (i in $scope.facets) {

								if ($scope.facets[i] in $routeParams) {
									var terms = $routeParams[$scope.facets[i]
											.toString()].split(',');
									// separate different terms of same facet
									for (j in terms) {
										var facet = {
											'facet' : $scope.facets[i]
													.toString(),
											'term' : terms[j]
										};

										/*
										 * check if facet is already in active
										 * ones
										 */
										var flag = false;
										for (active in $scope.activeFacets) {
											if (facet.term == $scope.activeFacets[active].term) {
												flag = true
											}
										}
										/*
										 * push item in active facets if it's
										 * not in array
										 */
										if (!flag) {
											$scope.activeFacets.push(facet);
										}
									}
								}
							}

							$scope.results = [];
						}

						// If there are facets defined in settings add them in
						// query
						var query_facets = '';
						var query_active_facets = '';

						if ($scope.enableFacets) {
							// create the query for the AVAILABLE FACETS
							if ($scope.facets.length > 0) {
								query_facets += '&facets=';
								for (facet in $scope.facets) {
									facet == 0 ? query_facets += $scope.facets[facet]
											: query_facets += ","
													+ $scope.facets[facet];
								}
							}
							// create the query for ACTIVE FACETS
							// -check activeFacets
							if ($scope.activeFacets.length > 0) {
								for (facet in $scope.activeFacets) {
									// if exists facet with same parent we
									// split() and add in same parent
									if (query_active_facets
											.indexOf($scope.activeFacets[facet].facet) > -1) {
										// i.e
										// &contexts=education&language=noe&set=digitalgreen&page_size=10&page=1
										// i.e to add 'vocational' in contexts
										// we split it -> &contexts=| |education
										var parts = query_active_facets
												.split($scope.activeFacets[facet].facet
														+ '=');
										// i.e add new facet+',' and connect ->
										// &contexts=| vocational, |education ->
										// &contexts=vocational,education
										query_active_facets = parts[0]
												+ $scope.activeFacets[facet].facet
												+ '='
												+ $scope.activeFacets[facet].term
												+ '+AND+' + parts[1];
									}
									// else we create a new parent
									else {
										query_active_facets += '&'
												+ $scope.activeFacets[facet].facet
												+ '='
												+ $scope.activeFacets[facet].term;
									}
								}
							}
						}

						// add PAGINATION in query
						var query_pagination = '&page_size=' + $scope.pageSize
								+ '&page=' + $scope.currentPage;

						// limit facets number per facet
						var limitFacetsNumber = '&facet_size='
								+ $scope.limit_facets_number;

						// FACETS LIMITATION
						// !! FIX TO CHANGE FROM conf.json
						var limitFacets = '';
						for (i in $scope.limit_facets) {
							limitFacets += '&' + i + "=";
							for (j in $scope.limit_facets[i]) {
								if (j != $scope.limit_facets[i].length - 1) {
									limitFacets += $scope.limit_facets[i][j]
											+ ',';
								} else {
									limitFacets += $scope.limit_facets[i][j];
								}
							}
						}

						/*
						 * create the FINAL QUERY the followings DOESN'T shown
						 * in URL i.e query_facets :
						 * '&facets=set,language,contexts' query_pagination :
						 * '&page_size=15&page=1' limitFacets :
						 * '&set=oeintute&language=en,fr' limitFacetsNumber :
						 * '&limitFacetsNumber'
						 */
						var query = $scope.api_path + $scope.schema + '?'
								+ $rootScope.query + query_facets
								+ query_active_facets + query_pagination
								+ limitFacets + limitFacetsNumber;

						// add parameters to URL
						// active facets
						var activeFacetSplit = query_active_facets.split('&');
						for (tempfacet in $routeParams) {
							if (tempfacet != 0) {
								/* console.log(tempfacet); */
								/* $location.search(activeFacetSplit[tempfacet].split('=')[0],activeFacetSplit[tempfacet].split('=')[1]); */
							}
						}

						// CHECK IF USER called the loading more or the classic
						// pagination
						if (pagination_type == 'classic') {
							$scope.search(query);
						} else {
							$scope.searchMore(query);
						}

					}

					// search() works with PAGINATION. SERVES CONTENT PER PAGE
					$scope.search = function(query) {

						$http
								.get(query)
								.success(
										function(data) {

											/* Add facets */
											if ($scope.enableFacets) {
												$scope.inactiveFacets.length = 0;/*
																					 * clear
																					 * results
																					 */
												$scope.inactiveFacets
														.push(data.facets);

											}

											/*
											 * variable to calculate http get
											 * progress. in combination with
											 * $scope.http_get_prog
											 */
											var data_results_length = data.results.length;
											var result_index = 0;

											// Print snippets
											$scope.results.length = 0;// clear
											// results
											angular
													.forEach(
															data.results,
															function(result,
																	index) {
																result_index++;
																// Listing
																// Results
																var json = $scope
																		.getSnippet(
																				result,
																				$scope.snippetElements);
																if (json != null) {
																	$scope.http_get_prog = (result_index / data_results_length) * 100;
																	$scope.results
																			.push(json);
																}

															});

											sharedProperties
													.setTotal(data.total);
											$rootScope.updatePagination();
											$scope.update();

										}).error(
										function(error) {
											$scope.loading = false;
											$scope.error = true;
											console.log("Error on $http.get : "
													+ query);
										}).then(function() {
									$scope.loading = false;
								});
					}

					// searchMore() works with LOAD MORE. ADDS CONTENT PER PAGE
					$scope.searchMore = function(query) {

						$http
								.get(query)
								.success(
										function(data) {

											/* Add facets */
											if ($scope.enableFacets) {
												$scope.inactiveFacets.length = 0;/*
																					 * clear
																					 * results
																					 */
												$scope.inactiveFacets
														.push(data.facets);

											}

											// Print snippets
											// $scope.results.length = 0;//clear
											// results
											angular
													.forEach(
															data.results,
															function(result,
																	index) {
																// Listing
																// Results
																var json = $scope
																		.getSnippet(
																				result,
																				$scope.snippetElements);

																if (json != null) {
																	$scope.results
																			.push(json);
																}
															});

											$scope.loading = false;
											sharedProperties
													.setTotal(data.total);
											$scope.update();

										})
								.error(
										function(error) {
											$scope.loading = false;
											$scope.error = true;
											console
													.log("Error on $http.get in searchMore(): "
															+ query);
										});
					}

					/*
					 * gets the json and create a new one based on the specs of
					 * the snippet_elements @param thisJson : json from result
					 * @param snippet_elements : array with selected elements we
					 * want to show in listing (i.e. title, description...)
					 */
					$scope.getSnippet = function(thisJson, snippet_elements) {

										
						var record = {};

						$.each(thisJson.languageBlocks, function(key, val) {

							if (key != 'null') {

								$.each(val, function(key2, val2) {

									if (key2 == 'title')
										record.title = val2;
									else if (key2 == 'description')
										record.description = val2;
									else if (key2 == 'keywords') {

										if (val2 instanceof Array)
											record.keywords = val2;
										else {
											record.keywords = [ val2 ];

										}
									}

								});
							}

							record.set = thisJson.set;
							record.id = thisJson.identifier;

						});

						var temp = JSON.parse($scope.sanitize(JSON
								.stringify(record)));
						console.log(temp);

						return temp;

					}

				});