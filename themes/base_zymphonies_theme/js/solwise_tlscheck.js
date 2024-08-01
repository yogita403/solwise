(function() {
    /**
     * Tracks if a TLS check has been performed on this page load
     *
     * @type {boolean}
     * @private
     */
    var _performedCheck = false;

    /**
     * The max supported SSL/TLS info as an array of [protocol, version]
     *
     * @type {array|null}
     * @private
     */
    var _maxTLSSupported;

    /**
     * The name of the cookie that tracks if browser has already been
     * identified as compatible
     *
     * @type {string}
     * @private
     */
    var _TLS_CHECK_COOKIE = 'TLSCheck';

    /**
     * Determines if a check has already been performed
     * (in page view or has previously passed the check)
     *
     * @returns {boolean}
     */
    var hasPerformedCheck = function() {
        return _performedCheck || getCookie(_TLS_CHECK_COOKIE) === 'satisfied';
    };

    /**
     * Extracts max supported SSL/TLS info from howsmyssl api response
     *
     * @param data
     *
     * @returns {boolean}
     */
    var parseTLSInfo = function(data) {
        return data.tls_version.split(' ');
    };

    /**
     * Queries the howsmyssl api for information on browser SSL/TLS capabilities
     *
     * @returns {$.deferred}
     */
    var queryTLSSupport = function(callback) {
        /*return $.ajax({
            url: 'https://www.howsmyssl.com/a/check',
            async: true
        }).done(function(data) {
            _performedCheck = true;
            _maxTLSSupported = parseTLSInfo(data);
        });*/
        /*$.getJSON('https://www.howsmyssl.com/a/check', [], function(data) {
            _performedCheck = true;
            _maxTLSSupported = parseTLSInfo(data);
            callback(data);
        });*/
        window.TLSQueryCallback = function(data) {
            _performedCheck = true;
            _maxTLSSupported = parseTLSInfo(data);
            callback(data);
        };
        (function() {
            var e = document.createElement('script');
            e.type = 'text/javascript';
            e.async = true;
            e.src = 'https://www.howsmyssl.com/a/check?callback=TLSQueryCallback';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(e, s);
        })();
    };

    /**
     * Determines if the browser's TLS support is sufficient for Solwise Secure
     *
     * @param maxTLSSupport
     * @returns {boolean}
     */
    var browserSupportsSolSec = function(maxTLSSupport) {
        return maxTLSSupport[0] === 'TLS' && maxTLSSupport[1] > 1.0;
    };

    /**
     * Handles case when user agent TLS support is insufficient for Solwise Secure
     * In this case, the shopping trolley may not work.
     */
    var handleTLSIncompatibility = function() {
        var warningMessage = 'On 30th June we will be upgrading our server security to disable the older TLS 1.0 encryption protocol (to meet the stringent <abbr title="Payment Card Industry - Data Security Standard">PCI-DSS</abbr> standard).<br>'
            + 'We have detected that the browser you are using does not support the latest security standards and so may not be able to access our shopping trolley system from this date. '
            + 'Please either update your browser or consider using a different browser (such as <a href="https://www.google.com/chrome" target="_blank">Google Chrome</a>, <a href="http://www.opera.com/" target="_blank">Opera</a> or <a href="https://www.mozilla.org/en-GB/firefox/new/" target="_blank">Firefox</a>).';
        MessageBanner.createSuppressible('TLSIncompatiblePrewarn', warningMessage, MessageBanner.TYPES.WARNING, 0, true);
    };

    /**
     * Checks the browser's TLS support is sufficient to access Solwise secure site
     */
    var checkTLSSupport = function() {
        if(!hasPerformedCheck()) {
            /*queryTLSSupport().done(function() {
                if(!browserSupportsSolSec(_maxTLSSupported)) {
                    handleTLSIncompatibility();
                } else {
                    setCookie(_TLS_CHECK_COOKIE, 'satisfied', 30, 0, 0);
                }
            });*/
            queryTLSSupport(function(data) {
                if(!browserSupportsSolSec(_maxTLSSupported)) {
                    handleTLSIncompatibility();
                } else {
                    setCookie(_TLS_CHECK_COOKIE, 'satisfied', 30, 0, 0);
                }
            });
        }
    };

    checkTLSSupport();
})();



window.MessageBanner = (function() {
    var TYPES = {
        'SUCCESS': 'success',
        'WARNING': 'warning'
    };
    var TYPE_CLASS = {
        'success': 'message_banner--success',
        'warning': 'message_banner--warning'
    };
    var _loaded = false;
    var _visible = false;
    var _banner;
    var _bannerMessage;
    var _bannerClose;
    var _nextHandlerId = 100;
    var _onBannerClose = {};


    var _load = function() {
        if(!_loaded) {
            var banner = _buildBanner();
            banner.hide();
            _visible = false;
            banner.prependTo('body');
            _loaded = true;
        }
    };

    var _buildBanner = function() {
        if(_banner) {
            return _banner;
        }
        _banner = $('<div id="message_banner" />');
        _bannerMessage = $('<div class="wrapper full" />');
        _banner.append(_bannerMessage);
        _bannerClose = $('<div class="message_banner__close">&times;</div>');
        _bannerClose.click(_handleBannerClose);
        _banner.append(_bannerClose);
        return _banner;
    };

    var _registerBannerCloseHandler = function(handler) {
        var handleId = _nextHandlerId++;
        _onBannerClose[handleId] = handler;
        return handleId;
    };

    var _handleBannerClose = function() {
        hideBanner();
        for(var id in _onBannerClose) {
            _onBannerClose[id]();
        }
        /*_onBannerClose.forEach(function(handler, i) {
            console.log(i, handler);
            handler();
        });*/
    };

    var _getBanner = function() {
        if(_banner) {
            return _banner;
        }
        return _buildBanner();
    };

    var _getBannerMessage = function() {
        _buildBanner();
        return _bannerMessage;
    };

    var _setBannerVisibility = function(newVisibility) {
        newVisibility = !!newVisibility;
        if(newVisibility === _visible) {
            //return;
        }
        var fade;
        if(newVisibility) {
            fade = _getBanner().fadeIn().promise();
        } else {
            fade = _getBanner().fadeOut().promise();
        }
        fade.done(function() {_visible = newVisibility;});
        return fade;
    };

    var showBanner = function() {
        return _setBannerVisibility(true);
    };

    var hideBanner = function() {
        return _setBannerVisibility(false);
    };

    var toggleBanner = function() {
        return _setBannerVisibility(!_visible);
    };

    var setMessage = function(message, asHTML) {
        asHTML = asHTML || false;
        var bannerMessage = _getBannerMessage();

        if(asHTML) {
            bannerMessage.html(message);
        } else {
            bannerMessage.text(message);
        }
    };

    var setType = function(bannerType) {
        bannerType = bannerType || 'success';
        var bannerClass = TYPE_CLASS[bannerType] || TYPE_CLASS.SUCCESS;

        var banner = _getBanner();
        banner.removeClass();
        banner.addClass(bannerClass);
    };

    var createBanner = function(message, type, duration, asHTML) {
        duration = duration || 0;
        asHTML = !!asHTML;
        hideBanner().done(function() {
            var banner = _getBanner();
            setMessage(message, asHTML);
            setType(type);
            showBanner();
            if(duration > 0) {
                setTimeout(function() {
                    hideBanner();
                }, duration);
            }
        });
    };

    var createSuppressibleBanner = function(bannerId, message, type, duration, asHTML) {
        var bannerCookie = getCookie('banner_' + bannerId);

        if(bannerCookie !== 'suppress') {
            _registerBannerCloseHandler(function() {
                setCookie('banner_' + bannerId, 'suppress', 1, 0, 0);
            });
            createBanner(message, type, duration, asHTML);
        }
    };

    _load();

    return {
        TYPES: TYPES,
        create: createBanner,
        createSuppressible: createSuppressibleBanner,
        show: showBanner,
        hide: hideBanner,
        toggle: toggleBanner,
        setMessage: setMessage,
        setType: setType
    };
})();