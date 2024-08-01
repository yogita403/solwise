'use strict';

/**
 * Dealer finder data service
 */
angular.module('dealerServices', ['ngResource'])
	.factory('DealerSites', ['$resource',
		function($resource) {
			return $resource('https://secure.solwise.co.uk/remotesite/json_dealers.php', {},	{
					inBounds: {
						method: 'GET',
						params: {
							searchBy: "bounds",
							ne_lat: 0,
							ne_lng: 0,
							sw_lat: 0,
							sw_lng: 0
						},
						isArray: false
					}
				}
			);
		}
	]);

/**
 * Dealer finder module
 */
angular.module('dealerFinderModule', ['dealerServices', 'uiGmapgoogle-maps', 'ngSanitize', 'ngAutocomplete'])

/**
 * Configure Google Maps API loader
 */
	.config(['uiGmapGoogleMapApiProvider', function(GoogleMapApi) {
		GoogleMapApi.configure({
			key: 'AIzaSyDjMC_D2oQzN2cpxppyZugte1ABdy8hII4',
			v: '3.17',
			libraries: 'geometry,visualization,places'
		});
	}])


/**
 * Map controller
 */
	.controller('MapController', ['$scope', 'DealerSites', 'uiGmapGoogleMapApi', function ($scope, DealerSites, GoogleMapApi) {

		//Constants
		var PARAM_MAPMOVE_THROTTLE_PERIOD = 1500; //In milliseconds
		var PARAM_MARKER_PLACE_INTERVAL = 100; //In milliseconds
		var PARAM_MARKER_CHUNKSIZE = 2;
		var PARAM_ONLOAD_AUTOSEARCH = false; //Whether to search client location on load?

		//MapsAPI loaded...
		GoogleMapApi.then(function(maps) {
			$scope.maps = maps;

			attachAutocomplete(maps);
		});



		//Form
		$scope.form = {};
		$scope.form.address = "";
		$scope.form.range = 10;
		$scope.form.autocompletes = [];

		//Map
		/**
		 * @type {Window.google.maps}
		 */
		$scope.maps = null;
		/**
		 * @type {Window.google.maps.Map}
		 */
		$scope.mapInstance = null;
		$scope.map = {
			isReady: false,
			center: {
				latitude: 53.720111,
				longitude: -0.427870
			},
			zoom: 15,
			options: {
				mapTypeControl: false,
				overviewMapControl: false,
				panControl: false
			}
		};
		//Wait till GoogleMaps API is ready...
		GoogleMapApi.then(function(maps) {
			/*$scope.map.options.zoomControlOptions = {
				position: maps.ControlPosition.LEFT_TOP
			};
			$scope.map.options.streetViewControlOptions = {
				position: maps.ControlPosition.LEFT_TOP
			};*/

			//Finally, notify that map is ready for loading
			$scope.map.isReady = true;
		});

		//Marker clustering
		$scope.clustering = {
			options: {
				gridSize: 60,
				minimumClusterSize: 4,
				maxZoom: 12
			}
		};

		//Markers
		$scope.markers = {};
		$scope.markers.collection = [];
		$scope.markers.existingIds = {};
		$scope.markers.options = {
		};
		GoogleMapApi.then(function(maps) {
			$scope.markers.options.animation = maps.Animation.DROP;
		});
		$scope.markers.chunk = PARAM_MARKER_CHUNKSIZE;
		$scope.markers.events = {
			click: function(marker, eventName, model, args) {
				$scope.$apply(function() {
					$scope.map.window.show = false;
					$scope.map.window.model = model;

				});
				$scope.map.window.show = true;

				//console.log($scope.map.window.model);
			}
		};

		//Info windows
		$scope.windowOptions = {
			disableAutoPan: true
		};
		$scope.map.window = {
			marker: {},
			show: false,
			closeClick: function() {
				this.show = false;
			},
			options: {
				disableAutoPan: false,
				pixelOffset: null
			},
			model: {id: "", html: ""},
			template: "includes/partials/dealermarker.html"
		};
		GoogleMapApi.then(function(maps) {
			$scope.map.window.options.pixelOffset = new maps.Size(0, -22);
		});

		//Helpers
		var metres = function(miles) {
			return 1610 * parseInt(miles);
		};

		/**
		 * Get the current bounds of the map
		 * @returns {Window.google.maps.LatLngBounds}
		 */
		var getBounds = function() {
			return $scope.mapInstance.getBounds();
		};

		/**
		 * Attach Google maps autocomplete to .gmap-autocomplete input boxes
		 * @param mapsApi {Window.google.maps}
		 */
		var attachAutocomplete = function(mapsApi) {
			$("input.gmap-autocomplete").each(function() {
				var ac = new mapsApi.places.Autocomplete(this, {
					types: ["geocode", "establishment"]
				});
				mapsApi.event.addListener(ac, 'place_changed', function() {
					$scope.form.address = this.getPlace().formatted_address;
					$scope.events.place_changed(this.getPlace().formatted_address || this.getPlace().name);
				});
				$scope.form.autocompletes.push(ac);
			});
		};


/*
 * Methods
 */

		/**
		 * Centres and fits map to the argued bounds
		 *
		 * @param bounds google.maps.LatLngBounds
		 */
		$scope.centreMap = function(bounds) {
			$scope.mapInstance.fitBounds(bounds);
			autocompleteSetBounds(bounds);
		};
		/**
		 * Updates autocompletes to bias searches to viewport locality
		 * @param bounds
		 */
		var autocompleteSetBounds = function(bounds) {
			$.each($scope.form.autocompletes, function(i, ac) {
				ac.setBounds(bounds);
			});
		}

		/**
		 * Centres the map according to the client's geolocation.
		 */
		$scope.centreOnLocation = function() {
			GoogleMapApi.then(function(maps) {
				// Try HTML5 geolocation
				if(navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						var pos = new maps.LatLng(position.coords.latitude,
							position.coords.longitude);
						$scope.mapInstance.setCenter(pos);
						$scope.mapInstance.setZoom(15);
					}, function() {
						//console.log("Geolocation service failed. Your browser may have it disabled.");
						alert("Geolocation service failed. Your browser may have it disabled.");
					});
				} else {
					// Browser doesn't support Geolocation
					//console.log("Your browser does not support geolocation.");
					alert("Your browser does not support geolocation.");
				}
			});
		};

		/**
		 * Find dealers within the specified range of an address
		 *
		 * @param address
		 * @param range
		 */
		$scope.findDealersNearAddress = function(address, range) {
			//console.log("Searching within "+metres(range)+"m or "+address);
			var geocoder = new $scope.maps.Geocoder;
			geocoder.geocode({
				'address': address
			}, function(results, status) {
				//console.log(results);
				if (status == $scope.maps.GeocoderStatus.OK) {
					var resultBounds = results[0].geometry.bounds || results[0].geometry.viewport;
					var centre = resultBounds.getCenter();

					//Build a circle area of interest
					var aoi = new $scope.maps.Circle({
						center: centre,
						radius: metres(range)
					});
					/*var NE = $scope.maps.geometry.spherical.computeOffset(centre, metres(range), 45);
					var SW = $scope.maps.geometry.spherical.computeOffset(centre, metres(range), 225);
					var bounds = new $scope.maps.LatLngBounds(SW, NE);*/
					var bounds = aoi.getBounds();
					$scope.centreMap(bounds);
					$scope.findDealers(bounds);
				}
			});
		};

		/**
		 * Find dealers in bounds
		 *
		 * @param bounds google.maps.LatLngBounds
		 */
		$scope.findDealers = function(bounds) {
			$scope.timings.push(new Date().toTimeString());
			var req = {
				ne_lat: bounds.getNorthEast().lat(),
				ne_lng: bounds.getNorthEast().lng(),
				sw_lat: bounds.getSouthWest().lat(),
				sw_lng: bounds.getSouthWest().lng()
			};
			//console.log(req);
			DealerSites.get(req, function(results) {
				//console.log(results);
				angular.forEach(results.sites, function(site, key) {
					addMarker(site);
				});

			});
		};
		$scope.timings = [];

		//User a process queue to regulate marker placement
		var markerProcess = function(marker) {
			$scope.markers.collection.push(marker);
			$scope.markers.existingIds[marker.id] = true;
		};
		var markerQueue = new ItemProcessQueue(markerProcess, PARAM_MARKER_PLACE_INTERVAL);

		//Add marker (to the markerQueue)
		var addMarker = function(site) {
			if(!(site.id in $scope.markers.existingIds)) {
				//markerQueue.add(site);
				markerProcess(site);
			}
		};





		/*
		 * Event handlers
		 */
		$scope.events = {};
		$scope.events.search = function() {
			$scope.findDealersNearAddress($scope.form.address, $scope.form.range);
		};
		$scope.events.place_changed = function(place) {
			$scope.findDealersNearAddress(place, $scope.form.range);

			$("#dealerFinderAddress, #dealerFinderSearch").removeClass("expanded");
		};
		$scope.events.getLocation = function() {
			$scope.centreOnLocation();
			$scope.findDealers($scope.mapInstance.getBounds());
		};
		$scope.events.map = {};
		$scope.events.map.onLoad = function(mapInstance) {
			$scope.$apply(function () {
				//Fire map loaded event once...
				$scope.mapInstance = mapInstance;
				//Get init set of markers
				if(PARAM_ONLOAD_AUTOSEARCH) {
					$scope.centreOnLocation();
				}
				$scope.findDealers($scope.mapInstance.getBounds());
				//Then replace with tilesloaded event
				$scope.map.events.tilesloaded = $scope.events.map.tilesloaded;
			});
		};
		$scope.events.map.tilesloaded = function (map) {
			$scope.events.map.moved();
		};
		//Register event handlers
		$scope.map.events = {
			tilesloaded: $scope.events.map.onLoad
		};

		//Throttle map moved events to help control dealer queries
		$scope.events.map.moved = _.throttle(function() {
			autocompleteSetBounds($scope.mapInstance.getBounds());
			$scope.findDealers($scope.mapInstance.getBounds());
		}, PARAM_MAPMOVE_THROTTLE_PERIOD, {leading: true, trailing: true});

		$scope.events.expandForm = function() {
			$("#dealerFinderAddress, #dealerFinderSearch").toggleClass("expanded");
		};

	}]);

/**
 * Item processing queue, to process a queue of items using a
 * specified process function at a set interval
 *
 * @param process {Function}
 * @param interval {Integer}
 * @returns {{add: Function, check: Array}}
 * @constructor
 */
var ItemProcessQueue = function(process, interval) {
	var _queue = [];
	var _timer = null;
	var _process = process;
	var _interval = interval;


	var _run = function() {
		var item = _queue.shift();
		//console.log("_____ - Removed");
		if(_queue.length === 0) {
			clearInterval(_timer);
			_timer = null;
			//console.log("_____ * Timer stopped");
		}
		_process(item);
	};

	var _add = function(item) {
		_queue.push(item);
		//console.log("+ added");
		if(_timer === null) {
			_timer = setInterval(_run, _interval);
			//console.log("* Timer started: " + _interval);
		}
	};

	return {
		add: _add,
		check: _queue
	}
};