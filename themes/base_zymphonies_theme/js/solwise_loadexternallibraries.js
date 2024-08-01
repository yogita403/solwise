(function() {
    var e = document.createElement('script');
    e.type = 'text/javascript';
    e.async = true;
    //e.src = '/includes/solwise_tlscheck.js';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(e, s);
})();

//Google Analytics
function loadGoogleAnalytics() {
	if(!window._gaHasLoaded) {
		window._gaHasLoaded = true;

		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
				(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		ga('create', 'UA-5353306-1', 'auto');
		ga('send', 'pageview');
	}
}
loadGoogleAnalytics();


/*
 * Social Plugins
 */
function loadSocialPlugins() {
	loadSocialPlugins_Facebook(document, 'script', 'facebook-jssdk');
	loadSocialPlugins_Twitter(document, 'script', 'twitter-wjs');
	loadSocialPlugins_GooglePlus();
	loadSocialPlugins_Amazon();
}


//Facebook
function loadSocialPlugins_Facebook(d, s, id) {
	var js, fjs = d.getElementsByTagName(s)[0];
	var p=/^http:/.test(d.location)?'http':'https';
	if (d.getElementById(id)) return;
	js = d.createElement(s);
	js.id = id;
	js.async = true;
	js.src = p+"://connect.facebook.net/en_GB/all.js#xfbml=1&appId=480308835392787";
	fjs.parentNode.insertBefore(js, fjs);
}

//Twitter
function loadSocialPlugins_Twitter(d,s,id){
	var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';
	if(!d.getElementById(id)){
		js=d.createElement(s);
		js.id=id;
		js.async = true;
		js.src=p+'://platform.twitter.com/widgets.js';
		fjs.parentNode.insertBefore(js,fjs);
	}
}

//Google Plus
window.___gcfg = {lang: 'en-GB'};
function loadSocialPlugins_GooglePlus() {
	var po = document.createElement('script');
	po.type = 'text/javascript';
	po.async = true;
	po.src = 'https://apis.google.com/js/plusone.js?publisherid=110519309624806488876&onload=googlePlus_loadPlugins';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
	
	po = document.createElement('script');
	po.type = 'text/javascript';
	po.async = true;
	po.src = 'https://apis.google.com/js/client:plusone.js';
	s.parentNode.insertBefore(po, s);
}

function googlePlus_loadPlugins() {
	var APIKey = "AIzaSyCEkhboS5eVQBT2cVPjUJLXQXDPdR0zXfo";
	var userID = "110519309624806488876";
	/*var httpReq = gapi.client.request({
		path: "https://www.googleapis.com/plus/v1/people/110519309624806488876/activities/public",
		method: "GET",
		callback: "googlePlus_callback"
	});
	httpReq.execute();*/
}

//Amazon
function loadSocialPlugins_Amazon() {
	var po = document.createElement('script');
	po.type = 'text/javascript';
	po.async = true;
	po.src = 'https://d1xnn692s7u6t6.cloudfront.net/widget.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
	
	k();
}
function k() {
	window.$SendToKindle && window.$SendToKindle.Widget ? $SendToKindle.Widget.init({
		"content":"#learningcentre>article.post",
		"exclude":"#comments",
		"title":"#singleArticleTitle",
		"author":"#singleArticleAuthor a",
		"published":"#singleArticlePublishDate time"
	}) : setTimeout(k,500);
}
