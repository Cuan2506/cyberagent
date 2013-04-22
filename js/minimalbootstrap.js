(function() {
	var device_ready = false;
	var jqm_mobile_init = false;
	var initApp = function() {
		if ((device_ready && jqm_mobile_init) || (jqm_mobile_init && !mobile_system)) {
		    startDeviceApp();
		}

	};
	var onDeviceReady = function() {
		device_ready = true;
		//alert('dev ready');
		console.log('dev ready');
		initApp();
	};
	var onMobileInit = function() {
	    
	        $.support.cors = true;
	        $.mobile.allowCrossDomainPages = true;
	   
		jqm_mobile_init = true;
		//alert('jqm ready');
		console.log('jqm ready');
		initApp();
	};
	$(document).bind('mobileinit', onMobileInit);

	document.addEventListener("deviceready", onDeviceReady, false);

	//$('form').on("submit", function (e) {
	//	var form = $(this).attr('id');
	//	return checkrequireds(e, form);
	//});
})();




//  Camera.DestinationType = {
//        DATA_URL : 0,                // Return image as base64 encoded string
//        FILE_URI : 1                 // Return image file URI
//    };

//    Camera.PictureSourceType = {
//    PHOTOLIBRARY : 0,
//    CAMERA : 1,
//    SAVEDPHOTOALBUM : 2
//};

//Camera.MediaType = { 
//    PICTURE: 0,             // allow selection of still pictures only. DEFAULT. Will return format specified via DestinationType
//    VIDEO: 1,               // allow selection of video only, WILL ALWAYS RETURN FILE_URI
//    ALLMEDIA : 2            // allow selection from all media types
//    }
//    }
    

 //var options = { quality: 50, destinationType: Camera.DestinationType.DATA_URL,sourceType: Camera.PictureSource.SAVEDPHOTOALBUM, popoverOptions : popover };

