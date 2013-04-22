

function appsetup() {
    console.log('appsetup');

    // requestStorage();
    checkRequirements();

    pictureSource = navigator.camera.PictureSourceType;
    destinationType = navigator.camera.DestinationType;
    mediatype = navigator.camera.MediaType;

    popover = new CameraPopoverOptions(0, 32, 320, 480, Camera.PopoverArrowDirection.ARROW_ANY);

    addresses = new Address();
    templates = new Templates();
    property = new Property();
    propertylistings = new PropertyListing();

    property.setup(startedPicturedb);
    addresses.setup(startedAddresses);
    templates.setup(startedTemplates);
    propertylistings.setup(startedPropertylistings);


}

function requestStorage() {
    // Request Quota (only for File System API)

    window.webkitStorageInfo.requestQuota(PERSISTENT, 1024 * 1024, function (grantedBytes) {
        window.webkitRequestFileSystem(PERSISTENT, grantedBytes, checkRequirements, getFileSystem);
    }, function (e) {
        console.log('Error', e);
    });
}

function getFileSystem() {
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) { // success get file system
        var sdcard = fileSystem.root;
        console.log("File system root :" + sdcard.fullPath);
        sdcard.getDirectory('cyberagent', { create: true }, function (cyberagent) {
            //var gallery = $('#gallery');
            //listDir(imgDir, gallery);
        }, function (error) {
            console.log("File system getDirectory error" + error.code);
            alert("File system getDirectory error" + error.code);
        })
    }, function (evt) { // error get file system
        var errormsg;
        switch (evt.target.error.code) {
            case 1:
                errormsg = "Not found"
                break;
            default:
                errormsg = evt.target.error.code;
                break;
        }
        if (evt.target.error.code == 1)
            console.log("File system requestFileSystem error : " + errormsg);
        alert("File system requestFileSystem error : " + errormsg);
        //console.log(evt.target.error.code);
    });
}

function checkRequirements() {
    console.log('Check and bd support');
    if (typeof window.localStorage === 'undefined') {
        console.log('The database is not supported.');
        navigator.notification.alert(
      'Your device does not support the database used by this app.',
      function () { },
      'Error'
    );
        return false;
    }

    console.log('Check and set storage location');
    // window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
    window.appRootDirName = 'cyberagent';
    // Request Quota (only for File System API)

    if (device.platform === "iOS" || mobile_system === "iphone") {
        console.log("Device Type : " + device.platform);
        iOS = true;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, function () {
            navigator.notification.alert(
      'Your device does not support the filesystem used by this app.',
      function () { },
      'Error');
            return false;
        }
    )
    }


    return true;
}

function gotFS(fileSystem) {
    console.log("filepath=" + fileSystem.root.fullPath);
    console.log("applocation=" + window.location.pathname);
    console.log("filesystem got");
    fileSystem.root.getDirectory(window.appRootDirName, {
        create: true,
        exclusive: false
    }, dirReady, fail);
}

function dirReady(entry) {
    window.appRootDir = entry;
    imgDir = window.appRootDir.fullPath;
    console.log("Img Dir : " + imgDir);
    //console.log(JSON.stringify(window.appRootDir));
}


/*
Main application handler. At this point my database is setup and I can start listening for events.
*/

function startedTemplates() {
    console.log("Template db setup");
}

function startedPropertylistings() {
    console.log("propertylistings db setup");
}

function startedAddresses() {
    console.log("Address db setup");
}

function startedPicturedb() {
    console.log('Pic db setup:startApp');
}

function startedPictureSetup() {
    console.log('Pic started');
}

function formatListContent(input) {
    if (!input) return "";
    input = new String(input);
    var res = input;
    return res;
}

function dtFormat(input) {
    if (!input) return "";
    input = new Date(input);
    var res = (input.getMonth() + 1) + "/" + input.getDate() + "/" + input.getFullYear() + " ";
    var hour = input.getHours() + 1;
    var ampm = "AM";
    if (hour === 12) ampm = "PM";
    if (hour > 12) {
        hour -= 12;
        ampm = "PM";
    }
    var minute = input.getMinutes() + 1;
    if (minute < 10) minute = "0" + minute;
    res += hour + ":" + minute + " " + ampm;
    return res;
}


function checkDate(input) {
    var res = "";
    if (!input)
        return res;
    input = new Date(input);
    navigator.globalization.dateToString(
        input, function (date) { res = "Modified: " + date.value; },
        function () { res = ""; }, dtOptions
        );
    return res;
}
