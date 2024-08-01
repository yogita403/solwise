/**
 * MenuSystem Javascript class.
 * 
 * Public protocol:
 * __construct(menuJSON) : Initialises using the argued JSON menu structure
 * load(menuJSON) : Loads a JSON menu structure (overrides the construct argument)
 * displayTopMenu() : Prints an HTML representation for the top menu
 * displaySideMenu() : Prints an HTML representation for the side menu
 * 
 * @param {JSON} menuJSON A JSON representation of the menu structure
 * @returns {MenuSystem}
 */
function MenuSystem(menuJSONArray) {
/*
 * Private protocol
 */
	/*
	 * Private instance variables
	 */
	var _menuItems = null;
	var _loaded = false;
	var _selectedMarked = false;
	var _currentResource = window.location.pathname;
	var _currentPageBelongsTo = null;
	var _menuResourcePrefix = "";
	
	/*
	 * Private instance methods
	 */
	var _getResourceName = function() {
		if(window.location.pathname.substring(0, 4) == "/C:/" || window.location.pathname.substring(0, 4) == "/W:/") {
			_currentResource = window.location.pathname.substring(4);
		} else if(window.location.pathname.substring(0, 4) == "/H:/") {
			_currentResource = window.location.pathname.substring(26);
		} else if(window.location.host == "192.168.0.208") {
			var tempArray = window.location.pathname.split("/");
			_currentResource = tempArray[tempArray.length - 1];
		} else if(window.location.pathname.toLowerCase().indexOf("learningcentre/".toLowerCase()) >= 0) {
			_currentResource = window.location.href;
		} else {
			_currentResource = window.location.pathname;
		}
		if(_currentResource == "/") {
			_currentResource = "index.html";
		}
		if(_currentResource.substring(0,1) == "/") {
			_currentResource = _currentResource.substring(1);
		}
		//document.write("<br />" + window.location.pathname + " :: " + _currentResource);
		
		//alert(window.location.pathname.toLowerCase());
		if(window.location.pathname.toLowerCase().indexOf("/Discontinued%20Items%20&%20History%20Pages".toLowerCase()) >= 0 ||
			window.location.pathname.toLowerCase().indexOf("/downloads".toLowerCase()) >= 0 ||
			window.location.pathname.toLowerCase().indexOf("/tradeform".toLowerCase()) >= 0
		) {
			_menuResourcePrefix = "../";
		}
		var learnCentreURLIndex = window.location.href.toLowerCase().indexOf("learningcentre/".toLowerCase());
		if(learnCentreURLIndex >= 0) {
			//_menuResourcePrefix = "https://www.solwise.co.uk/";
			//_menuResourcePrefix = window.location.protocol + "//" + window.location.host + "/";
			_menuResourcePrefix = window.location.href.substring(0, learnCentreURLIndex);
		}
		
	}
	
	var _load = function(menuJSON) {
		_menuItems = menuJSON;
		_loaded = true;
	};
	
	var _treatMenuStructure = function() {
		var matchFound = false;
		if(_loaded) {
			for(var i=0; i<_menuItems.length; i++) {
				if(_findSelected(_menuItems[i], matchFound) === true) {
					matchFound = true;
				}
			}
			if(!matchFound) {
				_menuItems[0][4] = true;
				_menuItems[0][5] = true;
			}
			_selectedMarked = true;
		}
	};
	
	/**
	 * Determines if element is selected, 
	 * - if so; it marks as select absolute
	 * - if not; it iterates through sub arrays recursively calling itself
	 * If the element is the absolute select, or it contains the absolute select:
	 * - it marks the element as selected and returns true
	 * 
	 * @param {Array} menuArray
	 * @returns {boolean}
	 */
	var _findSelected = function(menuArray, matchAlreadyFound) {
		if(menuArray === undefined) {
			return false;
		}
		var retVal = false;
		
		try {
			//Add the selected elements to the array
			menuArray[4] = false; //Contains Selected
			menuArray[5] = false; //Absolute select
			
			//Test if select absolute
			if(!matchAlreadyFound && menuArray[1] == _currentResource) {
				menuArray[4] = true; //Contains Selected
				menuArray[5] = true; //Absolute select
				retVal = true;
			} else {
				//Test if currentPageBelongsTo
				if(!matchAlreadyFound && _currentPageBelongsTo !== null && menuArray[1] === _currentPageBelongsTo) {
					menuArray[4] = true; //Contains Selected (page belongs to this menu item)
					menuArray[5] = true; //Absolute select
					retVal = true;
				}
				
				//Not select absolute
				//Test if contains absolute select
				for(var i=0; i<menuArray[2].length; i++) {
					if(_findSelected(menuArray[2][i], matchAlreadyFound)) {
						menuArray[4] = true; //Contains Selected
						retVal = true;
					}
				}
			}
			
			//Set empty URL to point to first child (if available)
			if(menuArray[1] == "" && menuArray[2].length > 0) {
				menuArray[1] = menuArray[2][0][1];
			}
		} catch(err) {
			//Do nothing
		}
		//Return boolean idicating if this is or contains selected
		return retVal;
	};
	
	/**
	 * Returns an HTML segment for the menu item including its sub menu items
	 * @param {Array} menuArray
	 * @returns {string}
	 */
	var _getMenuHTML = function(menuArray) {
		if(menuArray === undefined) {
			return "";
		}
		
		var class_selected = false;
		var class_selectActual = false;
		var class_hasChildren = false;
		//Is this item or does this item contain the select actual
		if(_selectedMarked) {
			//Selected (or at least contains select actual)
			if(menuArray[4] === true) {
				class_selected = true;
			}
			//Select actual
			if(menuArray[5] === true) {
				class_selectActual = true;
				
			}
		}
		//Does this menu item have children?
		if(menuArray[2].length > 0) {
			class_hasChildren = true;
		}
		var classString = "";
		if(class_selected) classString = classString + "selected ";
		if(class_selectActual) classString = classString + "actual ";
		if(class_hasChildren) classString = classString + "hasChildren ";
		classString = 'class="' + classString + '"';
		
		
		var retString = "";
		retString += "\n<li "+classString+">" +
				"\n<a href='"+getHref(menuArray[1])+"'>"+menuArray[0]+"</a>\n";
		retString += _getSubMenuHTML(menuArray[2]);
		/*
		if(menuArray[2].length > 0) {
			retString += "\n<ul>";
			for(var i=0; i<menuArray[2].length; i++) {
				retString += _getMenuHTML(menuArray[2][i]);
			}
			retString += "\n</ul>";
		}
		*/
		retString += "\n</li>";
		return retString;
	};
	
	var getHref = function(strURL) {
		var prefix = _menuResourcePrefix;
		if(strURL.toLowerCase().substring(0,7) == "http://" || 
			strURL.toLowerCase().substring(0,8) == "https://" || 
			strURL.toLowerCase().substring(0,3) == "www") {
				prefix = "";
		}
		
		return prefix+strURL;
	};
	
	var _getSubMenuHTML = function(subMenuArray) {
		var retString = "";
		if(subMenuArray !== undefined) {
			if(subMenuArray.length > 0) {
				retString += "\n<ul>";
				for(var i=0; i<subMenuArray.length; i++) {
					retString += _getMenuHTML(subMenuArray[i]);
				}
				retString += "\n</ul>";
			}
		}
		return retString;
	};
	
	var _setCurrentPageBelongsTo = function(url) {
		_currentPageBelongsTo = url;
	};
	
	/*
	 * Construct
	 */
	_getResourceName();
	_load(menuJSONArray);
	
/*
 * Public Protocol
 */
	/*
	 * Public interface
	 */
	var iPublic = {};
	/*
	 * Public instance variables
	 */
	
	/*
	 * Public instance methods
	 */
	iPublic.currentPageBelongsTo = function(url) {
		if(url !== null) {
			_setCurrentPageBelongsTo(url);
		}
	};
	
	iPublic.displaySideMenu = function() {
		_treatMenuStructure();
		var retString = "There was a problem loading the side menu...";
		if(_loaded) {
			retString = "\n<nav class=\"vertical\" id=\"sidemenu\">";
			retString += "\n<ul>";
			for(var i=0; i<_menuItems.length; i++) {
				retString += _getMenuHTML(_menuItems[i]);
			}
			retString += "\n</ul>";
			retString += "\n</nav>";
		}
		document.write(retString);
	};
	
	iPublic.displayTopMenu = function() {
		_treatMenuStructure();
		var retString = "There was a problem loading the top menu...";
		if(_loaded) {
			retString = "\n<nav id=\"topmenu\">";
			retString += "\n<table>\n<tr>";
			for(var i=0; i<_menuItems.length; i++) {
				retString += "\n<td>";
				retString += "\n<a href='"+getHref(_menuItems[i][1])+"'>"+_menuItems[i][0]+"</a>\n";
				retString += _getSubMenuHTML(_menuItems[i][2]);
				retString += "\n</td>";
			}
			retString += "\n</tr>\n</table>";
			retString += "\n</nav>";
		}
		document.write(retString);
	};
	
	iPublic.displayGenericMenu = function(treat) {
		if(treat === true) _treatMenuStructure();
		var retString = "There was a problem loading the side menu...";
		if(_loaded) {
			retString = "\n<nav>";
			retString += "\n<ul>";
			for(var i=0; i<_menuItems.length; i++) {
				retString += _getMenuHTML(_menuItems[i]);
			}
			retString += "\n</ul>";
			retString += "\n</nav>";
		}
		document.write(retString);
	};
	
	//Return the public interface
	return iPublic;
}

//Retrieve menu data
var menu_ts = parseInt(new Date().valueOf() / 1000); //Max expire approx 15mins
document.write("<script type='text/javascript' src='https://www.solwise.co.uk/includes/solwise_menudata.js?" + menu_ts + "'></" + "script>");