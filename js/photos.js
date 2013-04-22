
var images = new Array();

function scale(width, height, padding, border)
{
    var scrWidth = $(window).width() - 30,
        scrHeight = $(window).height() - 30,
        ifrPadding = 2 * padding,
        ifrBorder = 2 * border,
        ifrWidth = width + ifrPadding + ifrBorder,
        ifrHeight = height + ifrPadding + ifrBorder,
        h, w;

    if (ifrWidth < scrWidth && ifrHeight < scrHeight) {
        w = ifrWidth;
        h = ifrHeight;
    } else if ((ifrWidth / scrWidth) > (ifrHeight / scrHeight)) {
        w = scrWidth;
        h = (scrWidth / ifrWidth) * ifrHeight;
    } else {
        h = scrHeight;
        w = (scrHeight / ifrHeight) * ifrWidth;
    }

    return {
        'width': w - (ifrPadding + ifrBorder),
        'height': h - (ifrPadding + ifrBorder)
    };
};

function displayGallery()
{

    console.log("Display gallery started");
    // console.log("Display img dir :" + imgDir);
    // getFileSystem();
    // showImage();
    listPropertyImages();

    // showImage();
}

/* make operations on the file system */


function listPropertyImages()
{

    var gallery = $('#picturegallery');
    console.log("Listing images from db ");
    //listDir(imgDir, gallery);

    listPhotosFromDB(propertyID, gallery);
    //bindimagefunctions(propertyID);
}



/* list on console the content of a directory*/
function listDir(directoryEntry, domParent)
{
    $.mobile.showPageLoadingMsg(); // show loading message

    console.log("File system directoryEntry.createReader started");
    var directoryReader = directoryEntry.createReader();

    directoryReader.readEntries(function (entries)
    { // success get files and folders
        for (var i = 0; i < entries.length; ++i) {
            if (i % 2 == 0) domParent.append('<div class="ui-block-a"><div class="thumbnail"><img src="' + entries[i].fullPath + '" title="' + entries[i].name + '" /></div></div>');
            else domParent.append('<div class="ui-block-b"><div class="thumbnail"><img src="' + entries[i].fullPath + '" title="' + entries[i].name + '" /></div></div>');
            //console.log(entries[i].name);
        }
        $.mobile.hidePageLoadingMsg(); // hide loading message
    }, function (error)
    { // error get files and folders
        alert("error readEntries files and folders - code:" + error.code);
    });
}

function initPics()
{



    $("#PanelPicturePageHome").on("pageinit", function ()
    {

        $("#PanelPicturePageHome").on("pageshow", function (e)
        {
            console.log('PanelPicturePageHome to launch image gallery page');
            displayGallery();
        });


        $("#panelpicturelink").on("vclick", function (e)
        {
            //e.preventDefault();
            //e.stopPropagation();
            $("#entryPicture").html('');
            console.log('set the file');
            $("#imgPreview").attr("src", "");
            console.log('set the attr');
            $("#PictureDescription").val("");
            $("#capturefunctions").show();
            $("#PictureSubmit").show();
            $("#editfunctions").hide();
            $("#picviewheader").html("Add Picture");

            //$("#PanelPictures").popup("open", { positionTo: window })
            //{

            //}

            $("#PanelPictures").popup("open")
            {

            }

        });

        $('#picturegallery').on('vclick', ' > li', function (e)
        {
            console.log("proplist click");
            e.preventDefault();
            e.stopPropagation();

            //var title = $(this).attr('title');
            // $('#PictureDescription').text(title);
            //  $('#PanelPictures').html($(this).clone());

            var imgtmp = $(this).find("img").attr("src");
            var desctemp = $(this).find("h2").text();



            var selected_index = $(this).attr("id");
            console.log("image clicked item " + selected_index);

            console.log(imgtmp);
            $("#entryPicture").val(imgtmp);
            console.log('set the file');
            $("#imgPreview").attr("src", imgtmp);
            console.log('set the attr');
            $("#imgPreview").attr("alt", selected_index);
            $("#PictureDescription").val(desctemp);
            $("#capturefunctions").hide();
            $("#PictureSubmit").hide();
            $("#editfunctions").show();
            $("#picviewheader").html("Edit Picture");

            $("#PanelPictures").popup("open")
            {

            }

        })

        console.log("setting up picture capture handler");

        function onCamSuccess(imgdata)
        {
            console.log(imgdata);
            $("#entryPicture").val(imgdata);
            console.log('set the file');
            $("#imgPreview").attr("src", imgdata);
            console.log('set the attr');
        }

        function onCamFail(e)
        {
            console.log('camFail' + e);
            console.dir(e);
            navigator.notification.alert(
                        "Sorry, something went wrong." + e, function () { }, "Oops!");
        }

        function getPhoto(source, mediatype, savetoalbum)
        {
            // Retrieve image file location from specified source
            console.log("Retrieve image file location from specified source");
            navigator.camera.getPicture(onCamSuccess, onCamFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: source,
                encodingType: Camera.EncodingType.JPEG,
                mediaType: mediatype,
                targetWidth: 640,
                targetHeight: 480,
                popoverOptions: popover,
                saveToPhotoAlbum: savetoalbum
            });
        }

        $("#takePicture").on("touchstart", function (e)
        {
            console.log("taking picture");
            e.preventDefault();
            e.stopPropagation();
            getPhoto(pictureSource.CAMERA, mediatype.PICTURE, true);
            return false;
        });


        $("#deletePicture").on("vclick", function (e)
        {

            $.mobile.loading('show');
            console.log("taking picture");
            e.preventDefault();
            e.stopPropagation();
            var delid = $("#imgPreview").attr("alt");

            property.delEntry(delid, function ()
            {

                console.log("deleted pic entry");
                $.mobile.loading('hide');

                displayGallery();
                $("#PanelPictures").popup("close");
            });


            return false;

        });

        $("#editPicture").on("vclick", function (e)
        {
            e.preventDefault();
            e.stopPropagation();
            $.mobile.loading('show');
            console.log("taking picture");

            var delid = $("#imgPreview").attr("alt");
            var title = "Picture:";
            var description = $("#PictureDescription").val();
            var img = $("#entryPicture").val();

            property.updateEntry({ id: delid, title: title, body: description, image: img, propertyid: propertyID }, function ()
            {

                console.log("updated pic entry");
                $.mobile.loading('hide');

                displayGallery();
                $("#PanelPictures").popup("close");
            });


            return false;
        });



        $("#selectPicture").on("touchstart", function (e)
        {
            console.log("taking picture");
            e.preventDefault();
            e.stopPropagation();
            getPhoto(pictureSource.PHOTOLIBRARY, mediatype.PICTURE, false);
            return false;
        });


        $("#formPictures").on("submit", (function (e)
        {
            e.preventDefault();
            e.stopPropagation();
            //grab the values
            //e.stopPropagation();
            $.mobile.loading('show');
            var title = "Picture:";
            var description = $("#PictureDescription").val();
            var img = $("#entryPicture").val();

            //  alert(img);
            console.log(img);
            //if iOS, we need to move the image
            //temp fix to testimg saving on ios
            iOS = false;

            if (iOS && img.length > 0) {
                var fileName = img.split("/").pop();

                console.log("fileName=" + fileName);
                console.log("img=" + img);
                //window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

                //window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
                //window.resolveLocalFileSystemURI = window.resolveLocalFileSystemURI || window.webkitResolveLocalFileSystemURI;
                //window.resolveLocalFileSystemURI(fileName, onResolveSuccess, fail);

                var tempimgfile = "file:///" + img;
                console.log("localfile img=" + tempimgfile);

                window.resolveLocalFileSystemURI(tempimgfile, function (entry)
                {

                    entry.moveTo(imgDir, fileName);

                    img = entry.toURL();
                    //store!
                    property.saveEntry({ title: title, body: description, image: img, propertyid: propertyID }, function ()
                    {
                        // alert("Saved Photo in ios device");
                        console.log("Saved Photo in ios device");
                        $.mobile.loading('hide');
                        //$.mobile.ge("#");
                        //$("#PanelPictures").popup("close");
                        //$.mobile.changePage("#PanelPicturePageHome");
                        //$("#PanelPictures").dialog("close");

                        // window.history.back();
                        displayGallery();
                        $("#PanelPictures").popup("close");
                        //pageLoad("pictures.html");
                        //return false;
                    });
                }, function (evt)
                { // error get file system
                    var msgText;
                    switch (evt.code) {
                        case FileError.NOT_FOUND_ERR:
                            msgText = "File not found error.";
                            break;
                        case FileError.SECURITY_ERR:
                            msgText = "Security error.";
                            break;
                        case FileError.ABORT_ERR:
                            msgText = "Abort error.";
                            break;
                        case FileError.NOT_READABLE_ERR:
                            msgText = "Not readable error.";
                            break;
                        case FileError.ENCODING_ERR:
                            msgText = "Encoding error.";
                            break;
                        case FileError.NO_MODIFICATION_ALLOWED_ERR:
                            msgText = "No modification allowed.";
                            break;
                        case FileError.INVALID_STATE_ERR:
                            msgText = "Invalid state.";
                            break;
                        case FileError.SYNTAX_ERR:
                            msgText = "Syntax error.";
                            break;
                        case FileError.INVALID_MODIFICATION_ERR:
                            msgText = "Invalid modification.";
                            break;
                        case FileError.QUOTA_EXCEEDED_ERR:
                            msgText = "Quota exceeded.";
                            break;
                        case FileError.TYPE_MISMATCH_ERR:
                            msgText = "Type mismatch.";
                            break;
                        case FileError.PATH_EXISTS_ERR:
                            msgText = "Path exists error.";
                            break;
                        default:
                            msgText = "Unknown error.";
                    }
                    //Now tell the user what happened
                    $.mobile.loading('hide');
                    navigator.notification.alert(msgText, null, "File Error");

                    //    switch (evt.code) {
                    //                    case 1:
                    //                        errormsg = "Not found"
                    //                        break;
                    //                    default:
                    //                        errormsg = evt.target.error.code;
                    //                        break;
                    //                }
                    //                if (evt.target.error.code == 1)
                    //                    console.log("File system requestFileSystem error : " + errormsg);
                    //                alert("File system requestFileSystem error : " + errormsg);
                    //                for (prop in evt.target) {
                    //                    console.log(prop + " = " + evt.target[prop]);
                    //                }
                    //                    errormsg = "Erro Saving Image: " + evt.code;
                    //                    console.log(errormsg)
                    //                    $.mobile.loading('hide');
                    //                    alert(errormsg)
                    //                    //console.log(evt.target.error.code);
                }
                //                    , function (evt) {
                //                        console.log('fail in resolve');
                //                        alert('error: fail in resolve');
                //                        $.mobile.loading('hide');
                //                        //$("#PanelPictures").popup("close");
                //                        //$("#PanelPictures").dialog("close");
                //                        //displayGallery();
                //                        //$.mobile.changePage("#PanelPicturePageHome")
                //                        //$.mobile.changePage("#PanelPicturePageHome");
                //                    }
                    )
            } else {
                console.log('save image other device');
                //store!
                property.saveEntry({ title: title, body: description, image: img, propertyid: propertyID }, function ()
                {
                    // alert("Saved Photo in android device");
                    $.mobile.loading('hide');
                    console.log('trying to launch image list page');
                    // $.mobile.changePage("#PanelPicturePageHome");
                    // $("#PanelPictures").popup("close");
                    // window.history.back();
                    displayGallery();
                    $("#PanelPictures").popup("close");
                    // $.mobile.changePage("#");
                    //pageLoad("pictures.html");
                });
            }
            return false;
        }));
    });

}


function listPhotosFromDB(propertynum, domParent)
{
    console.log('running dblist getPictures');
    $.mobile.showPageLoadingMsg(); // show loading message


    property.getPropertyPics(propertynum, function (data)
    {

        console.log('getPropertyPics');


        $(domParent).empty().listview("refresh");
        for (var i = 0; i < data.length; ++i) {
            var propertypics = data[i];
            var dbimghtml = '<li id="' + propertypics.id + '"><a href="#">' +
                    '<img src="' + propertypics.image + '">' +
                    '<h2>' + propertypics.body + '</h2>' +
            '<p></p> ' +
            '<p class="ui-li-aside">Click</p>' +
       ' </a></li>';
            domParent.append(dbimghtml);
        }

        $(domParent).listview("refresh");
        $.mobile.hidePageLoadingMsg();
    });
}


var gotFileEntry = function (fileEntry)
{
    console.log("got image file entry: " + fileEntry.fullPath);
    fileEntry.file(function (file)
    {
        var reader = new FileReader();
        reader.onloadend = function (evt)
        {
            console.log("Read complete!");
            image64.value = evt.target.result;
        };
        reader.readAsDataURL(file);
    }, failFile);
};

/* show an image */
//function showImage() {
//    console.log('Running showimage');
//    var imgs = $('#picturegallery img');
//    imgs.on('click', function () {
//        var title = $(this).attr('title');
//        $('#PictureDescription').text(title);
//        $('#PanelPictures').html($(this).clone());

//        $("#PanelPictures").popup("open")
//        {

//        }
//        //        $.mobile.changePage($('#picture'));
//    });
//}

function bindimagefunctions(propertynum)
{


}

