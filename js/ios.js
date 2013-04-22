$(document).bind("mobileinit", function () {
    console.log("IOs mobile initialised options");
    //$.mobile.touchOverflowEnabled = false;
    $.mobile.defaultPageTransition = 'none';
    //$.mobile.defaultDialogTransition = 'none';
    //$.mobile.useFastClick = false;
    //$.mobile.buttonMarkup.hoverDelay = 0;
    //$.mobile.page.prototype.options.domCache = false;
    // $.event.special.swipe.scrollSupressionThreshold = 100;
    // $.mobile.phonegapNavigationEnabled = true;

    $.mobile.pushStateEnabled = false;
});