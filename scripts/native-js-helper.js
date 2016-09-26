
/// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
/// http://paulirish.com/2011/requestanimationframe-for-smart-animating/

(function (window) {

    if (!window.requestAnimationFrame) {

        var lastTime = 0;
        var browsers = ['ms', 'moz', 'webkit', 'o'];

        for (var i = 0; i < browsers.length && !window.requestAnimationFrame; i++) {
            window.requestAnimationFrame = window[browsers[i] + 'RequestAnimationFrame'];
            window.cancelRequestAnimationFrame = window[browsers[i] + 'CancelRequestAnimationFrame'];
        }

        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () { callback(currTime + timeToCall); }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }

        if (!window.cancelAnimationFrame) {
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
        }

    }

    window.startAnimation = function (callback) {
        window.requestAnimationFrame(function () {
            startAnimation(callback);
        });

        callback();
    };
    window.cancelAnimation = window.cancelAnimationFrame;

})(window);