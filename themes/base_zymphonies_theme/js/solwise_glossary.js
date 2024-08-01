/*
 * Uses jQuery
 * Script waits for the document to load and then searches for any <dfn> tags.
 * For each <dfn> tag found, it uses it's contents to search for an <entry> in the solwise_glossary.xml file
 * which contains a <keyword> element whose contents match that of the <dfn> tag.
 * If an entry is found, a mouseover event is registered with the dfn which will load the definition from the XML file.
 */
var dfns;
var glossaryXML;

function loadSolwiseGlossary() {
	/*$.ajax({
		type: "GET",
		url: "solwise_glossary.xml",
		dataType: "xml",
		success: function(xml) {
			glossaryXML = xml;
			registerDefinitions();
		}
	});*/
	var xmlhttp = null;
	if(window.XMLHttpRequest) {
		//IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {
		//IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	try {
		xmlhttp.open("GET","solwise_glossary.xml",false);
		xmlhttp.send();
		glossaryXML = xmlhttp.responseXML;
		registerDefinitions();
	} catch(err) {
	}
}

function registerDefinitions() {
	dfns = $("dfn");
	dfns.each(function() {
		var dfnElem = $(this);
		var dfnContents = dfnElem.text();
		var dfnDefinition = $("<article></article>");
		var dfnDefinitionElem;
		
		$(glossaryXML).find("keyword").filter(function() { 
			return $(this).text().toLowerCase() === dfnContents.toLowerCase(); 
		}).each(function() {
			var dfnArticle = $("<article></article>");
			dfnArticle.append($("<h3></h3>").append($(this).parent().attr("name")));
			dfnArticle.append($(this).parent().find("definition").first().children().clone());
			dfnDefinition.append(dfnArticle);
			//dfnDefinition += $(this).parent().find("definition").first().text();
			//alert(dfnDefinition.html());
		});
		
		if(dfnDefinition.text() !== "") {
			dfnElem.addClass("glossary");
			if(dfnElem.offset().left > ($(document).width() / 2)) {
				dfnElem.addClass("paneleft");
			}
			dfnDefinitionElem = $("<div class=\"definition\"></div>");
			dfnDefinitionElem.html(dfnDefinition.html());
			dfnElem.append(dfnDefinitionElem);
			addDefinitionEvents(dfnElem, dfnDefinitionElem);
		}
	});
}

function addDefinitionEvents(dfnElem, dfnDefinitionElem) {
	var promptToOpen = "Click here to learn more...";
	var promptToClose = "Click to hide...";
	
	//Set click prompt
	dfnElem.attr("title", promptToOpen);
	//Click to toggle view
	dfnElem.click(function(event) {
		event.preventDefault();
		dfnDefinitionElem.stop(true, true).fadeToggle(400, "swing", function() {
			if($(this).is(":visible")) {
				dfnElem.attr("title", promptToClose);
			} else {
				dfnElem.attr("title", promptToOpen);
			}
		});
	});
	dfnElem.click(function(event) {
		event.stopPropagation();
	});
	//Click away to hide
	$(document).click(function(event) {
		if(dfnDefinitionElem.is(":visible")) {
			dfnDefinitionElem.fadeOut(400, "swing", function() {
				dfnElem.attr("title", promptToOpen);
			});
		}
	});
	/*dfnElem.hover(function() {
		dfnDefinitionElem.stop(true, true).fadeIn();
	}, function() {
		dfnDefinitionElem.stop(true, true).fadeOut();
	});*/
}

$(document).ready(function() {
	dfns = $("dfn");
	if(dfns.size() > 0) {
		loadSolwiseGlossary();
	}
});