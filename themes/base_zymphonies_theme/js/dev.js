/* Homepage */
/*var home_dividerLinks = {
	"home_divider_headings_homeplug": "home_divider_homeplug",
	"home_divider_headings_wifi": "home_divider_wifi",
	"home_divider_headings_mobile": "home_divider_mobile",
	"home_divider_headings_laserlink": "home_divider_laserlink",
	"home_divider_headings_cameras": "home_divider_cameras"
};*/
var home_dividerLinks = {};
var home_currentArticle = null;

$(function() {
	/*
	 * On load, create a relational object recording the links between headings and their corresponding articles
	 * Uses linkedto attribute on the list element
	 */
	$("#home_divider_headings>li").each(function() {
		home_dividerLinks[$(this).attr("id")] = $("#"+$(this).attr("linkedto"));
	});
	
	/*
	 * Hide all but the first article
	 */
	var atFirst = true;
	$.each(home_dividerLinks, function(index, value) {
		if(!atFirst) {
			value.css("display", "none");
		} else {
			home_currentArticle = value;
			value.addClass("current");
			$("#home_divider_headings, #home_divider_headings>li").css("border-color", $("#"+index).css("border-color"));
			value.css("display", "block");
			atFirst = false;
		}
	});
	
	/*
	 * Add click event to headings
	 */
	$("#home_divider_headings>li").click(function() {
	//$("#home_divider_headings>li").mouseenter(function() {
		//This ID
		var thisID = $(this).attr("id");
		if(home_currentArticle != home_dividerLinks[thisID]) {

			//Make current heading
			$("#home_divider_headings>li").removeClass("current");
			$(this).addClass("current");
			$("#home_divider_headings, #home_divider_headings>li").css("border-color", $(this).css("border-color"));

			//Toggle articles
			home_currentArticle.hide(400);
			home_currentArticle = home_dividerLinks[thisID];
			home_dividerLinks[thisID].show(400);
		}
	});
});