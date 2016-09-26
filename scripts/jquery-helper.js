(function (window) {

    window.setLsMode = function (){ window.LS_MODE = true; }
    window.clearLsMode = function (){ window.LS_MODE = false; }
    window.toggleLsMode = function (){ window.LS_MODE = !window.LS_MODE; }

    window.setLsMode();

})(window);
