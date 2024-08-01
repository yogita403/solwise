//Document initialisation
window.onload = init;
window.onUnload = shutdown;
function init() {
	//Set the window name
	window.name = 'SolwiseMainWindow';
	//Set a link targets
	setATargets();
	//Handle gallery elements
	gallery_load();
	//Load APIs
	loadAPIS();
	//Load Content
	loadContent();
	//Set event listeners
	setEvents();
	//Load Social Plugins
	loadSocialPlugins();
}
function shutdown() {
	//Unload vars
	XMLDOM_Stock = null;
}
//Set A link targets
function setATargets() {
	var aLinks = document.getElementsByTagName("a");
	for(var n = 0; n < aLinks.length; n++) {
		if(aLinks[n].href.search(/secure.solwise.co.uk\/trolley.php/i) != -1) {
			aLinks[n].target = "SolwiseOrderWindow";
		}
	}
}
//Load APIs
function loadAPIS() {
	//loadGoogleMapsAPI("initGoogleMapsAPI");
}
//Set event listeners
function setEvents() {
	//setEvents_flashBanner();
//setEvents_imageViewer();
registerExpandableImageEvents();
	setEvents_tabbedContent();
	setEvents_tabbedList();
	//setEvents_TwitterWidget();
}

/*
* flashBanner
*/

function setEvents_flashBanner() {
	/*var strThis = "�1.234567890x";
	if(window.flashBanner_Flash) {
		window.document["flashBanner_Flash"].SetVariable("strThisPrice", strThis);
	} else if(document.flashBanner_Flash) {
		document.flashBanner_Flash.SetVariable("strThisPrice", strThis);
	}*/
}

/*
* imageViewer
*/

//Set events
function setEvents_imageViewer() {
	//Thumbnail MouseOver events
	if(document.getElementById("imageViewerThumbnails") != null) {
		var imageViewerThumbnailImages = document.getElementById("imageViewerThumbnails").getElementsByTagName("img");
		if(imageViewerThumbnailImages != null) {
			for(n = 0; n < imageViewerThumbnailImages.length; n++) {
				imageViewerThumbnailImages[n].onmouseover = imageViewerThumbnails_mouseover;
			}
			imageViewerThumbnailImages[0].onmouseover();
		}
	}
	
	//Image expander
	if(document.getElementById('imageViewerImg') != null) {
		document.getElementById('imageViewerImg').onclick = imageViewerImg_click;
	}
	if(document.getElementById('imageViewerSlideshow_Quit') != null) {
		document.getElementById('imageViewerSlideshow_Quit').onclick = imageViewerSlideshow_Quit_click;
		document.getElementById('imageViewerSlideshow_Quit').onmouseover = imageViewerSlideshow_Quit_mouseover;
		document.getElementById('imageViewerSlideshow_Quit').onmouseout = imageViewerSlideshow_Quit_mouseout;
	}
	imageExpandable = getElementsByClassName("imgExpandable");
	if(imageExpandable != null) {
		for(n = 0; n < imageExpandable.length; n++) {
			imageExpandable[n].onclick = imageViewerImg_click;
		}
	}
}
//Thumbnail image mouseover
function imageViewerThumbnails_mouseover() {
	//Set Image
	var imageViewerImg = document.getElementById("imageViewerImg");
	imageViewerImg.src = this.src;
	
	//Set Title
	var imageViewerTitle = document.getElementById("imageViewerTitle");
	if(this.alt.length > 0) {
		imageViewerTitle.innerHTML = this.alt;
		imageViewerTitle.style.visibility = "visible";
	} else {
		imageViewerTitle.innerHTML = "";
		imageViewerTitle.style.visibility = "hidden";
	}
}
//The image expander
function imageViewerImg_click() {
	if(document.getElementById('imageViewerSlideshow') != null && document.getElementById('imageViewerSlideshow_Image') != null) {
		
		//Process thumbnails
		if(document.getElementById('imageViewerSlideshow_Thumbnails') != null) {
			loadSlideshowThumbnails_Related(this.src);
			if(document.getElementById('imageViewerSlideshow_Thumbnails').innerHTML.length > 1) {
				document.getElementById('imageViewerSlideshow_Thumbnails').style.visibility='visible';
				//document.getElementById('imageViewerSlideshow_Slideshow').style.height = "60%";
				var thumbnails = document.getElementById('imageViewerSlideshow_Thumbnails').getElementsByTagName("img");
				if(thumbnails != null) {
					var n = 0;
					for(n = 0; n < thumbnails.length; n++) {
						thumbnails[n].onmouseover = imageViewerSlideshow_Thumbnails_mouseover;
					}
				}
			} else {
				document.getElementById('imageViewerSlideshow_Thumbnails').style.visibility='hidden';
				document.getElementById('imageViewerSlideshow_Slideshow').style.height = "80%";
			}
		}
		
		//Display slideshow div
		document.getElementById('imageViewerSlideshow_Image').src=this.src;
		document.getElementById('imageViewerSlideshow').style.display='block';
		document.getElementById('imageViewerSlideshow').style.visibility='visible';
	}
}
function imageViewerSlideshow_Quit_click() {
	document.getElementById('imageViewerSlideshow_Image').src='';
	document.getElementById('imageViewerSlideshow').style.display='none';
	document.getElementById('imageViewerSlideshow').style.visibility='hidden';
}
function imageViewerSlideshow_Quit_mouseover() {
	this.src='images/quit_hover.png';
}
function imageViewerSlideshow_Quit_mouseout() {
	this.src='images/quit.png';
}
function imageViewerSlideshow_Thumbnails_mouseover() {
	document.getElementById('imageViewerSlideshow_Image').src=this.src;
}
function imageViewerSlideshow_Thumbnails_Reset() {
	document.getElementById('imageViewerSlideshow_Thumbnails').innerHTML = "";
}
function imageViewerSlideshow_Thumbnails_Load(imgSrc, imgAlt) {
	var myElement = document.createElement("img");
	myElement.setAttribute("src", imgSrc);
	if(imgAlt != null) {
		myElement.setAttribute("alt", imgAlt);
	}
	document.getElementById('imageViewerSlideshow_Thumbnails').appendChild(myElement);
}


/*
* tabbed Content
*/

var tabLinks = new Array();
var contentDivs = new Array();

//Set events
function setEvents_tabbedContent() {
	if(document.getElementById('tabbed') != null) {
		//Control var to determine if tabs are disabled
		var tabEnabled = new Array();
		
		//Get the tabbed links and content divs from the page
		var tabListItems = document.getElementById('tabbed').childNodes;
		for(var i = 0; i < tabListItems.length; i++) {
			if(tabListItems[i].nodeName == "LI") {
				var tabLink = getFirstChildWithTagName(tabListItems[i], 'A');
				var id = getHash(tabLink.getAttribute('href'));
				var tabContentExists = document.getElementById(id);
				var tabEnable = true;
				
				//Determine if content exists
				if(document.getElementById(id) == null) {
					tabEnable = false;
				} else {
					if(document.getElementById(id).getElementsByTagName("div").length == 0) {
						tabEnable = false;
					} else {
						if(document.getElementById(id).getElementsByTagName("div")[0].innerHTML.length < 10) {
							tabEnable = false;
						}
					}
				}
					
				//Determine if tab is enabled
				if(id == "product_videos") {
					if(document.getElementById(id).getElementsByTagName("object").length == 0) {
						//tabEnable = false;
					}
				}
				
				tabLinks[id] = tabLink;
				contentDivs[id] = document.getElementById(id);
				tabEnabled[id] = tabEnable;
			}
		}
		
		//Assign onclick events to the tab links, and highlight the first tab
		var i = 0;
		for(var id in tabLinks) {
			
			if(tabEnabled[id] == false) {
				tabLinks[id].className = 'disabled';
			} else {
				tabLinks[id].onclick = showTab;
			}
			
			tabLinks[id].onfocus = function() {
				this.blur()
			};
			if(i == 0) tabLinks[id].className = 'selected';
			i++;
		}
		
		// Hide all content divs except the first
		var i = 0;
		for(var id in contentDivs) {
			if(i != 0) contentDivs[id].className = 'tabbedContent hide';
			i++;
		}
	}
}

function showTab() {
	var selectedId = getHash(this.getAttribute('href'));
	
	//Highlight the selected tab, and dim all others.
	//Also show the selected content div, and hide all others.
	for(var id in contentDivs) {
		if(tabLinks[id].className != 'disabled') {
			if(id == selectedId) {
				tabLinks[id].className = 'selected';
				contentDivs[id].className = 'tabbedContent';
			} else {
				tabLinks[id].className = '';
				contentDivs[id].className = 'tabbedContent hide';
			}
		}
	}
	
	// Stop the browser following the link
	return false;
}

/*
* Twitter Widget
*/

function setEvents_TwitterWidget() {
	if(document.getElementById('twtr-widget-1') != null) {
		document.getElementById('twtr-widget-1').onmouseover = TwitterWidget_mouseover;
		document.getElementById('twtr-widget-1').onmouseout = TwitterWidget_mouseout;
	}
	var twtrtimeline = getElementsByClassName("twtr-timeline", "div", document.getElementById('twtr-widget-1'));
	if(twtrtimeline.length > 0) {
		twtrtimeline[0].style.height = "100px";
	}
}
function TwitterWidget_mouseover() {
	var twtrtimeline = getElementsByClassName("twtr-timeline", "div", document.getElementById('twtr-widget-1'));
	if(twtrtimeline.length > 0) {
		twtrtimeline[0].style.height = "350px";
	}
}
function TwitterWidget_mouseout() {
	var twtrtimeline = getElementsByClassName("twtr-timeline", "div", document.getElementById('twtr-widget-1'));
	if(twtrtimeline.length > 0) {
		twtrtimeline[0].style.height = "100px";
	}
}

/*
* Gallery handling
*/
var gallery_Galleries = new Array();

function gallery_load() {
	var tabbedList;
	var tabLinks; //Array
	var firstTab;
	
	//Get gallery node list
	var galleryDivs = getElementsByClassName("gallery", "div", document);
	
	//If there are galleries on this page, continue
	if(galleryDivs != null) {
		//For each gallery
		for(var galleryID = 0; galleryID < galleryDivs.length; galleryID++) {
			//Assign gallery an ID
			galleryDivs[galleryID].setAttribute("galleryID", galleryID);
			
			//Store gallery div pointer in global var with ID
			gallery_Galleries[galleryID] = galleryDivs[galleryID];
			
			//Organise the gallery
			gallery_organise(galleryID);
		}
	}
}

function gallery_organise(galleryID) {
	//Get all gallery children...
	var galleryChildren = gallery_Galleries[galleryID].childNodes;
	
	//Declare counters
	var c = 0;
	var cSmall = 0;
	var cProductB = 0;
	
	//For each child...
	for(var n = 0; n < galleryChildren.length; n++) {
		//Is it a valid node type?
		if(galleryChildren[n].nodeType == 1) {
			//If it is a non-hidden (normal sized) product div...
			if(hasClass(galleryChildren[n], "product") && !hasClass(galleryChildren[n], "hidden") && !hasClass(galleryChildren[n], "small")) {
				//Add to counter
				c = c + 1;
			//Else, if it is a small-sized non-hidden product div...
			} else {
				if(hasClass(galleryChildren[n], "product") && !hasClass(galleryChildren[n], "hidden") && hasClass(galleryChildren[n], "small")) {
					//Add to counter
					cSmall = cSmall + 1;
				//Else if it is a productb div and not hidden...
				} else {
					if(hasClass(galleryChildren[n], "productb") && !hasClass(galleryChildren[n], "hidden")) {
						//Add to counter
						cProductB = cProductB + 1;
					//Else if it is not a product div and not hidden...
					} else {
						if(!hasClass(galleryChildren[n], "product") && !hasClass(galleryChildren[n], "hidden")) {
							//Reset counters
							c = 0;
							cSmall = 0;
							cProductB = 0;
						}
					}
				}
			}
			
			//If the counter has reached the row limit + 1...
			if(c == 5 || cSmall == 6 || cProductB == 3) {
				//Make new row
				//galleryChildren[n].className = galleryChildren[n].className + " newrow";
				addClass(galleryChildren[n], "newrow");
				
				//Reset counter (first instance in row)
				c = 1;
				cSmall = 1;
				cProductB = 1;
			//Else...
			} else {
				//Not new row (enforce class)
				//galleryChildren[n].className = galleryChildren[n].className.replace(/(?:^|\s)newrow(?!\S)/, "");
				removeClass(galleryChildren[n], "newrow");
			}
		}
	}
}

/*
* tabbedLists
*/

var tabbedList_Links = new Array();
var tabbedList_Galleries = new Array();
var tabbedList_Filters = new Array();
/*tabbedList_Filters = 
new Array(
	[0] = new Array(
		[0] = new Array(
			"ALL"
		), 
		[1] = new Array(
			"ALL"
		)
	)
);*/

//Set events
function setEvents_tabbedList() {
	var tabbedList;
	var tabLinks; //Array
	var firstTab;
	
	//Get gallery node list
	var galleryDivs = getElementsByClassName("gallery", "div", document);
	
	//If there are galleries on this page, continue
	if(galleryDivs != null) {
		//Iterative processing for every gallery
		for(var galleryID = 0; galleryID < galleryDivs.length; galleryID++) {
			//Reset Vars
			tabLinks = new Array();
			tabEnabled = new Array();
			firstTab = new Array();
			
			//Check if gallery contains a tabbedList
			if(getElementsByClassName("tabbedList", "ul", galleryDivs[galleryID]).length >= 1) {
				//Create a sub array for gallery in the filters array
				tabbedList_Filters[galleryID] = new Array();
				
				//Assign gallery an ID
				galleryDivs[galleryID].setAttribute("tabbedListID", galleryID);
				
				//Store gallery div pointer in global var with ID
				tabbedList_Galleries[galleryID] = galleryDivs[galleryID];
				
				//Iterate through the gallery's tabbed sub lists
				for(var subListID = 0; subListID < getElementsByClassName("tabbedList", "ul", galleryDivs[galleryID]).length; subListID++) {
					tabLinks[subListID] = new Array();
					
					//Create a sub array for the subList in the filters array
					tabbedList_Filters[galleryID][subListID] = new Array();
					//Default to "ALL"
					tabbedList_Filters[galleryID][subListID][0] = "ALL";
					
					//Iterate through tabLinks
					tabbedList = getElementsByClassName("tabbedList", "ul", galleryDivs[galleryID])[subListID].childNodes;
					firstTab[subListID] = false;
					for(var i = 0; i < tabbedList.length; i++) {
						if(tabbedList[i].nodeName == "LI") {
							var tabLink = getFirstChildWithTagName(tabbedList[i], 'A');
							
							//Set tabbedListID attribute (galleryID)
							tabLink.setAttribute("tabbedListID", galleryID);
							//Set subListID attribute
							tabLink.setAttribute("subListID", subListID);
							
							//Determine if content exists for this tab
							var id = getHash(tabLink.getAttribute('href'));
							
							if((getElementsByClassName(id, "div", galleryDivs[galleryID]).length > 0) || (id == "ALL")) {
								//Assign onClick event
								tabLink.onclick = tabbedList_click;
							} else {
								//Set classname to disables
								tabLink.className = "disabled";
							}
							tabLink.onfocus = function() {
								this.blur()
							};
							
							//Record first tab's ID
							if(!firstTab[subListID]) {
								firstTab[subListID] = id;
							}
							
							//Store in gallery specific array
							//tabLinks[subListID] = new Array();
							tabLinks[subListID][id] = tabLink;
						}
					} //End tabLinks Iterations
				} //End subList Iterations
				
				//Store tabLinks in global array
				tabbedList_Links[galleryID] = tabLinks;
				
				//Iterate through each subList and select the first tab
				for(var s = 0; s < firstTab.length; s++) {
					if(firstTab[s] != false && s != "ln") {
						tabbedList_showTab(galleryID, s, firstTab[s]);
					}
				}
			} //End If (contains tabbedLists)
		} //End gallery Iterations
	}
}
function tabbedList_click() {
	var tabbedListID = this.getAttribute('tabbedListID');
	var subListID = this.getAttribute("subListID");
	var id = getHash(this.getAttribute('href'));
	
	//Only process if the tab is not disabled
	if(this.className != 'disabled') {
		//Display the content
		tabbedList_showTab(tabbedListID, subListID, id);
	}
	
	//Stop the browser following the link
	return false;
}
function tabbedList_showTab(tabbedListID, subListID, contentID) {
	var gallery = tabbedList_Galleries[tabbedListID];
	//var galleryContents = getElementsByClassName("productInfo", "div", gallery);
	/*var galleryContents = gallery.childNodes;
	var galleryRelevant = getElementsByClassName(contentID, "div", gallery);*/
	
	//Dim all tabs
	for(var i in tabbedList_Links[tabbedListID][subListID]) {
		if(i != undefined) {
			if(tabbedList_Links[tabbedListID][subListID][i].className != undefined) {
				tabbedList_Links[tabbedListID][subListID][i].className = tabbedList_Links[tabbedListID][subListID][i].className.replace(" selected", "");
			}
		}
	}
	//Highlight the selected tab
	tabbedList_Links[tabbedListID][subListID][contentID].className = tabbedList_Links[tabbedListID][subListID][contentID].className + " selected";
	
	//Pop contentID into Filters array
	tabbedList_Filters[tabbedListID][subListID][0] = contentID;
	
	//Apply the filter
	tabbedList_filter(tabbedListID);
	
	//Reorganise the gallery...
	gallery_organise(tabbedListID);
}

function tabbedList_filter(galleryID) {
	//Load the gallery
	var gallery = tabbedList_Galleries[galleryID];
	var galleryContents = gallery.childNodes;
	var acceptableElem = ["DIV", "H1", "H2", "H3", "H4", "H5"];
	
	//For each gallery child
	for(var childIndex in gallery.childNodes) {
		var child = gallery.childNodes[childIndex];
		//Only process acceptable elements
		//if(child instanceof HTMLDivElement) {
		if(acceptableElem.indexOf(child.nodeName) > -1) {
			//Declare displayChild as true
			var displayChild = true;
			//Build an array of the child's classes
			var childClasses = child.getAttribute("class").split(" ");
			//Do not attempt to exclude elements of class "ALL"
			if(searchArray(childClasses, "ALL") == -1) {
				//For each subList in the gallery's element in the filters array
				for(var subList in tabbedList_Filters[galleryID]) {
					//For each sublist's filter criteria
					for(var n = 0; n < tabbedList_Filters[galleryID][subList].length; n++) {
						var criterion = tabbedList_Filters[galleryID][subList][n];
						//Do not attempt to exclude element if the criterion is "ALL"
						if(criterion != "ALL" && criterion != undefined) {
							//If the filter criterion is not found in the child's classes...
							if(searchArray(childClasses, criterion) == -1) {
								//Exclude the child
								displayChild = false;
							}
						} else {
							//If criterion is ALL, and child class contains "defOff", hide it
							if(criterion == "ALL" && searchArray(childClasses, "defOff") != -1) {
								displayChild = false;
							}
						}
					}
				}
			}
			//If displayChild is False, hide the element
			if(displayChild == false) {
				//Apply hidden class
				addClass(child, "hidden");
				
				//if(child instanceof HTMLDivElement) {
				if(acceptableElem.indexOf(child.nodeName) > -1) {
					//child.style.visibility = "hidden";
					child.style.display = "none";
				}
			} else {
				//Remove hidden class
				removeClass(child, "hidden");
				
				//Else, display the child
				child.style.visibility = "visible";
				child.style.display = "block";
			}
		}
	}
}

/*
* HTML Element Class Manipulation functions
*/
function hasClass(elem, strClass) {
	return $(elem).hasClass(strClass);
}
function addClass(elem, strClass) {
	$(elem).addClass(strClass);
}
function removeClass(elem, strClass) {
	$(elem).removeClass(strClass);
}




/*
 * Image Viewer and related (image slider objects, etc)
 */

//Thumbnail slider functionality
function thumbnailSlider(elemSlider, elemLeft, elemRight, shiftSteps, maxDisplay, moveVertical) {
	//Properties
	var currentPosition = 0;
	var initialMargin = 0;
	elemSlider = $(elemSlider);
	elemLeft = $(elemLeft);
	elemRight = $(elemRight);
	if(shiftSteps === undefined || shiftSteps < 0) {
		shiftSteps = 2;
	}
	if(maxDisplay === undefined || maxDisplay < 0) {
		maxDisplay = 3;
	}
	moveVertical = moveVertical === true;
	var itemCount;
	var itemWidths;
	
	//Methods
	var initialise = function() {
		currentPosition = 0;
		itemCount = elemSlider.children("*").length;
		var fakeSize = !(elemSlider.children("*").width() > 0);
		if(moveVertical) {
			initialMargin = elemSlider.css("marginTop");
			itemWidths = elemSlider.children("*").outerHeight(true);
			elemSlider.css("height", (itemCount * itemWidths) + 20 + "px");
			if(fakeSize) elemSlider.css("height", "1000px");
		} else {
			initialMargin = elemSlider.css("marginLeft");
			itemWidths = elemSlider.children("*").outerWidth(true);
			elemSlider.css("width", (itemCount * itemWidths) + 20 + "px");
			if(fakeSize) elemSlider.css("width", "1000px");
		}
		handleArrowVisibility();
	};
	var handleArrowVisibility = function() {
		if(currentPosition + maxDisplay >= itemCount) {
			elemRight.fadeOut();
		} else {
			elemRight.fadeIn();
		}
		if(currentPosition <= 0) {
			elemLeft.fadeOut();
		} else {
			elemLeft.fadeIn();
		}
	};
	
	//Event handlers
	elemLeft.click(function() {
		var toMove = shiftSteps;
		if(currentPosition < toMove) toMove = currentPosition;
		if(toMove < 0) toMove = 0;
		if(moveVertical) {
			elemSlider.animate({
				marginTop: "+="+(toMove*itemWidths)
			});
		} else {
			elemSlider.animate({
				marginLeft: "+="+(toMove*itemWidths)
			});
		}
		currentPosition = currentPosition - toMove;
		handleArrowVisibility();
	});
	elemRight.click(function() {
		var maxSteps = itemCount - maxDisplay - currentPosition;
		var toMove = shiftSteps;
		if(maxSteps < toMove) toMove = maxSteps;
		if(toMove < 0) toMove = 0;
		if(moveVertical) {
			elemSlider.animate({
				marginTop: "-="+(toMove*itemWidths)
			});
		} else {
			elemSlider.animate({
				marginLeft: "-="+(toMove*itemWidths)
			});
		}
		currentPosition = currentPosition + toMove;
		handleArrowVisibility();
	});
	
	//Construct
	initialise();
	
	return {
		reset: function() {
			initialise();
		}
	};
}

//In page viewer events
$(function() {
	//Register slider
	var thumbnails = new thumbnailSlider(
		$("#imageViewer_thumbnails_slider"),
		$("#imageViewer_thumbnails_up"),
		$("#imageViewer_thumbnails_down"),
		2,
		4,
		true
	);
	
	//Display first item
	var firstItem = $("#imageViewer_thumbnails_slider>*").eq(0);
	$("#imageViewer_image").attr("src", firstItem.attr("src"));
	firstItem.addClass("current");
	$("#imageViewer_title").text(firstItem.attr("alt"));
	
	//Thumbnail click
	$("#imageViewer_thumbnails_slider>*").click(function() {
		$("#imageViewer_image").attr("src", this.src);
		var titleText = this.alt;
		if(!titleText) {
			$("#imageViewer_title").text("");
		} else {
			$("#imageViewer_title").text(titleText);
		}
		$("#imageViewer_thumbnails_slider>*").removeClass("current");
		$(this).addClass("current");
	});
	
	//Main Image click
	$("#imageViewer_stage").click(function() {
		imageViewerSlideshow.loadImageCollection($("#imageViewer_thumbnails_slider>*").clone());
		imageViewerSlideshow.displayItemAt($("#imageViewer_thumbnails_slider>*.current").index());
		imageViewerSlideshow.show();
	});
});

/*
 * Full screen image viewer functionality
 */
function registerExpandableImageEvents() {
	//Expandable set of thumbnails
	$(".thumbsExpandable").each(function() {
		var imgs = $(this).find("img");
		imgs.removeClass("imgExpandable");
		imgs.click(function() {
			imageViewerSlideshow.loadImageCollection(imgs.clone());
			imageViewerSlideshow.displayItemAt($(this).index());
			imageViewerSlideshow.show();
		});
	});
	
	//Individual expandable images
	$(".imgExpandable").each(function() {
		$(this).click(function() {
			imageViewerSlideshow.loadImageURLs(getRelatedImages(this.src));
			imageViewerSlideshow.show();
		});
	});
}
var imageViewerSlideshow;
$(function() {
	imageViewerSlideshow = new imageViewerLightbox();
});
function imageViewerLightbox() {
	//Public interface
	var iPublic = {};
	//The containing element
	var container;
	//Main image
	var mainImage;
	//Thumbnails slider object
	var thumbnails;
	
	//Display thumbnail with specified index
	var displayItemAt = function(index) {
		var selectedElem = $("#imageViewerSlideshow_Thumbnails>*").eq(index);
		display(selectedElem);
	};
	iPublic.displayItemAt = displayItemAt;
	//Display argued element
	var display = function(elem) {
		elem = $(elem);
		$("#imageViewerSlideshow_Image").attr("src", elem.attr("src"));
		$("#imageViewerSlideshow_Title").text(elem.attr("alt"));
		$("#imageViewerSlideshow_Thumbnails>*").removeClass("current");
		elem.addClass("current");
	};
	iPublic.display = display;
	
	//Load a collection of images
	var loadImageCollection = function(jqImgSet) {
		$("#imageViewerSlideshow_Thumbnails").empty();
		$("#imageViewerSlideshow_Thumbnails").append(jqImgSet);
		initialise();
	};
	iPublic.loadImageCollection = loadImageCollection;
	
	/**
	 * Load a collection of images URLs
	 * 
	 * Expects array as:
	 * [
	 *		{
	 *			url: "/some/path",
	 *			alt: "/Alternative Text",
	 *		},
	 *		...
	 * ]
	 * 
	 * @param {array} arrayURLs
	 * @returns {undefined}
	 */
	var loadImageURLs = function(arrayURLs) {
		$("#imageViewerSlideshow_Thumbnails").empty();
		$.each(arrayURLs, function(key, value) {
			$("#imageViewerSlideshow_Thumbnails").append($("<img />").attr({
				src: value.url,
				alt: value.alt
			}));
		});
		initialise();
	};
	iPublic.loadImageURLs = loadImageURLs;
	
	//Re-initialise
	var initialise = function() {
		thumbnails.reset();
		displayItemAt(0);
		
		//Thumbnail image click
		$("#imageViewerSlideshow_Thumbnails img").click(function() {
			display(this);
		});
	};
	
	//Show/hide lightbox
	var show = function() {
		container.fadeIn(function() {
			thumbnails.reset();
		});
	};
	iPublic.show = show;
	var hide = function() {
		container.fadeOut();
	};
	iPublic.hide = hide;
	
//Construct
	$(function() {
		//Get the container
		container = $("#imageViewerSlideshow");
		
		//Register slider
		thumbnails = new thumbnailSlider(
			$("#imageViewerSlideshow_Thumbnails"),
			$("#imageViewerSlideshow_Thumbnails_LeftArrow"),
			$("#imageViewerSlideshow_Thumbnails_RightArrow"),
			2,
			3,
			false
		);
		
		//Register events
		//Close fullscreen viewer
		$("#imageViewerSlideshow_Quit").click(function() {
			hide();
		});
		$("#imageViewerSlideshow").click(function() {
			hide();
		});
		$("#imageViewerSlideshow_Header, #imageViewerSlideshow_Stage").click(function(event) {
			event.stopPropagation();
		});
		
		//Initialisation routine
		initialise();
	});
	
//Public interface
	return iPublic;
}
