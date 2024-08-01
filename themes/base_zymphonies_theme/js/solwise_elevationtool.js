/*
 * Global variable declarations
 */
var elev_map = null;
var elev_chart = null;
var elev_marker1 = null;
var elev_marker2 = null;
var elev_signalPath1 = null;
var elev_signalPath2 = null;
var elev_signalPath3 = null;
var elev_sampleSize = 512;
var elev_elevations = null;
var elev_mouseMarker = null;
var elev_marker1_height = 0;
var elev_marker2_height = 0;
var elev_marker1_infowindow = null;
var elev_marker2_infowindow = null;

/*
 * Initialise
 */
//Init Visualisation API
google.load("visualization", "1", {
	packages: ["corechart"]
});

//Set the google loader callback to call init function when it is fully loaded...
google.setOnLoadCallback(init);
google.maps.visualRefresh = true;

//Initialise function
function init() {
	//Load chart into div
	//elev_chart = new google.visualization.ComboChart(document.getElementById('chartDiv'));
	elev_chart = new google.visualization.AreaChart(document.getElementById('chartDiv'));

	//Load services
	elevationService = new google.maps.ElevationService();

	//Create initial map options and then load a map
	var mapOptions = {
		center: new google.maps.LatLng(54.1, -3.7), 
		zoom: 5, 
		mapTypeId: google.maps.MapTypeId.HYBRID
	};
	elev_map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
	
	/*
	* Solwise marker
	*/
   /*/Instantiate marker
   var solwise = new google.maps.Marker({
	   icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
	   position: new google.maps.LatLng(53.7208, -0.4264),
	   title: "Solwise"
   });
   solwise.setMap(elev_map);

   //Solwise marker's info-window
   var solwise_infowindow = new google.maps.InfoWindow({
	   content: 'SOLWISE: Products one step from the Internet<br><a href="https://www.solwise.co.uk">www.solwise.co.uk</a>'
   });
   
   //Solwise marker click listener
	google.maps.event.addListener(solwise, 'click', function() {
		solwise_infowindow.open(elev_map, solwise);
	});*/
	
	/*
	 * Map click event handler to place markers...
	 */
	google.maps.event.addListener(elev_map, 'click', function(event) {
		placeMarker(event.latLng); 
	});
	
	/*
	 * Visualisation event to reflect geo position of chart on map
	 */
	google.visualization.events.addListener(elev_chart, 'onmouseover', function(e) {
		if(elev_mouseMarker == null) {
			elev_mouseMarker = new google.maps.Marker({
				position: elev_elevations[e.row -1].location,
				map: elev_map,
				icon: "https://maps.google.com/mapfiles/ms/icons/green-dot.png"
			});
		} else {
			elev_mouseMarker.setPosition(elev_elevations[e.row -1].location);
		}
	});
}

/*
 * Now for the functionality
 */

//Places a marker on the map until both markers are filled
function placeMarker(location) {
	//Is marker1 placed?
	if(elev_marker1 == null) {
		//Place marker one... that's it'
		elev_marker1 = new google.maps.Marker({
			icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
			position: location,
			map: elev_map,
			animation: google.maps.Animation.DROP,
			draggable: true,
			raiseOnDrag: true
		});
		
		//Marker's info-window
		elev_marker1_infowindow = new google.maps.InfoWindow({
			content: elev_getMarkerInfowindowContent(1, elev_marker1_height)
		});

		//Marker's click listener
		google.maps.event.addListener(elev_marker1, 'click', function() {
			elev_marker1_infowindow.open(elev_map, elev_marker1);
			document.getElementById('elev_marker1_heightField').focus();
		});
		
		/*
		 * Map draggable event handler to place markers...
		 */
		google.maps.event.addListener(elev_marker1, 'dragstart', function(event) {
			unsetMouseMarker();
		});
		
		google.maps.event.addListener(elev_marker1, 'dragend', function(event) {
			//Draw the polyline
			drawPolyLine();
			
			//Chart the elevation profile
			queryElevationProfile();
		});
		
		//Marker drag event handler
		google.maps.event.addListener(elev_marker1, 'drag', function(event) {
			elev_signalPath1.setPath([
				event.latLng,
				elev_marker2.getPosition()
			]);
			elev_signalPath2.setPath([
				event.latLng,
				elev_marker2.getPosition()
			]);
			elev_signalPath3.setPath([
				event.latLng,
				elev_marker2.getPosition()
			]);
		});
	} else {
		//Is marker 2 placed?
		if(elev_marker2 == null) {
			//Place marker 2
			elev_marker2 = new google.maps.Marker({
				icon: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
				position: location,
				map: elev_map,
				animation: google.maps.Animation.DROP,
				draggable: true,
				raiseOnDrag: true
			});
			
			//Marker's info-window
			elev_marker2_infowindow = new google.maps.InfoWindow({
				content: elev_getMarkerInfowindowContent(2, elev_marker2_height)
			});

			//Marker's click listener
			google.maps.event.addListener(elev_marker2, 'click', function() {
				elev_marker2_infowindow.open(elev_map, elev_marker2);
				document.getElementById('elev_marker2_heightField').focus();
			});
			
			google.maps.event.addListener(elev_marker2, 'dragstart', function(event) {
				unsetMouseMarker();
			});
			
			//Marker drag event handler
			google.maps.event.addListener(elev_marker2, 'drag', function(event) {
				elev_signalPath1.setPath([
					elev_marker1.getPosition(), 
					event.latLng
				]);
				elev_signalPath2.setPath([
					elev_marker1.getPosition(), 
					event.latLng
				]);
				elev_signalPath3.setPath([
					elev_marker1.getPosition(), 
					event.latLng
				]);
			});
			
			//Marker drag event handler
			google.maps.event.addListener(elev_marker2, 'dragend', function(event) {
				//Draw the polyline
				drawPolyLine();

				//Chart the elevation profile
				queryElevationProfile();
			});
			
			
			//Draw the polyline
			drawPolyLine();
			
			//Chart the elevation profile
			queryElevationProfile();
		}
	}
}

function clearPolyLine() {
	if(elev_signalPath1 != null) {
		//Remove from map
		elev_signalPath1.setMap(null);
		//Garbage the polyline
		elev_signalPath1 = null;
	}
	if(elev_signalPath2 != null) {
		//Remove from map
		elev_signalPath2.setMap(null);
		//Garbage the polyline
		elev_signalPath2 = null;
	}
	if(elev_signalPath3 != null) {
		//Remove from map
		elev_signalPath3.setMap(null);
		//Garbage the polyline
		elev_signalPath3 = null;
	}
}

function drawPolyLine() {
	//Remove any existing polyline
	clearPolyLine();
	
	//Only draw the polyline if both markers exist
	if(!(elev_marker1 == null && elev_marker2 == null)) {
		//Build a plot points array
		var plotPoints = [
			elev_marker1.getPosition(), 
			elev_marker2.getPosition()
		];
		
		//Instantiate a polyline using plot points
		elev_signalPath1 = new google.maps.Polyline({
			path: plotPoints,
			strokeColor: "#FFFFFF",
			strokeOpacity: 0.9,
			strokeWeight: 3,
			geodesic: true,
			zIndex: 3
		});
		elev_signalPath2 = new google.maps.Polyline({
			path: plotPoints,
			strokeColor: "#000000",
			strokeOpacity: 0.4,
			strokeWeight: 2,
			geodesic: false,
			zIndex: 1
		});
		elev_signalPath3 = new google.maps.Polyline({
			path: plotPoints,
			strokeColor: "#000000",
			strokeOpacity: 1,
			strokeWeight: 5,
			geodesic: true,
			zIndex: 2
		});
		
		
		//Place it on the map
		elev_signalPath1.setMap(elev_map);
		elev_signalPath2.setMap(elev_map);
		elev_signalPath3.setMap(elev_map);
	}
}

function elev_getMarkerInfowindowContent(markerNo, markerHeight) {
	return "How high is this point to be<br />placed above the ground? (m)<br />" + 
		"<input type='text' value='" + markerHeight + "' id='elev_marker" + markerNo + "_heightField' size='5' />" + 
		"<input type='submit' value='ok' onclick=\"elev_setMarker" + markerNo + "Height(document.getElementById('elev_marker" + markerNo + "_heightField').value);\" />";
}

function elev_setMarker1Height(aHeight) {
	if(parseInt(aHeight) != elev_marker1_height) {
		elev_marker1_height = parseInt(aHeight);
		elev_marker1_infowindow.content = elev_getMarkerInfowindowContent(1, elev_marker1_height);
		//Chart the elevation profile
		queryElevationProfile();
	}
	//elev_marker1_infowindow.close();
}
function elev_setMarker2Height(aHeight) {
	if(parseInt(aHeight) != elev_marker2_height) {
		elev_marker2_height = parseInt(aHeight);
		elev_marker2_infowindow.content = elev_getMarkerInfowindowContent(2, elev_marker2_height);
		//Chart the elevation profile
		queryElevationProfile();
	}
	//elev_marker2_infowindow.close();
}

function unsetMouseMarker() {
	if(elev_mouseMarker != null) {
		elev_mouseMarker.setMap(null);
		elev_mouseMarker = null;
	}
}

function setMapBounds() {
	//Are both markers placed?
	if(!(elev_marker1 == null && elev_marker2 == null)) {
		//Which are the left and right markers?
		var left;
		var right;
		if(elev_marker1.getPosition().lng() < elev_marker2.getPosition().lng()) {
			left = elev_marker1.getPosition().lng();
			right = elev_marker2.getPosition().lng();
		} else {
			left = elev_marker2.getPosition().lng();
			right = elev_marker1.getPosition().lng();
		}
		var top;
		var bottom;
		if(elev_marker1.getPosition().lat() > elev_marker2.getPosition().lat()) {
			top = elev_marker1.getPosition().lat();
			bottom = elev_marker2.getPosition().lat();
		} else {
			top = elev_marker2.getPosition().lat();
			bottom = elev_marker1.getPosition().lat();
		}
		
		elev_map.fitBounds(new google.maps.LatLngBounds(
				new google.maps.LatLng(bottom, left), 
				new google.maps.LatLng(top, right)));
	}
}

//If both markers exist, draws a polyline between the points
function queryElevationProfile() {
	//Are both markers placed?
	if(!(elev_marker1 == null && elev_marker2 == null)) {
		//Which are the left and right markers?
		var leftMarker;
		var rightMarker;
		var leftHeight = 0;
		var rightHeight = 0;
		if(elev_marker1.getPosition().lng() < elev_marker2.getPosition().lng()) {
			leftMarker = elev_marker1;
			rightMarker = elev_marker2;
			leftHeight = elev_marker1_height;
			rightHeight = elev_marker2_height;
		} else {
			leftMarker = elev_marker2;
			rightMarker = elev_marker1;
			leftHeight = elev_marker2_height;
			rightHeight = elev_marker1_height;
		}
		
		setMapBounds();
		
		//Build array of points to denote the path
		var pathArray = [
			leftMarker.getPosition(),
			rightMarker.getPosition()
		];
		//Query the elevation service using pointsArray 
		//with sampleSize (global variable)
		//using plotElevationProfile(results) callback function 
		//(the callback will include its results in the argument)
		elevationService.getElevationAlongPath({
			path: pathArray,
			samples: elev_sampleSize
		}, plotElevationProfile);
	}
}

//Callback function for the elevation service, plots the elevation data to a chart
function plotElevationProfile(results) {
	elev_elevations = results;
	
	var leftHeight = 0;
	var rightHeight = 0;
	if(elev_marker1.getPosition().lng() < elev_marker2.getPosition().lng()) {
		leftHeight = elev_marker1_height;
		rightHeight = elev_marker2_height;
	} else {
		leftHeight = elev_marker2_height;
		rightHeight = elev_marker1_height;
	}
	
	//Build an array of the points on the results' path
	var pathArray = [];
    for (var i = 0; i < results.length; i++) {
		pathArray.push(elev_elevations[i].location);
    }
	
	//Calculate the distance of the path
	var pathDist = google.maps.geometry.spherical.computeLength(pathArray);

	//Calculate sample distance
	var sampleDist = pathDist / results.length;
	
	//Use clearer units
	var distUnit = "m";
	var distDenom = 1;
	if(pathDist > 1000) {
		distUnit = "km";
		distDenom = 1000;
	}
	//Calculate LOS sample decrementor
	var pathElevation = (results[0].elevation + parseInt(leftHeight)) - (results[results.length - 1].elevation + parseInt(rightHeight));
	var incLOS = pathElevation / results.length;
	
	document.getElementById("googleChartInfo").innerHTML = "<strong>Total Distance:</strong> " + 
			(Math.round((pathDist / distDenom) * 10) / 10) + distUnit + 
			"<br /><strong>Elevation Difference:</strong> " + 
			-(Math.round(pathElevation * 10) / 10) + "m";
	
	//Create a data table to store the sample data
	var dataTable = new google.visualization.DataTable();
	//Add headings to data table
	dataTable.addColumn('string', 'Distance ('+distUnit+')');
	dataTable.addColumn('number', 'Surface Elevation (m)');
	dataTable.addColumn('number', 'Line of Sight Elevation (m)');
	
	//Add the samples' data to the table
	for(var i = 0; i < results.length; i++) {
		//xAxis is the distance from start point
		var xAxis = sampleDist * i;
		//Get surf dist value and divide by dist denominator
		//alert(pathDist + " :: " + xAxis);
		/*if(distUnit == "km") {
			xAxis = (Math.round(xAxis / distDenom * 10) / 10) + '';
		} else {
			if(pathDist < 50) {
				xAxis = (Math.round(xAxis / distDenom * 10) / 10) + '';
			} else {
				xAxis = Math.round(xAxis / distDenom) + '';
			}
		}*/
		if((pathDist / distDenom) < 10) {
			xAxis = (Math.round(xAxis / distDenom * 100) / 100) + '';
		} else if((pathDist / distDenom) < 50) {
			xAxis = (Math.round(xAxis / distDenom * 10) / 10) + '';
		} else {
			xAxis = Math.round(xAxis / distDenom) + '';
		}
		//Round to 1 dp
		dataTable.addRow([xAxis, 
			Math.round(elev_elevations[i].elevation * 10) / 10, 
			Math.round(((elev_elevations[0].elevation + parseInt(leftHeight)) - (incLOS * i)) * 1000) / 1000
		]);
	}
	
	//Draw the chart using the dataTable of sample data to plot the elevation
	document.getElementById('chartDiv').style.display = 'block';
	elev_chart.draw(dataTable, {
		title: "Line-of-Sight Mapped To Surface Elevation Profile",
		width: "100%",
		height: 400,
		legend: 'top',
		titleY: 'Surface Elevation (m)',
		titleX: 'Distance ('+distUnit+')',
		focusBorderColor: '#00ff00',
		colors: ['#083', 'FF0000'],
		animation: {
			duration: 1000,
			easing: 'inAndOut'
		},
		chartArea: {
			width: "90%",
			left: "7%",
			right: "3%"
		},
		focusTarget: "category",
		curveType: "function"
	});
	
}

function geocodeLocation(locationString) {
	geocoderService = new google.maps.Geocoder();
	geocoderService.geocode({
		'address': locationString,
		'region': 'GB'
	}, 
	function(results, status) {
		if(status == google.maps.GeocoderStatus.OK) {
			elev_map.setCenter(results[0].geometry.location);
			//elev_map.setZoom(10);
			elev_map.fitBounds(results[0].geometry.viewport);
			/*var marker = new google.maps.Marker({
				map: elev_map,
				position: results[0].geometry.location
			});*/
		} else {
			alert("Could not determine location: " + status);
		}
	});
}

function elev_resetApp() {
	unsetMouseMarker()
	clearPolyLine()
	if(elev_marker1 != null) {
		elev_marker1.setMap(null);
		elev_marker1 = null;
	}
	if(elev_marker2 != null) {
		elev_marker2.setMap(null);
		elev_marker2 = null;
	}
	document.getElementById("googleChartInfo").innerHTML = "";
	document.getElementById('chartDiv').style.display = 'none';
}

function elev_printPage() {
	var printReference = window.prompt("Would you like to provide a project reference for printing on the document?", "Project Reference");
	
	if(printReference === null || printReference === "Project Reference") {
		printPage(null, "Surface Elevation Tool");
	} else {
		printPage("<p>Ref: <strong>" + printReference + "</strong></p>", "Surface Elevation Tool");
	}
}


function addPrintInfo(printInfo, printTitle) {
	var printInfoHTML = "";
	
	//Add Title
	if(printTitle === undefined) {
		printInfoHTML = "<h3>" + document.title + "</h3>";
	} else if(printTitle === null) {
		printInfoHTML = "";
	} else {
		printInfoHTML = "<h3>" + printTitle + "</h3>";
	}
	
	//Add Current Date
	var printDate = new Date();
	printInfoHTML += "<p>Printed: <strong>" + printDate.toDateString() + "</strong></p>";
	
	//Add Info?
	if(printInfo !== null && printInfo !== undefined) {
		printInfoHTML += printInfo;
	}
	
	//Attach HTML
	document.getElementById("printInfo").innerHTML = printInfoHTML;
}
$(document).ready(function() {addPrintInfo();});

function printPage(printInfo, printTitle) {
	//Add the print infor...
	addPrintInfo(printInfo, printTitle);
	
	//Now print!
	window.print();
}