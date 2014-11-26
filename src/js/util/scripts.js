define([], function () {

    // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

    // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

    // MIT license
// Updated requestAnimationFrame polyfill that uses new high-resolution timestamp
//
// References:
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// https://gist.github.com/1579671
// http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
//
// Note: this is my initial stab at it, *requires additional testing*

    (function () {
        var lastTime = 0,
            vendors = ['ms', 'moz', 'webkit', 'o'],
        // Feature check for performance (high-resolution timers)
            hasPerformance = !!(window.performance && window.performance.now);

        for (var x = 0, max = vendors.length; x < max && !window.requestAnimationFrame; x += 1) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                        callback(currTime + timeToCall);
                    },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }

        // Add new wrapper for browsers that don't have performance
        if (!hasPerformance) {
            // Store reference to existing rAF and initial startTime
            var rAF = window.requestAnimationFrame,
                startTime = +new Date();

            // Override window rAF to include wrapped callback
            window.requestAnimationFrame = function (callback, element) {
                // Wrap the given callback to pass in performance timestamp
                var wrapped = function (timestamp) {
                    // Get performance-style timestamp
                    var performanceTimestamp = (timestamp < 1e12) ? timestamp : timestamp - startTime;

                    return callback(performanceTimestamp);
                };

                // Call original rAF with wrapped callback
                rAF(wrapped, element);
            };
        }
    })();
    // end of requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel


    // Prevent the backspace key from navigating back.
    // source: http://stackoverflow.com/a/2768256/2618345
    /*(document).unbind('keydown').bind('keydown', function (event) {
        var doPrevent = false;
        if (event.keyCode === 8) {
            var d = event.srcElement || event.target;
            if ((d.tagName.toUpperCase() === 'INPUT' && (d.type.toUpperCase() === 'TEXT' || d.type.toUpperCase() === 'PASSWORD' || d.type.toUpperCase() === 'FILE' || d.type.toUpperCase() === 'EMAIL' || d.type.toUpperCase() === 'URL' || d.type.toUpperCase() === 'NUMBER'))
                || d.tagName.toUpperCase() === 'TEXTAREA') {
                doPrevent = d.readOnly || d.disabled;
            }
            else {
                doPrevent = true;
            }
        }

        if (doPrevent) {
            event.preventDefault();
        }
     });*/


    // performance now polyfill
    // https://gist.github.com/roshambo/4218861
    (function () {

        if (window.performance && window.performance.now) return;

        if (!window.performance) window.performance = {};

        var methods = ['webkitNow', 'msNow', 'mozNow'];

        for (var i = 0; i < methods.length; i++) {
            if (window.performance[methods[i]]) {
                window.performance.now = window.performance[methods[i]];
                return;
            }
        }

        if (Date.now) {
            window.performance.now = function () {
                return Date.now();
            };
            return;
        }

        window.performance.now = function () {
            return +(new Date());
        };

    })();

    // date.now polyfill
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }

    var scripts = {};

    scripts.pickRandomObject = function (parent) {
        var result, count = 0;
        for (var prop in parent)
            if (Math.random() < 1 / ++count)
                result = prop;
        return result;
    };

    return scripts;
});