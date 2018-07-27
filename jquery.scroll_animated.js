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
            if (options.hasOwnProperty("rerun") && typeof options["rerun"] === 'boolean') {
                _rerun = options["rerun"];
            }
            
            //if the key exists and it is true, the animation is executed when the page is loaded 
            if (options.hasOwnProperty("initImediate") && typeof options["initImediate"] === 'boolean'){
                _initImediate = options["initImediate"];
            }
            
            //if the key exists and it is true, the animation is executed when the page is loaded 
            if (options.hasOwnProperty("animateDelay")){
                var delay = options["animateDelay"];
                _selector.css({
                    "-webkit-animation-delay": delay, 
                    "animation-delay": delay
                });
            }
            
            //if the key "animatedDuration" does not exist, duration is "1s"
            if (options.hasOwnProperty("animatedDuration")) {
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
            if (options.hasOwnProperty("animatedClass")) {
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
    function getSelector(selectorClass){
        if (selectorClass.attr("id")) {
            return $("#"+selectorClass.attr("id"));
        } else {
            var newId = "animated_"+Math.floor(Math.random() * 1000) + 1;
            selectorClass.attr("id", newId);
            return $("#"+newId);
        }
    }
    
    this.init = function(rerun){
        var _rerun = rerun || false;
        
        $(".scroll-animated").each(function(i){
            var _selector = getSelector($(this));           
            var objOptions = {
                animatedClass : _selector.attr("data-scroll-class"),
                rerun         : _rerun,
                initImediate  : _selector.attr("data-scroll-init") === ""
            };

            if (_selector.attr("data-scroll-duration")) {
                objOptions.animatedDuration = _selector.attr("data-scroll-duration");
            }
            if (_selector.attr("data-scroll-delay")) {
                objOptions.animateDelay = _selector.attr("data-scroll-delay");
            }

            //add the scroll animation to the element
            _selector.scroll_animated(objOptions);
        });
    };
};
