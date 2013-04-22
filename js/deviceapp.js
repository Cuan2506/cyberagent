var startDeviceApp = function () {
  
    console.log("startDeviceApp ");
    appsetup();
    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    mediatype = navigator.camera.MediaType;

    popover = new CameraPopoverOptions(0, 32, 320, 480, Camera.PopoverArrowDirection.ARROW_ANY);

    onCaptureDeviceReady();
};




function onCaptureDeviceReady() {
    $("#PanelPicturePageHome").on("pageinit", function () {

        $("#PanelPicturePageHome").on("pageshow", function (e) {
            console.log('PanelPicturePageHome to launch image gallery page');
            displayGallery();
        });

        console.log("setting up picture capture handler");

        $("#takePicture").on("click", function (e) {
            console.log("taking picture");
            e.preventDefault();
            e.stopPropagation();
            getPhoto(pictureSource.CAMERA, mediatype.PICTURE);
            return false;
        });

        $("#selectPicture").on("click", function (e) {
            console.log("taking picture");
            e.preventDefault();
            e.stopPropagation();
            //                navigator.camera.getPicture(onCamSuccess, onCamFail, {
            //                    quality: 50,
            //                    destinationType: Camera.DestinationType.FILE_URI,
            //                    targetWidth: 640,
            //                    targetHeight: 480,
            //                    source: navigator.camera.PictureSourceType.PHOTOLIBRARY
            //                });

            getPhoto(pictureSource.PHOTOLIBRARY, mediatype.PICTURE);
            return false;
        });


        //        $("#addPictureSubmit").on("touchstart", function (e) {
        //            e.preventDefault();
        //            //grab the values
        //            e.stopPropagation();
        //            $.mobile.loading('show');
        //            var title = "Picture:";
        //            var description = $("#PictureDescription").val();
        //            var img = $("#entryPicture").val();

        //            //  alert(img);
        //            console.log(img);
        //            //if iOS, we need to move the image
        //            if (iOS && img.length > 0) {
        //                var fileName = img.split("/").pop();

        //                console.log("fileName=" + fileName);
        //                //window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

        //                //window.resolveLocalFileSystemURI(fileName, onResolveSuccess, fail);


        //                window.resolveLocalFileSystemURI(img, function (entry) {

        //                    entry.moveTo(imgDir, fileName);

        //                    img = entry.toURL();
        //                    //store!
        //                    property.saveEntry({ title: title, body: description, image: img, propertyid: propertyID }, function () {
        //                        // alert("Saved Photo in ios device");
        //                        console.log("Saved Photo in ios device");
        //                        $.mobile.loading('hide');
        //                        //$.mobile.changePage("#");
        //                        // $("#PanelPictures").popup("close");
        //                        //$.mobile.changePage("#PanelPicturePageHome");
        //                        //$("#PanelPictures").dialog("close");

        //                        // window.history.back();
        //                        displayGallery();
        //                        //pageLoad("pictures.html");
        //                        //return false;
        //                    });
        //                }, function (evt) { // error get file system
        //                    var errormsg;
        //                    switch (evt.target.error.code) {
        //                        case 1:
        //                            errormsg = "Not found"
        //                            break;
        //                        default:
        //                            errormsg = evt.target.error.code;
        //                            break;
        //                    }
        //                    if (evt.target.error.code == 1)
        //                        console.log("File system requestFileSystem error : " + errormsg);
        //                    alert("File system requestFileSystem error : " + errormsg);
        //                    //console.log(evt.target.error.code);
        //                }
        //                //                    , function (evt) {
        //                //                        console.log('fail in resolve');
        //                //                        alert('error: fail in resolve');
        //                //                        $.mobile.loading('hide');
        //                //                        //$("#PanelPictures").popup("close");
        //                //                        //$("#PanelPictures").dialog("close");
        //                //                        //displayGallery();
        //                //                        //$.mobile.changePage("#PanelPicturePageHome")
        //                //                        //$.mobile.changePage("#PanelPicturePageHome");
        //                //                    }
        //                    )
        //            } else {
        //                console.log('save image other device');
        //                //store!
        //                property.saveEntry({ title: title, body: description, image: img, propertyid: propertyID }, function () {
        //                    // alert("Saved Photo in android device");
        //                    $.mobile.loading('hide');
        //                    console.log('trying to launch image list page');
        //                    // $.mobile.changePage("#PanelPicturePageHome");
        //                    // $("#PanelPictures").popup("close");
        //                    // window.history.back();
        //                    displayGallery();

        //                    // $.mobile.changePage("#");
        //                    //pageLoad("pictures.html");
        //                });
        //            }

        //        });


    });
}

function onCamSuccess(imgdata) {
    console.log(imgdata);
    $("#entryPicture").val(imgdata);
    console.log('set the file');
    $("#imgPreview").attr("src", imgdata);
    console.log('set the attr');
}

function onCamFail(message) {
    console.log('camFail' + message);
    //console.dir(message);
    navigator.notification.alert(
                        "Sorry, something went wrong." + message, function () { }, "Oops!");
}

function getPhoto(source, mediatype) {
    // Retrieve image file location from specified source
    console.log("Retrieve image file location from specified source");
    navigator.camera.getPicture(onCamSuccess, onCamFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: source,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: mediatype,
        targetWidth: 640,
        targetHeight: 480,
        popoverOptions: popover,
        saveToPhotoAlbum: true
    });
}
// Called when a photo is successfully retrieved
//
function onPhotoURISuccess(imageURI) {
    // Uncomment to view the image file URI 
    // console.log(imageURI);

    // Get image handle
    //
    var largeImage = document.getElementById('largeImage');
    var smallImage = document.getElementById('smallImage');

    // Unhide image elements
    //
    smallImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    smallImage.src = imageURI;

    // Unhide image elements
    //
    largeImage.style.display = 'block';

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    //
    largeImage.src = imageURI;
}

// Called if something bad happens.
// 
function onFail(message) {
    alert('Failed because: ' + message);
}

