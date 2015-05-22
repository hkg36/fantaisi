// JavaScript Document

var Util = {

    uuid:function () {
        var uuid = (function () {
            var i, c = "89ab", u = [];
            for (i = 0; i < 36; i += 1) {
                u[i] = (Math.random() * 16 | 0).toString(16);
            }
            u[8] = u[13] = u[18] = u[23] = "-";
            u[14] = "4";
            u[19] = c.charAt(Math.random() * 4 | 0);
            return u.join("");
        })();
        return {
            toString:function () {
                return uuid;
            },
            valueOf:function () {
                return uuid;
            }
        };
    },

    isIOS6:function () {
        if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
            if (/OS [6](.*) like Mac OS X/i.test(navigator.userAgent)) {
                return true;
            }
        }
        return false;
    },

    isOpera:function () {
        return window.opera || jQuery.browser.opera;
    },

    isIE:function () {
        return jQuery.browser.msie;
    },

    isChrome:function () {
        return (typeof window.chrome === "object") ||
            /chrome/.test(navigator.userAgent.toLowerCase()) ||
            /chrom(e|ium)/.test(navigator.userAgent.toLowerCase())
    },

    closeDDLevelsMenu:function (e, target) {
        var close = true;
        var subuls = ddlevelsmenu.topitems['nav'];
        if (subuls) {
            for (var i = 0; i < subuls.length; i++) {
                if (jQuery(subuls[i].parentNode).has(target).length > 0) {
                    close = false;
                }
            }
        }
        if (close) {
            subuls = ddlevelsmenu.subuls['nav'];
            if (subuls) {
                for (i = 0; i < subuls.length; i++) {
                    if (jQuery(subuls[i]).has(target).length > 0) {
                        close = false;
                    }
                }
            }
        }
        if (close) {
            subuls = ddlevelsmenu.subuls['nav'];
            if (subuls) {
                for (i = 0; i < subuls.length; i++) {
                    ddlevelsmenu.hidemenu(subuls[i].parentNode);
                }
            }
        }
    }

};

(function ($) {

    $.fn.flexSliderInitializer = function (flexSliderObj) {

        var effect = flexSliderObj.effect;
        var slideshow = flexSliderObj.slideshow;
        var sliderSelector = flexSliderObj.selector;
        var sliders = $(sliderSelector);
        var players;

        if (sliders.length > 0) {
            sliders.each(function () {
                var sliderElement = this;
                var initSlidersInvoked = false;
                var unloadedImagesCount = 0;
                var unloadedImages = [];

                var sliderImages = $(sliderElement).find('img');
                sliderImages.each(function () {
                    if (!this.complete && this.complete != undefined) {
                        unloadedImages.push(this);
                        unloadedImagesCount++;
                    }
                });

                if (unloadedImagesCount == 0) {
                    initSlider(sliderElement);
                } else {
                    var loadedImagesCount = 0;
                    $(unloadedImages).bind('load', function () {
                        loadedImagesCount++;
                        if (loadedImagesCount === unloadedImagesCount) {
                            if (!initSlidersInvoked) {
                                initSlidersInvoked = true;
                                initSlider(sliderElement);
                            }
                        }
                    });
                    var timer = window.setTimeout( function() {
                        window.clearTimeout(timer);
                        $(unloadedImages).each(function() {
                            if(this.complete || this.complete === undefined) {
                                $(this).trigger('load');
                            }
                        });
                    }, 50);
                }
            });
        }

        function initSlider(sliderElement) {
            var slider = $(sliderElement);
            players = slider.find('iframe');

            slider.fitVids().flexslider({
                animation:effect,
                smoothHeight: (effect=='slide'),
                pauseOnHover:true, //Boolean: Pause the slideshow when hovering over slider, then resume when no longer hovering
                video: (effect=='slide'),
                slideshow: slideshow,
                controlsContainer:sliderSelector,
                before:function (slider) {
                    pausePlayers();
                }
            });

            // Swipe gestures support
            if (Modernizr.touch && $().swipe) {
                var next = slider.find('a.flex-next');
                var prev = slider.find('a.flex-prev');

                function doFlexSliderSwipe(e, dir) {
                    if (dir.toLowerCase() == 'left') {
                        next.trigger('click');
                    }
                    if (dir.toLowerCase() == 'right') {
                        prev.trigger('click');
                    }
                }

                slider.swipe({
                    click:function (e, target) {
                        $(target).trigger('click');
                    },
                    swipeLeft:doFlexSliderSwipe,
                    swipeRight:doFlexSliderSwipe,
                    allowPageScroll:'auto'
                });
            }
        }

        function pausePlayers() {
            if (players.length > 0 && window.$f) {
                players.each(function () {
                    try {
                        $f(this).api('pause');
                    } catch (e) {
                    }
                });
            }
        }

    };

})(jQuery);

(function ($) {

    $.fn.responsiveSearch = function (op) {
        var rs = $.fn.responsiveSearch;
        var settings = $.extend({}, rs.defaults, op);
        var searchInput = $(this);
        var searchButton = $('#search-submit');

        installListeners();

        function setSearchInputVisible(display) {
            if (display) {
                searchInput.fadeIn(settings.animSpeed);
            } else {
                searchInput.fadeOut(settings.animSpeed);
            }
        }

        function installListeners() {
            searchButton.bind('click', function () {
                var isSearchHidden = (searchInput.css('display') == 'none');
                if (isSearchHidden) {
                    setSearchInputVisible(true);
                    return false;
                } else if ($.trim(searchInput.val()) == '') {
                    setSearchInputVisible(false);
                    return false;
                } else {
                    return true;
                }
            });
        }

        rs.hide = function (target) {
            if (target.id != 's' && target.id != 'search-submit') {
                var isSearchVisible = (searchInput.css('display') != 'none');
                if (isSearchVisible) {
                    setSearchInputVisible(false);
                }
            }
        };

        return rs;

    };

    var pcc = $.fn.responsiveSearch;
    pcc.defaults = {
        animSpeed:500
    };

})(jQuery);

// This library re-implements setTimeout, setInterval, clearTimeout, clearInterval for iOS6.
// iOS6 suffers from a bug that kills timers that are created while a page is scrolling.
// This library fixes that problem by recreating timers after scrolling finishes (with interval correction).
// This code is free to use by anyone (MIT, blabla).
// Original Author: rkorving@wizcorp.jp
if (Util.isIOS6()) {
    (function (window) {
        var timeouts = {};
        var intervals = {};
        var orgSetTimeout = window.setTimeout;
        var orgSetInterval = window.setInterval;
        var orgClearTimeout = window.clearTimeout;
        var orgClearInterval = window.clearInterval;
        // To prevent errors if loaded on older IE.
        if (!window.addEventListener) return false;
        function createTimer(set, map, args) {
            var id, cb = args[0],
                repeat = (set === orgSetInterval);

            function callback() {
                if (cb) {
                    cb.apply(window, arguments);
                    if (!repeat) {
                        delete map[id];
                        cb = null;
                    }
                }
            }

            args[0] = callback;
            id = set.apply(window, args);
            map[id] = {
                args:args,
                created:Date.now(),
                cb:cb,
                id:id
            };
            return id;
        }

        function resetTimer(set, clear, map, virtualId, correctInterval) {
            var timer = map[virtualId];
            if (!timer) {
                return;
            }
            var repeat = (set === orgSetInterval);
            // cleanup
            clear(timer.id);
            // reduce the interval (arg 1 in the args array)
            if (!repeat) {
                var interval = timer.args[1];
                var reduction = Date.now() - timer.created;
                if (reduction < 0) {
                    reduction = 0;
                }
                interval -= reduction;
                if (interval < 0) {
                    interval = 0;
                }
                timer.args[1] = interval;
            }
            // recreate
            function callback() {
                if (timer.cb) {
                    timer.cb.apply(window, arguments);
                    if (!repeat) {
                        delete map[virtualId];
                        timer.cb = null;
                    }
                }
            }

            timer.args[0] = callback;
            timer.created = Date.now();
            timer.id = set.apply(window, timer.args);
        }

        window.setTimeout = function () {
            return createTimer(orgSetTimeout, timeouts, arguments);
        };
        window.setInterval = function () {
            return createTimer(orgSetInterval, intervals, arguments);
        };
        window.clearTimeout = function (id) {
            var timer = timeouts[id];
            if (timer) {
                delete timeouts[id];
                orgClearTimeout(timer.id);
            }
        };
        window.clearInterval = function (id) {
            var timer = intervals[id];
            if (timer) {
                delete intervals[id];
                orgClearInterval(timer.id);
            }
        };
        //check and add listener on the top window if loaded on frameset/iframe
        var win = window;
        while (win.location != win.parent.location) {
            win = win.parent;
        }
        win.addEventListener('scroll', function () {
            // recreate the timers using adjusted intervals
            // we cannot know how long the scroll-freeze lasted, so we cannot take that into account
            var virtualId;
            for (virtualId in timeouts) {
                resetTimer(orgSetTimeout, orgClearTimeout, timeouts, virtualId);
            }
            for (virtualId in intervals) {
                resetTimer(orgSetInterval, orgClearInterval, intervals, virtualId);
            }
        });
    }(window));
}

// jQuery Initialization
jQuery(document).ready(function ($) {

    /* ---------------------------------------------------------------------- */
    /*	Detect Touch Device
    /* ---------------------------------------------------------------------- */

    if (Modernizr.touch) {
        function removeHoverState() {
            $("body").addClass("no-touch");
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Fixes for Browsers
    /* ---------------------------------------------------------------------- */

    if (Util.isOpera()) {
        $('.flexslider .slides > li').each(function () {
            $(this).css('overflow', 'hidden');
        });
    }

    /* ---------------------------------------------------------------------- */
    /* jCarousel
    /* ---------------------------------------------------------------------- */

    var allCarousels = [
        {'selector':'.post-carousel', 'customSettings':{}},
        {'selector':'.testimonial-carousel', 'customSettings':{auto:5}},
        {'selector':'.project-carousel', 'customSettings':{scroll:4, visible:null}}
    ];

    function resetCarouselPosition(carousel) {
        if (carousel.data('resizing')) {
            carousel.css('left', '0');
        }
    }

    function getCarouselScrollCount() {
        var windowWidth = $(window).width();
        if (windowWidth < 480) {
            return 1;
        } else if (windowWidth < 768) {
            return 2;
        } else if (windowWidth < 960) {
            return 3;
        } else {
            return 4;
        }
    }

    function swipeCarousel(e, dir) {
        var carouselParent = $(e.currentTarget).parents().eq(2);
        if (dir.toLowerCase() == 'left') {
            carouselParent.find('.jcarousel-next').trigger('click');
        }
        if (dir.toLowerCase() == 'right') {
            carouselParent.find('.jcarousel-prev').trigger('click');
        }
    }

    function initCarousel(carouselObj, bindGestures) {
        var carouselSelector = carouselObj.selector;
        var customSettings = carouselObj.customSettings;

        var carousels = $(carouselSelector);
        if (carousels.length > 0) {
            carousels.each(function (i) {
                var carousel = $(this);
                var defaultSettings = {
                    scroll:1,
                    visible:1,
                    wrap:"last",
                    easing:"swing",
                    itemVisibleInCallback:function () {
                        onBeforeAnimation : resetCarouselPosition(carousel);
                        onAfterAnimation : resetCarouselPosition(carousel);
                    }
                };
                var settings = $.extend({}, defaultSettings, customSettings);
                settings.scroll = Math.min(getCarouselScrollCount(), settings.scroll);
                carousel.jcarousel(settings);
            });

            if (bindGestures && Modernizr.touch && $().swipe) {
                carousels.swipe({
                    click:function (e, target) {
                        $(target).trigger('click');
                    },
                    swipeLeft:swipeCarousel,
                    swipeRight:swipeCarousel,
                    allowPageScroll:'auto'
                });
            }
        }
    }

    function resizeCarousel(carouselObj) {
        var carousels = $(carouselObj.selector);
        if (carousels.length > 0) {
            carousels.each(function () {
                var carousel = $(this);
                var carouselChildren = carousel.children('li');
                var carouselItemWidth = carouselChildren.first().outerWidth(true);
                var newWidth = carouselChildren.length * carouselItemWidth + 100;
                if (carousel.width() !== newWidth) {
                    carousel.css('width', newWidth).data('resizing', 'true');
                    initCarousel(carouselObj, false);
                    carousel.jcarousel('scroll', 1);
                    var timer = window.setTimeout(function () {
                        window.clearTimeout(timer);
                        carousel.data('resizing', null);
                    }, 600);
                }
            });
        }
    }

    function resizeAllCarousels() {
        if ($().jcarousel && allCarousels) {
            for (var i = 0; i < allCarousels.length; i++) {
                resizeCarousel(allCarousels[i]);
            }
        }
    }

    function initAllCarousels() {
        if ($().jcarousel && allCarousels) {
            for (var i = 0; i < allCarousels.length; i++) {
                initCarousel(allCarousels[i], true);
            }
        }
    }

    initAllCarousels();

    /* ---------------------------------------------------------------------- */
    /* Tiny Nav
    /* ---------------------------------------------------------------------- */

    if ($().tinyNav) {

        $('html').addClass('js');
        $("#navlist").tinyNav();

    }

    /* ---------------------------------------------------------------------- */
    /* Responsive Search (must be placed after Tiny Nav)
    /* ---------------------------------------------------------------------- */

    var searchInput = $('#s');
    if (searchInput.length > 0) {
        var responsiveSearchInstance = searchInput.responsiveSearch();
    }

    /* ---------------------------------------------------------------------- */
    /* Responsive Video Embeds (must be called before the FlexSlider initialization)
    /* ---------------------------------------------------------------------- */

    function resizeVideoEmbed() {
        if ($().fitVids) {
            $(".entry-video").fitVids();
        }
    }

    resizeVideoEmbed();

    /* ---------------------------------------------------------------------- */
    /* Flex Slider
    /* ---------------------------------------------------------------------- */

    var allFlexSliders = [
        {'selector':'#flexslider-home', 'effect':'fade', 'slideshow':true},
        {'selector':'#flexslider-about-us', 'effect':'slide', 'slideshow':false},
        {'selector':'#flexslider-portfolio-item', 'effect':'slide', 'slideshow':false}
    ];

    function initAllFlexSliders() {
        if ($().flexslider && allFlexSliders) {
            for (var i = 0; i < allFlexSliders.length; i++) {
                $().flexSliderInitializer(allFlexSliders[i]);
            }
        }
    }

    initAllFlexSliders();
	
	/* ---------------------------------------------------------------------- */
    /* Revolution Slider
    /* ---------------------------------------------------------------------- */
	
	if ($().revolution) {
		
	var tpj=jQuery;
	tpj.noConflict();

	tpj(document).ready(function() {

	if (tpj.fn.cssOriginal!=undefined)
		tpj.fn.css = tpj.fn.cssOriginal;

		tpj('.banner').revolution(
			{
				delay:6000,
				startwidth:1020,
				startheight:430,
				hideThumbs:200,
				thumbWidth:100,							// Thumb With and Height and Amount (only if navigation Tyope set to thumb !)
				thumbHeight:50,
				thumbAmount:5,
				navigationType:"bullet",					//bullet, thumb, none, both		(No Thumbs In FullWidth Version !)
				navigationArrows:"verticalcentered",		//nexttobullets, verticalcentered, none
				navigationStyle:"round",
				touchenabled:"on",						// Enable Swipe Function : on/off
				onHoverStop:"on",
				navOffsetHorizontal:0,
				navOffsetVertical:20,
				stopAtSlide:-1,							// Stop Timer if Slide "x" has been Reached. If stopAfterLoops set to 0, then it stops already in the first Loop at slide X which defined. -1 means do not stop at any slide. stopAfterLoops has no sinn in this case.
				stopAfterLoops:-1,						// Stop Timer if All slides has been played "x" times. IT will stop at THe slide which is defined via stopAtSlide:x, if set to -1 slide never stop automatic
				hideCaptionAtLimit:0,					// It Defines if a caption should be shown under a Screen Resolution ( Basod on The Width of Browser)
				hideAllCaptionAtLilmit:0,				// Hide all The Captions if Width of Browser is less then this value
				hideSliderAtLimit:0,
				shadow:0,								//0 = no Shadow, 1,2,3 = 3 Different Art of Shadows  (No Shadow in Fullwidth Version !)
				fullWidth:"off"							// Turns On or Off the Fullwidth Image Centering in FullWidth Modus
			});
		});
	
	}

    /* ---------------------------------------------------------------------- */
    /* Tooltips
    /* ---------------------------------------------------------------------- */

    if ($().tipsy) {

        $('.clients img[title], .social-links a[title], .about-us img[title]').tipsy({
            fade:true,
            gravity:$.fn.tipsy.autoNS,
            offset:3
        });

    }

    /* ---------------------------------------------------------------------- */
    /* Scroll to Top
    /* ---------------------------------------------------------------------- */

    if ($().UItoTop) {

        $().UItoTop({
            scrollSpeed:400
        });

    }

    /* ---------------------------------------------------------------------- */
    /* Fix for YouTube Iframe Z-Index
    /* ---------------------------------------------------------------------- */

    $("iframe").each(function () {
        var ifr_source = $(this).attr('src');
        var wmode = "wmode=transparent";
        if (ifr_source.indexOf('?') != -1) {
            var getQString = ifr_source.split('?');
            var oldString = getQString[1];
            var newString = getQString[0];
            $(this).attr('src', newString + '?' + wmode + '&' + oldString);
        }
        else $(this).attr('src', ifr_source + '?' + wmode);
    });

    /* ---------------------------------------------------------------------- */
    /* Notification Boxes
    /* ---------------------------------------------------------------------- */

    $(".notification-close-info").click(function () {
        $(".notification-box-info").fadeOut("fast");
        return false;
    });

    $(".notification-close-success").click(function () {
        $(".notification-box-success").fadeOut("fast");
        return false;
    });

    $(".notification-close-warning").click(function () {
        $(".notification-box-warning").fadeOut("fast");
        return false;
    });

    $(".notification-close-error").click(function () {
        $(".notification-box-error").fadeOut("fast");
        return false;
    });

    /* ---------------------------------------------------------------------- */
    /* Tabs
    /* ---------------------------------------------------------------------- */

    if ($().tabs) {
        $(".tabs").tabs();
    }

    /* ---------------------------------------------------------------------- */
    /* Toggle
    /* ---------------------------------------------------------------------- */

    if ($().toggle) {

        $(".toggle").each(function () {
            if ($(this).attr('data-id') == 'open') {
                $(this).accordion({header:'.toggle-title', collapsible:true, heightStyle:"content"});
            } else {
                $(this).accordion({header:'.toggle-title', collapsible:true, heightStyle:"content", active:false});
            }
        });

    }

    /* ---------------------------------------------------------------------- */
    /* Accordion
    /* ---------------------------------------------------------------------- */

    if ($().accordion) {
        $(".accordion").accordion({
            header:'.accordion-title',
            collapsible:true,
            heightStyle:"content"
        });
    }

    /* ---------------------------------------------------------------------- */
    /* Portfolio Filter
    /* ---------------------------------------------------------------------- */

    var $container = $('#gallery');

    if ($.isotope) {
        // initialize Isotope
        $container.isotope({
            // options...
            itemSelector:'.entry'
        });
    }

    // filter items when filter link is clicked
    $('#filter').find('a').click(function () {
        var selector = $(this).attr('data-filter');
        $container.isotope({ filter:selector });
        return false;
    });

    // set selected menu items
    var $optionSets = $('.option-set'),
        $optionLinks = $optionSets.find('a');

    $optionLinks.click(function () {
        var $this = $(this);
        // don't proceed if already selected
        if ($this.hasClass('selected')) {
            return false;
        }
        var $optionSet = $this.parents('.option-set');
        $optionSet.find('.selected').removeClass('selected');
        $this.addClass('selected');
    });

    /* ---------------------------------------------------------------------- */
    /* Newsletter Subscription
    /* ---------------------------------------------------------------------- */

    if ($().validate) {
        $("#send-newsletter-form").validate();
    }

    var newsletterForm = $("#newsletter-form");
    if (newsletterForm && newsletterForm.length > 0) {
        var newsletterSubscribeButton = newsletterForm.find("#subscribe");
        var newsletterEmailInput = newsletterForm.find("#newsletter");

        newsletterSubscribeButton.bind("click", function () {

            if ($("#newsletter-form").valid()) {
                $("#subscribe").attr('disabled', 'disabled');
                jQuery.ajax({
                    type:"POST",
                    url:"newsletter.php",
                    data:getSubscribeFormData(),
                    statusCode:{
                        200:function () {
                            $("#newsletter-notification-box-success").css('display', '');
                            newsletterSubscribeButton.removeAttr('disabled', '');
                            resetSubscribeFormData();
                        },
                        500:function () {
                            $("#newsletter-notification-box-error").css('display', '');
                            newsletterSubscribeButton.removeAttr('disabled');
                        }
                    }
                });
            }

            function getSubscribeFormData() {
                var data = 'action=subscribe';
                if (newsletterEmailInput && newsletterEmailInput.length > 0) {
                    data += '&email=' + newsletterEmailInput.attr('value');
                }
                return data;
            }

            function resetSubscribeFormData() {
                if (newsletterEmailInput && newsletterEmailInput.length > 0) {
                    newsletterEmailInput.attr('value', '');
                }
            }

            return false;
        });
    }

	
    /* ---------------------------------------------------------------------- */
    /* Sticky Footer
    /* ---------------------------------------------------------------------- */

    // Set minimum height so that the footer will stay at the bottom of the window even if there isn't enough content
    function setMinHeight() {
        var body = $('body');
        var wrap = $('#wrap');
        var content = $('#content');
        content.css('min-height',
            $(window).outerHeight(true)
                - ( body.outerHeight(true) - body.height() )
                - ( wrap.outerHeight(true) - wrap.height() )
                - $('#header').outerHeight(true)
                - $('#slider-home').outerHeight(true)
                - $('#page-title').outerHeight(true)
                - ( content.outerHeight(true) - content.height() )
                - $('#footer').outerHeight(true)
        );
    }

    // Init
    setMinHeight();

    // Window resize
    $(window).on('resize', function () {
        var timer = window.setTimeout(function () {
            window.clearTimeout(timer);
            setMinHeight();
            resizeAllCarousels();
        }, 30);
    });


    if (Modernizr.touch) {
        $(document).on('touchstart', function (e) {
            var target = e.target;
            if (responsiveSearchInstance) {
                responsiveSearchInstance.hide(target);
            }
            Util.closeDDLevelsMenu(e, target);
        });
    } else {
        $(document).click(function (e) {
            Util.closeDDLevelsMenu(e, '');
            if (responsiveSearchInstance) {
                responsiveSearchInstance.hide(e.target);
            }
        });
    }
    $(".lightbox").each(function(){
        var ctrl=$(this)
        $.getJSON(ctrl.attr("href")+"?imageInfo",function(data){
            ctrl.attr("pic_width",data.width)
            ctrl.attr("pic_height",data.height)
        })
    })
    $(".lightbox").on("click",function(){
        var groupname=$(this).attr("swipe-group")
        var findstring=".lightbox"
        if(typeof(groupname)!="undefined"){
            findstring=findstring+"[swipe-group="+groupname+"]"
        }
        var allpic=$(findstring)
        var checked=-1;
        var now_check=this
        var items=[]
        allpic.each(function(index){
            if(this==now_check){
                checked=index;
            }
            items.push({
                image_ctrl:$(this).find("img")[0],
                msrc:$(this).find("img").attr("src"),
            src: $(this).attr("href"),
            w: $(this).attr("pic_width"),
            h: $(this).attr("pic_height")
            })
        })
        var options = {
            index: checked ,
            showHideOpacity:true,
            bgOpacity:0.5,
            shareButtons: [
                {id:'download', label:'下载图片', url:'', download:true}
            ],
            getThumbBoundsFn: function(index) {
	            // See Options -> getThumbBoundsFn section of docs for more info
	            var thumbnail = items[index].image_ctrl; // find thumbnail
	                pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
	                rect = thumbnail.getBoundingClientRect();
	            return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
	        }
        };
        var pswpElement=$('.pswp')[0];
        var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init()
        return false;
    })

    $("#qqlogin_bn").on("click",function(){
        QC.Login.showPopup({
           appId:"101218076",
           redirectURI:"http://test.wowfantasy.cn/login/QQLogin"
        });
    })
    QC.Login({},QQLoginFun,QQLogoutFun)
    $("#logininfo_plane").on("click",function(){
        var type=$(this).attr("type")
        swal({
                title: "注销",
                text: "是否注销当前用户?某些功能将不能使用.",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "注销!",
                cancelButtonText: "取消",
                closeOnConfirm: true,
            },
        function(){
          if(type=="qq"){
                QC.Login.signOut()
            }
            else if(type=="wb") {
              WB2.logout(function () {
                  CheckWeiboStatus(false);
              })
          }
        });
    })

    $("#wblogin_bn").on("click",function(){
        WB2.login(function(){
            CheckWeiboStatus(true);
        })
    })
    CheckWeiboStatus(false)

    moment.locale('en',{})
    UpdateDateString();
});
var QQUser={}
function QQLoginFun(oInfo, oOpts)
{
    $.extend(QQUser,oInfo)
    $("#logininfo_plane").html("<img class='h_center' src=\""+QQUser.figureurl+"\"><div class=\"intro\">"+QQUser.nickname+"</div>")
    $("#logininfo_plane").attr("type","qq")
    $("#logininfo_plane").show()
    $("#loginbn_plane").hide()
    QC.Login.getMe(function (openId, accessToken) {
        QQUser.openId = openId
        QQUser.accessToken = accessToken
        if($.cookie("qqopenid")!=QQUser.openId){
            $.post("/login/QQUserInfo",QQUser)
        }
    })
}
function QQLogoutFun(){
    QQUser={}
    $("#loginbn_plane").show()
    $("#logininfo_plane").hide()
}
$.validator.addMethod("phoneCN", function(phone_number, element) {
    return this.optional(element) || phone_number.match(/^[0-9\-\(\)\s]+$/);
}   , "电话号码不正确");

function UpdateDateString(){
    $(".entry-date").each(function(){
        var t=moment($(this).attr("time"))
        if(t.isValid()){
            $(this).find('.entry-day').text(t.format("MMM DD"))
            $(this).find(".entry-month").text(t.format("YYYY"))
        }
    })
}

var WBUser={}
function CheckWeiboStatus(islogin)
{
    if(WB2.checkLogin()){
        WB2.anyWhere(function(W){
                W.parseCMD("/users/show.json", function(sResult, bStatus){
                    if(bStatus) {
                        try {
                            WBUser.accessToken=WB2.oauthData.access_token
                            $.extend(WBUser,sResult)
                            delete WBUser.status
                            $("#logininfo_plane").html("<img class='h_center' src=\""+sResult.profile_image_url+"\"><div class=\"intro\">"+sResult.screen_name+"</div>")
                            $("#logininfo_plane").attr("type","wb")
                            $("#logininfo_plane").show()
                            $("#loginbn_plane").hide()
                            if($.cookie("wbuid")!=WBUser.idstr){
                                $.post("/login/WBUserInfo",WBUser)
                            }
                        } catch (e) {
                        }
                    }
                },{
                    uid: WB2.oauthData.uid
                },{
                    method: 'get'
                });
            });
    }
    else{
        $.post("/login/WBLogout",{id:WBUser.idstr})
        WBUser={}
        $("#loginbn_plane").show()
        $("#logininfo_plane").hide()
    }
}