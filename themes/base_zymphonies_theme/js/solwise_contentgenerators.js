/****** Window onLoad content generator ******/
function loadContent() {
	//initFlashBanner();
}

/****** Google Maps API ******/
//Loads the GoogleMaps API
function loadGoogleMapsAPI(callback) {
	var callbackstr = "";
	if(callback.length > 0) {
		callbackstr = "&callback=" + callback;
	}
	//alert(callback + " - " + callbackstr);
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.google.com/maps/api/js?sensor=false" + callbackstr;
	document.body.appendChild(script);
}
function initGoogleMapsAPI() {
}
function getDealerFinderLocalApplet_GeoCoder(address) {
	var geocoder;
	geocoder = new google.maps.Geocoder();
	
	var latitude = 0;
	var longitude = 0;
	
	//Attempt to resolve search term using google geocoding API
	if(address.length > 1) {
		document.getElementById("googleMapsApplet").getElementsByTagName("div")[0].innerHTML = "Searching for Solwise resellers <span style='font-size: 0.8em; font-weight: normal; color: #B7BBC1;'>(" + address + ")</span>";
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				latitude = results[0].geometry.location.lat();
				longitude = results[0].geometry.location.lng();
				//alert("Google Geocoder returned lat: " + latitude + " long: " + longitude);
				getDealerFinderLocalApplet(latitude, longitude);
			} else {
				//alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}
}
function getDealerFinderLocalApplet_GeoLocation() {
	var latitude = 0;
	var longitude = 0;
	
	//Attempt to get user location via geolocation API
	// Try W3C Geolocation (Preferred)
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			function(position) {
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
				//alert("Geolocation Success!!! lat: " + latitude + " long: " + longitude);
				getDealerFinderLocalApplet(latitude, longitude);
			}, function() {
				//alert("Geolocation service failed.");
				getDealerFinderLocalApplet(latitude, longitude);
			}
		);
		// Try Google Gears Geolocation
	} else if (google.gears) {
		var geo = google.gears.factory.create('beta.geolocation');
		geo.getCurrentPosition(
			function(position) {
				latitude = position.latitude;
				longitude = position.longitude;
				//alert("Google Gears geolocation Success!!! lat: " + clientLatitude + " long: " + clientLongitude);
				getDealerFinderLocalApplet(latitude, longitude);
			}, function() {
				//alert("Geolocation service failed.");
				getDealerFinderLocalApplet(latitude, longitude);
			}
		);
		// Browser doesn't support Geolocation
	} else {
		//alert("Your browser doesn't support geolocation.");
		getDealerFinderLocalApplet(latitude, longitude);
	}
}
//Callback function to retrieve the local dealer finder map applet
function getDealerFinderLocalApplet(clientLatitude, clientLongitude) {
	//alert("Loading dealer finder applet for lat: " + clientLatitude + " long: " + clientLongitude);
	var script = document.createElement("script");
	var srcString = "?" +
		"eid=googleMapsApplet_Placeholder" +
		"&location=" + document.getElementById("DealerFinder_location").value + 
		"&latitude=" + clientLatitude + 
		"&longitude=" + clientLongitude + 
		"&nocache="+timestamp();
	script.type = "text/javascript";
	script.src = "../newtrolley/ajax/ajax_mapapplet_dealerfinder.php" + srcString;
	document.body.appendChild(script);
}

/****** Solwise Stock ******/
//Global stock XML DOM object instance
var XMLDOM_Stock = null;

//Loads stock information into an XML DOM object (Singleton Method)
function loadXMLDOM_Stock() {
	if(XMLDOM_Stock == null) {
		var xmlhttp = null;
		if(window.XMLHttpRequest) {
			//IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		} else {
			//IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		try {
			xmlhttp.open("GET", drupalSettings.path.baseUrl + "themes/base_zymphonies_theme/js/stockfile.xml?r=" + Math.random()*1000 + "&timestamp="+timestamp(),false);
			xmlhttp.send();
			XMLDOM_Stock = xmlhttp.responseXML;
		} catch(err) {
		}
	}
	return XMLDOM_Stock;
}

//Returns a stock element from the stock XML DOM object
function XMLDOM_Stock_getStockElement(StockCode) {
	var retobj = null;
	var elem = loadXMLDOM_Stock();
	var n = 0;
	if(elem != null) {
		elem = elem.getElementsByTagName("stock");
		for(n=0;n<elem.length;n++) {
			if(elem[n].getAttribute("code") == StockCode) {
				retobj = elem[n];
			}
		}
	}
	return retobj;
}

//Returns the price from the XML DOM for the argues StockCode
function XMLDOM_Stock_getPrice(StockCode) {
	var retVal = "0.00";
	var elemStock = XMLDOM_Stock_getStockElement(StockCode);
	if(elemStock != null) {
		var elemPrice = elemStock.getElementsByTagName("price")[0].getElementsByTagName("break")[0].childNodes[0].nodeValue;
		retVal = elemPrice;
	}
	return retVal;
}

//Returns HTML for the accessories tabs
function getAccessoriesContent(StockCode) {
	if(StockCode === undefined) {
		StockCode = page.associatedStock();
		if($.isArray(StockCode)) {
			StockCode = StockCode.join(",");
		}
	}
	/*
	* Populate ContentCodes array with accessories to be shown
	*/
	var arrParameters = new Array();
	var arrContentCodes = new Array();
	var elemStock = null;
	var elemAccessories = null;
	var n = 0;
	
	//Split StockCode Parameter using ',' delimiter
	if(StockCode != null) {
		arrParameters = StockCode.split(",");
	}
	
	//Iterate through parameters
	for(var strParameter in arrParameters) {
		//Get the stock element from the stock XML DOM
		elemStock = XMLDOM_Stock_getStockElement(arrParameters[strParameter]);
		if(elemStock != null) {
			//Get the accessories from the stock element
			elemAccessories = elemStock.getElementsByTagName("accessory");
			//Iterate through accessories
			for(n=0;n<elemAccessories.length;n++) {
				//Condition: Accessory is NOT one of the parameter stockcodes
				if(searchArray(arrParameters, elemAccessories[n].childNodes[0].nodeValue) == -1) {
					//Condition: Accessory is NOT already in the ContentCodes array
					if(searchArray(arrContentCodes, elemAccessories[n].childNodes[0].nodeValue) == -1) {
						arrContentCodes.push(elemAccessories[n].childNodes[0].nodeValue);
					}
				}
			}
		}
	}
	
	/*
	* Iterate through ContentCodes array to build the HTML
	*/
	var Accessory = null;
	var HTML = "";
	
	for(var strContentCode in arrContentCodes) {
		Accessory = null;
		Accessory = XMLDOM_Stock_getStockElement(arrContentCodes[strContentCode]);
		if(Accessory != null) {
			HTML = HTML + "\n<div class='productInfo'>\n";
			if(Accessory.getElementsByTagName("image").length > 0) {
				HTML = HTML + "<img src='" + Accessory.getElementsByTagName("image")[0].getAttribute("src") + "' alt='" + Accessory.getAttribute("code") + "' class='imgExpandable' />\n";
			}
			HTML = HTML + "<div class='buyitnow'>\n" + 
				getPriceInfo(Accessory.getAttribute("code"), true) +
				//"&pound;" + Accessory.getElementsByTagName("price")[0].getElementsByTagName("break")[0].childNodes[0].nodeValue + "\n" + 
				"<p class='stockstatus'>" + Accessory.getElementsByTagName("status")[0].childNodes[0].nodeValue + "</p>\n" + 
				"<a href='https://secure.solwise.co.uk/trolley.php?NewStockCode=" + Accessory.getAttribute("code") + "'>\n" +
				"<img src='"+ drupalSettings.path.baseUrl + "themes/base_zymphonies_theme/images/buynow.png' alt='Buy Now' onmouseover=\"this.src='"+ drupalSettings.path.baseUrl + "themes/base_zymphonies_theme/images/buynow_hover.png';\" onmouseout=\"this.src='"+ drupalSettings.path.baseUrl + "themes/base_zymphonies_theme/images/buynow.png';\" />\n" + 
				"</a>\n" + 
				"</div>\n";
			if(Accessory.getElementsByTagName("URI")[0].childNodes[0] === undefined) {
				HTML = HTML + "<h3>" + Accessory.getAttribute("code") + "</h3>\n";
			} else {
				HTML = HTML + "<a href='" + Accessory.getElementsByTagName("URI")[0].childNodes[0].nodeValue + "'><h3>" + Accessory.getAttribute("code") + "</h3></a>\n";
			}
			HTML = HTML + "<p>\n" + 
				Accessory.getElementsByTagName("description")[0].childNodes[0].nodeValue + "\n" + 
				"</p>\n" + 
				"<hr />\n" + 
				"</div>";
		}
	}
	if(HTML.length > 1) {
		HTML = "<div>\n" + HTML + "\n</div>";
	}
	document.write(HTML);
}
function loadSlideshowThumbnails_Related(imgSrc) {
	//Reset Thumbnails
	imageViewerSlideshow_Thumbnails_Reset();
	
	//Find related Images
	var n = 0;
	var objStock = loadXMLDOM_Stock();
	if(objStock != null) {
		var elemImages = objStock.getElementsByTagName("image");
		var elemStock = null;
		for(n=0;n<elemImages.length;n++) {
			if(elemImages[n].getAttribute("src").indexOf(imgSrc.replace(/^.*\/images\//, '')) != -1) {
				elemStock = elemImages[n].parentNode;
			}
		}
		//If related images found, load thumbnails
		if(elemStock != null) {
			elemImages = null;
			elemImages = elemStock.getElementsByTagName("image");
			if(elemImages.length > 1) {
				for(n=0;n<elemImages.length;n++) {
					imageViewerSlideshow_Thumbnails_Load(elemImages[n].getAttribute("src"), elemStock.getAttribute("code"));
				}
			}
		}
	}
}

/****** Flash Banner Playlist ******/
var XMLDOM_BannerPlaylist = null;
var bannerRef = null;
var bannerInstance = null;
var bannerGarbage = null;
var bannerCount = 0;
var bannerIndex = 0;
var bannerNoCache = timestamp();

//Loads the flash banner playlist XMLDOM
function loadFlashBannerPlaylist() {
	if(XMLDOM_BannerPlaylist == null) {
		var xmlhttp = null;
		var tempDOM = null;
		var playlist = null;
		
		//If trade, fetch trade playlist and then append standard playlist...
		if(getCookie("accounttype") == "trade") {
			if(window.XMLHttpRequest) {
			//IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp=new XMLHttpRequest();
			} else {
				//IE6, IE5
				xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
			}
			try {
				xmlhttp.open("GET","flash-files/playlist_trade.xml?timestamp="+timestamp(),false);
				xmlhttp.send();
				XMLDOM_BannerPlaylist = xmlhttp.responseXML;
				playlist = XMLDOM_BannerPlaylist.getElementsByTagName("item");
				bannerCount = playlist.length;
			} catch(err) {
				XMLDOM_BannerPlaylist = null
			}
		}
		//Standard playlist
		if(window.XMLHttpRequest) {
			//IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		} else {
			//IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}
		try {
			xmlhttp.open("GET","flash-files/playlist.xml?timestamp="+timestamp(),false);
			xmlhttp.send();
			
			//Has a DOM already been loaded?
			if(XMLDOM_BannerPlaylist == null) {
				//No: Just load into XMLDOM_BannerPlaylist
				XMLDOM_BannerPlaylist = xmlhttp.responseXML;
				playlist = XMLDOM_BannerPlaylist.getElementsByTagName("item");
				bannerCount = playlist.length;
			} else {
				//Yes: Load into tempDOM and append standard playlist to XMLDOM_BannerPlaylist
				tempDOM = xmlhttp.responseXML;
				playlist = tempDOM.getElementsByTagName("item");
				bannerCount = bannerCount + playlist.length;
				var n = 0;
				for(n=0; n<playlist.length; n++) {
					XMLDOM_BannerPlaylist.getElementsByTagName("playlist")[0].appendChild(playlist[n]);
				}
			}
		} catch(err) {
		}
	}
	return XMLDOM_BannerPlaylist;
}
function getFlashBannerPlaylistItem(index) {
	var bannerPlaylist = loadFlashBannerPlaylist();
	var bannerPlaylistItem = bannerPlaylist.getElementsByTagName("item")[index];
	var JSON_PlaylistItem = {
		title: ((bannerPlaylistItem.getElementsByTagName("title")[0].childNodes.length > 0) ? bannerPlaylistItem.getElementsByTagName("title")[0].childNodes[0].nodeValue : ""),
		src: bannerPlaylistItem.getElementsByTagName("src")[0].childNodes[0].nodeValue,
		alt: ((bannerPlaylistItem.getElementsByTagName("alt")[0].childNodes.length > 0) ? bannerPlaylistItem.getElementsByTagName("alt")[0].childNodes[0].nodeValue : ""),
		link: ((bannerPlaylistItem.getElementsByTagName("link")[0].childNodes.length > 0) ? bannerPlaylistItem.getElementsByTagName("link")[0].childNodes[0].nodeValue : ""),
		stockcode: ((bannerPlaylistItem.getElementsByTagName("stockcode")[0].childNodes.length > 0) ? bannerPlaylistItem.getElementsByTagName("stockcode")[0].childNodes[0].nodeValue : ""),
		price: ((bannerPlaylistItem.getElementsByTagName("price")[0].childNodes.length > 0) ? bannerPlaylistItem.getElementsByTagName("price")[0].childNodes[0].nodeValue : "")
	};
	return JSON_PlaylistItem;
}
function getFlashBannerReference() {
	if(bannerRef == null) {
		bannerRef = document.getElementById("flashBanner");
	}
	return bannerRef;
}
function loadFlashBanner(index) {
	if(index >= bannerCount) {
		index = 0;
	}
	bannerIndex = index;
	var playlistItem = getFlashBannerPlaylistItem(index);
	var stage = getFlashBannerReference();
	var instanceId = "flashBannerInstance";
	
	//Has an SWF already been loaded?
	bannerGarbage = document.getElementById(instanceId);
	if(bannerGarbage != null) {
		bannerGarbage.id = "flashBannerGarbage";
		var garbageContainer = document.getElementById(instanceId+"Container");
		garbageContainer.id = bannerGarbage.id+"Container";
	}
	if(stage != null) {
		//stage.innerHTML = "";
		var newContainer = document.createElement("div");
		newContainer.id = instanceId+"Container";
		newContainer.style.opacity = 0;
		
		var newElem = document.createElement("div");
		newElem.id = instanceId;
		newElem.style.visibility = "hidden";
		newContainer.appendChild(newElem);
		stage.appendChild(newContainer);
	}
	
	//Initialise the SWF parameters
	var queryString = "";
	var params = {
		allowScriptAccess: "always",
		wmode: "transparent",
		play : true,
		autoplay: 1
	};
	var atts = {
		id: instanceId,
		name: instanceId,
		height: "128",
		width: "1090"
	};
	var flashvars = {
	};
	if(playlistItem["stockcode"] != "") {
		flashvars.strPrice = XMLDOM_Stock_getPrice(playlistItem["stockcode"]);
		queryString = queryString+"&strPrice="+XMLDOM_Stock_getPrice(playlistItem["stockcode"]);
	}
	//Instantiate the flash banner
	swfobject.embedSWF(playlistItem["src"]+"?timestamp="+bannerNoCache+queryString, instanceId, "1090px", "128px", "8", null, flashvars, params, atts, loadFlashBannerCallback);
	bannerInstance = document.getElementById(instanceId);
}
function loadFlashBannerCallback(e) {
	if(e.success === true) {
		//Hide Solwise HTML logo
		//setTimeout(function() {document.getElementById("companylogo").style.opacity = 0;}, 1000);
	}
}
function unloadOldFlashBanner(e) {
	//Handle the removal of old banner
	if(bannerGarbage != null) {
		var garbageId = bannerGarbage.id;
		var elemContainer = document.getElementById(bannerGarbage.id+"Container");
		elemContainer.style.opacity = 0;
		var t = setTimeout("removeOldFlashBanner()", 3000);
	}
}
function removeOldFlashBanner() {
	if(bannerGarbage != null) {
		var garbageId = bannerGarbage.id;
		var elemContainer = document.getElementById(bannerGarbage.id+"Container");
		swfobject.removeSWF(garbageId);
		elemContainer.parentNode.removeChild(elemContainer);
		bannerGarbage = null;
	}
}
function nextFlashBanner() {
	var index = bannerIndex + 1;
	if(index >= bannerCount) {
		index = 0;
	}
	loadFlashBanner(index);
}
function initFlashBanner() {
	if(swfobject != undefined) {
		loadFlashBannerPlaylist();
		if(XMLDOM_BannerPlaylist != null) {
			getFlashBannerReference();
			var stageRef = getFlashBannerReference();
			stageRef.innerHTML = "";
			loadFlashBanner(0);
		}
	}
}
function callbackStarted() {
	if(bannerInstance != null) {
		var newContainer = document.getElementById(bannerInstance.id+"Container");
		newContainer.style.opacity = 1;
	}
	unloadOldFlashBanner();
}
function callbackComplete() {
	nextFlashBanner();
}