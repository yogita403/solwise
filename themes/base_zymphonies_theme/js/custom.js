

/* --------------------------------------------- 
* Filename:     custom.js
* Version:      1.0.0 (2016-11-15)
* Website:      http://www.zymphonies.com
* Description:  Global Script
* Author:       Zymphonies Team
                info@zymphonies.com
-----------------------------------------------*/
window.$ = jQuery;
jQuery(document).ready(function($){


	$('.flexslider').flexslider({
    	animation: "slide"	
    });

	//Main menu
	$('#main-menu').smartmenus();
	
	//Mobile menu toggle
	$('.navbar-toggle').click(function(){
		$('.region-primary-menu').slideToggle();
	});

	//Mobile dropdown menu
	if ( $(window).width() < 767) {
		$(".region-primary-menu li a:not(.has-submenu)").click(function () {
			$('.region-primary-menu').hide();
	    });
	}
	
	$('.rs_signin').click(function() {
		//$("#block-userlogin").toggle();
	});
	
    var link = $('.currentPageBelongsTo').text().trim();
	
    $('#block-left .menu-item a').each(function(){
        if($(this).attr('href') == '/'+link){
            $(this).addClass('is-active');
        }
    });
	
	/*
     * Register jQuery menu events
     */
    /**
	jQuery("nav ul.menu li:not(.menu-item--active-trail)").hover(function() {
		jQuery(this).children("ul").stop(true, true).fadeIn();
	}, function() {
	   jQuery(this).children("ul").stop(true, true).fadeOut();
	});//*/
	jQuery("nav ul.menu li.menu-item--expanded:not(.menu-item--active-trail)").hover(function() {
		jQuery(this).children("ul").stop(true, true).fadeIn();
	}, function() {
	   jQuery(this).children("ul").stop(true, true).fadeOut();
	});

	// Remove p tag from imageviewer
	$('#imageViewer_thumbnails_slider p > img').unwrap();
  $('#imageViewer_thumbnails_slider > img').removeAttr('width');
  $('#imageViewer_thumbnails_slider > img').removeAttr('height');
  $('#quicktabs-product_page_tab .quicktabs-tabpage').each(function(){
        tabId_content = $(this).attr('id').split('quicktabs-tabpage-product_page_tab-');
        var hasContent = $(this).find('.field-content').text();
        if($.trim(hasContent)){
          if($.trim(hasContent) == 'getAccessoriesContent();'){
            $('.quicktabs-tabs').find('a[href="/quicktabs/nojs/product_page_tab/'+ tabId_content[1] +'"]').addClass('disabled').attr('href','javascript:void(0)');
          }
        }else{
          $('.quicktabs-tabs').find('a[href="/quicktabs/nojs/product_page_tab/'+ tabId_content[1] +'"]').addClass('disabled').attr('href','javascript:void(0)');
        }
    });
  
    $('#quicktabs-container-discontinued_product_page_tab .quicktabs-tabpage').each(function(){
        tabId_content = $(this).attr('id').split('quicktabs-tabpage-discontinued_product_page_tab-');
        var hasContent = $(this).find('.field-content').text();
        if($.trim(hasContent)){
          if($.trim(hasContent) == 'getAccessoriesContent'){
            $('.quicktabs-tabs').find('a[href="/quicktabs/nojs/discontinued_product_page_tab/'+ tabId_content[1] +'"]').addClass('disabled').attr('href','javascript:void(0)');
          }
        }else{
          $('.quicktabs-tabs').find('a[href="/quicktabs/nojs/discontinued_product_page_tab/'+ tabId_content[1] +'"]').addClass('disabled').attr('href','javascript:void(0)');
        }
    });
      
    $('.quicktabs-loaded.disabled').off('click');
    
    /* Left-Menu active link js */
    
    $('.menu-item').each(function(){
      if ($(this).find('a').hasClass('is-active')) {
        $(this).addClass('menu-item--active-trail');
      }
    });
    
    $('.parent').each(function(){
      if($(this).hasClass('menu-item--active-trail')){
        $(this).removeClass('menu-item--active-trail');
        $(this).addClass('haschild-active');
      }
    });
});

$(document).ready(function(){
    $('.parent > .down-arrow').click(function() {
			$(this).parent('.parent').siblings().removeClass('openMobileMenu');
			$(this).parent('.parent').toggleClass('openMobileMenu');
	 });
	$(".parent span").click(function(){
        $("body").addClass("intro");
    });
    
    $("#quicktabs-container-product_page_tab .productInfo").wrapAll("<div class='product-info-block'></div>");
    $(".node__content .productInfo").not('.productTable .productInfo').wrapAll("<div class='content-productinfo-block'></div>");
});


