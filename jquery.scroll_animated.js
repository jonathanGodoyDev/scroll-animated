/*!
 * Scroll Animated v1.0.0
 * Licensed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Copyright (c) 2018
 * @author Jonathan Godoy
 * 
 * @example $("#id-for-animated").scroll_animated({animatedClass: 'fadeIn'});
 * @example scrollAnimated.init([false|true]); **Default parameter is false
 * 
 * @param Object options An object literal containing key/value pairs to provide requireds attributes.
 *               {animatedClass:"class-animated.css" --> key "animatedClass" it is necessary to execute
 *                rerun: false|true --> Parameter on init
 *                animatedDuration: "1.1s"} --> Indicates the duration of the animation
 */
$.fn.extend({
    "scroll_animated" : function(options) {
	"use strict";
        
        var _selector      = $(this),
            _lastScroll    = 0,
            _animatedClass = "",
            _rerun         = false,
            _initImediate  = false;
                
        function isOnScreen(){
            var win = $(window);
            
            var sizeView = {
                top    : win.scrollTop(),
                left   : win.scrollLeft(),
                right  : win.scrollLeft() + win.width(),
                bottom : win.scrollTop()+ win.height()
            };
            
            var limit    = _selector.offset();
            limit.right  = limit.left + _selector.outerWidth();
            limit.bottom = limit.top + _selector.outerHeight();

            return (!(sizeView.right < limit.left || sizeView.left > limit.right || sizeView.bottom < limit.top || sizeView.top > limit.bottom));
        }
        
        function setProperties(){
            //if the value "rerun" is true, always execute when scrolling down
            _rerun = scrollAnimated.getValueBoolean(options, "rerun", false);
            
            //if the key exists and it is true, the animation is executed when the page is loaded
            _initImediate = scrollAnimated.getValueBoolean(options, "initImediate", false);
            
            if (options.hasOwnProperty("animatedDelay") && options["animatedDelay"] !== null){
                var delay = options["animatedDelay"];
                _selector.css({
                    "-webkit-animation-delay": delay, 
                    "animation-delay": delay
                });
            }
            
            //if the key "animatedDuration" does not exist, duration is "1s" animate.css
            if (options.hasOwnProperty("animatedDuration") && options["animatedDuration"] !== null) {
                var duration = options["animatedDuration"];
                _selector.css({
                    "-webkit-animation-duration": duration, 
                    "animation-duration": duration,
                    "-webkit-animation-fill-mode": "both",
                    "animation-fill-mode": "both"
                });
            } else {
                 _selector.addClass("animated");
            }
        }
        
        function onScroll(){
            $(window).scroll( function(){
                var st = $(this).scrollTop();

                if (st > _lastScroll){
                    if (isOnScreen()) {
                        _selector.addClass(_animatedClass);
                    }
                } else if (st < _lastScroll && _rerun) {
                    _selector.removeClass(_animatedClass);
                }

                _lastScroll = st;
            });
        }
        
        function initialize(){
            if (options.hasOwnProperty("animatedClass") && options["animatedClass"] !== null) {
                _animatedClass = options["animatedClass"];
                setProperties();

                if (_initImediate) {
                    _selector.addClass(_animatedClass);
                } else {
                    onScroll();
                }
            }
        }
        
        if ($.isPlainObject(options) && !$.isEmptyObject(options)) {
            initialize();
        }
    }
});


/*
 * @example 
 * <html>
 *  <!-- **import the required libraries ->
 *  <!-- **animate.css ->
 *  <!-- **jquery.js ->
 * <body>
 * <h1 class="scroll-animated" data-scroll-class="fadeInUp" data-scroll-init data-scroll-duration="1.3s">Method 1 to execute the animation</h1>
 * <h2 id="idScroll">Method 1 to execute the animation</h2>
 * <script type="text/javascript">
 *  $(document).ready(function() {
 *      scrollAnimated.init(true); <!-- parameter true always execute when scrolling down  -->
 *  });
 * </script>
 * </body>
 * </html>
 */
var scrollAnimated = new function(){
    "use strict";
    
    function getSelector(selectorClass){
        if (selectorClass.attr("id")) {
            return $("#"+selectorClass.attr("id"));
        } else {
            var newId = "animated_" + Math.floor(Math.random() * 10000) + 1;
            selectorClass.attr("id", newId);
            return $("#"+newId);
        }
    }
    
    function isMobile(){
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    function getAttr(element, name){
        var attr = element.attr(name);
        return (attr !== undefined) ? attr : null;
    }
    
    this.getValueBoolean = function(obj, key, defaultValue){
        return (obj.hasOwnProperty(key) && typeof obj[key] === 'boolean') ? obj[key] : defaultValue;
    };
    
    this.init = function(options){
        if (!scrollAnimated.getValueBoolean(options, "mobile", true) && isMobile()) {
            return;
        }
        
        $(".scroll-animated").each(function(i){
            var _selector = getSelector($(this));           

            //add the scroll animation to the element
            _selector.scroll_animated({
                animatedClass    : getAttr(_selector, "data-scroll-class"),
                rerun            : scrollAnimated.getValueBoolean(options, "rerun", false),
                initImediate     : getAttr(_selector, "data-scroll-init") === "true",
                animatedDuration : getAttr(_selector, "data-scroll-duration"),
                animatedDelay     : getAttr(_selector, "data-scroll-delay")
            });
        });
    };
};
