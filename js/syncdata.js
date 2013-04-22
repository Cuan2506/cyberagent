

function getCurrentSetup()
{

    //appsetup();
    //property = new Property();

    //property = new Property();
    //addresses = new Address();
    //templates = new Templates();


    //property.setup(function () {
    //    console.log('property table db setup done');
    //});

    //addresses.setup(function () {
    //    console.log('address table db setup done');
    //});

    //templates.setup(function () {
    //    console.log('templates table db setup done');
    //});
    console.log('current settings: initialised');


}

function displayCounts()
{
    checkaddresscount();
    checktemplatecount();
}

function checkaddresscount()
{
    if (addresses != undefined) {
        addresses.getLookups(function (data)
        {
            console.log('count current addresses');
            var s = "";

            addresscount = data.length;
            $("#locationcount").html(addresscount);
        })
    }
    else {
        $("#locationcount").html("0");
    }
};

function checkaddresscount()
{
    if (addresses != undefined) {
        addresses.getLookups(function (data)
        {
            console.log('count current addresses');
            var s = "";

            addresscount = data.length;
            $("#locationcount").html(addresscount);
        })
    }
    else {
        $("#locationcount").html("0");
    }
};

function checktemplatecount()
{
    if (templates != undefined) {
        templates.getAll(function (data)
        {
            console.log('count current templates');
            var s = "";

            templatecount = data.length;
            $("#templatecount").html(templatecount);
        })
    }
    else {
        $("#templatecount").html("0");
    }
};


function onConfirmationDeleteCallback(button)
{
    if (button == 2) {
        handleresetsettings();
        displayCounts();
        $.mobile.changepage("index.html");
        return false;
    }
}


function ConfirmDeleteDialog()
{
    navigator.notification.confirm(
                    'This will clear all synchronized data',
                    onConfirmationDeleteCallback,
                    'Confirm',
                    'No,Yes'
                );
}


function settingsReady()
{
    console.log("settings deviceReady");
    $('#settingsform').on("submit", ConfirmDialog);
    $('#ResetPanelForm').on("submit", ConfirmDeleteDialog);


    listPropertiesFromDB("#proplistsync");
    //$("#popupDialog").popup({
    //    afterclose: function (event, ui) { }
    //});

    $('#proplistsync').on('click', ' > li', function (e)
    {
        console.log("proplist click");
        e.preventDefault();
        e.stopPropagation();


        var stat = e.target.textContent;
        console.log(stat);

        var anch = $(this).find('a');
        console.log(anch);
       // console.log($('a'));
        //console.log("li id:" + $(this).find('a').get(0)["id"]);
        //var anchid = 0;
        //anchid = $(this).get(0)["id"];

        //console.log(anchid);
        var selected_index = $(this).index();
        console.log("proplist clicked item " + selected_index);
        if (anch.val() != undefined) {
            propertylistings.getEntry(selected_index, function (data)
            {
                var propertydata = data;

                propertylistingdata = propertydata;
                $("#popupDialog").popup("open")
                {

                }
                //for (var i = 0; i < data.length; ++i) {

                //}
            }
            )
        }
        else
        { return false; }
        //
    })
};

//$("#formsubmit1").bind("submit", function () { return false; })

$("#syncPropertySubmit").on("touchstart", function (e)
{
    e.preventDefault();
    var elem = e.target;


    console.log(elem);
    //grab the values
    var postData = propertylistingdata.formvars;
    //   localStorage["formproperty"];
    console.log("Post Data:" + postData);
    $.mobile.loading('show');
    console.log('poststart');

    $.ajax({
        type: 'POST',
        data: postData,
        url: 'http://www.uspdesigns.co.za/iphone/listprop.apl?user=' + currentUser,
        success: function (data)
        {
            console.log(data);
            $.mobile.loading('hide');
            $("#popupDialog").popup("close");
            //$('#lipropertyid1').disable();
            //$("#lipropertyid1").attr("disabled", "disabled");


            //  propertydata.propertyid, propertydata.summary, propertydata.imagecount, propertydata.formvars, propertydata.status, propertydata.lastmod, propertydata.submitteddate, propertydata.imagesuploadeddate
            propertylistings.applyChanges({ id: propertylistingdata.id, propertyid: propertylistingdata.propertyid, summary: propertylistingdata.summary, imagecount: propertylistingdata.imagecount, formvars: propertylistingdata.formvars, status: "Submitted", lastmod: propertylistingdata.lastmod, submitteddate: new Date().getTime(), imagesuploadeddate: new Date().getTime() },
               function ()
               {
                   console.log("data for property submission committed to db...");
               }
       );

            navigator.notification.alert('Your property was successfully added');
            propertylistingdata = null;
            listPropertiesFromDB("#proplistsync");
            $("#popupDialog").popup("close");
            //alert('Your property was successfully added');
        },
        error: function ()
        {
            console.log(data);
            $.mobile.loading('hide');
            //alert('There was an error adding your property');
            $("#popupDialog").popup("close");
            navigator.notification.alert('There was an error adding your property');
            listPropertiesFromDB("#proplistsync");
        }
    });

})

function onConfirmationCallback(button)
{
    if (button == 2) {
        handlesettings();
        handletemplates();
        displayCounts();
        return false;
    }
}


function ConfirmDialog()
{
    navigator.notification.confirm(
                    'This action cannot be undone',
                    onConfirmationCallback,
                    'Confirm',
                    'No,Yes'
                )
}

function handlesettings()
{


    var form = $("#settingsform");

    $.mobile.loading('show');
    console.log("handling settings sync");
    $("#settingsbtn", form).attr("disabled", "disabled");
    console.log('Syncing Now');

    var syncaddressuser = currentUser;
    if (window.sessionStorage["syncaddress"] != undefined && provcitsuburbs != undefined) {
        $.mobile.loading('hide');
        navigator.notification.alert("Already have latest data for addresses", function () { }, "Success");
        $("#settingsbtn").removeAttr("disabled");
    }
    else {
        $.mobile.loading('show', {
            text: "Fetching Data",
            textVisible: true,
            theme: "b",
            textonly: false,
            html: ""
        });
        //if (currentUser.toLowerCase() == "smls10013")
        //    syncaddressuser = "SMLS100w13"

        var serviceurl = serviceURL + 'getProvince.apl?user=' + syncaddressuser;
        console.log("Address sync url=" + serviceurl);
        $.ajax({
            url: serviceurl,
            dataType: "json",
            success: function (data)
            {
                provcitsuburbs = data.Rows;

                console.log(data.Rows.length + "..rows found...");
                console.log("data loaded commiting to db...");

                $.mobile.loading('show', {
                    text: "Saving " + data.Rows.length + " of Address Data",
                    textVisible: true,
                    theme: "b",
                    textonly: false,
                    html: ""
                });
                $("#ProgressPanel").append("<p>Saving Locations data</p>");
                addresses.syncsetup(provcitsuburbs,
                    function ()
                    {
                        window.sessionStorage["syncaddress"] = true;
                        $.mobile.loading('hide');
                        checkaddresscount();
                        $("#ProgressPanel").append("<p>Locations updated with " + provcitsuburbs.length + " records </p>");
                    });

                $("#settingsbtn").removeAttr("disabled");


            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                navigator.notification.alert(
                'Something went wrong with sync', function () { });
                $.mobile.loading('hide');
                $("#ProgressPanel").append("<p>Error updating locations </p>");
                $("#settingsbtn").removeAttr("disabled");
            }

        });
    }
}

function handletemplates()
{


    var form = $("#settingsform");

    $.mobile.loading('show');
    console.log("handling settings sync");
    $("#settingsbtn", form).attr("disabled", "disabled");
    console.log('Syncing Now');


    if (window.sessionStorage["syncoptiontemplates"] != undefined && optiontemplates != undefined) {
        $.mobile.loading('hide');
        navigator.notification.alert("Already have latest data for option templates", function () { }, "Success");
        $("#settingsbtn").removeAttr("disabled");
    }
    else {
        $.mobile.loading('show', {
            text: "Fetching Data",
            textVisible: true,
            theme: "b",
            textonly: false,
            html: ""
        });

        var serviceurl = serviceURL + 'getOptionTemplates.apl?user=' + 'SMLS100w13';
        $.ajax({
            url: serviceurl,
            dataType: "json",
            success: function (data)
            {
                optiontemplates = data.Rows;
                console.log("data loaded commiting to db...");

                $.mobile.loading('show', {
                    text: "Saving Options Data",
                    textVisible: true,
                    theme: "b",
                    textonly: false,
                    html: ""
                });
                $("#ProgressPanel").append("<p>Saving data</p>");
                templates.syncsetup(optiontemplates,
                    function ()
                    {
                        window.sessionStorage["syncoptiontemplates"] = true;
                        // $.mobile.loading('hide');
                        checktemplatecount();
                        $("#ProgressPanel").append("<p>option templates updated with " + optiontemplates.length + " records </p>");
                    });

                $("#settingsbtn").removeAttr("disabled");


            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                navigator.notification.alert(
                'Something went wrong with sync', function () { });
                $.mobile.loading('hide');
                $("#ProgressPanel").append("<p>Error updating option templates </p>");
                $("#settingsbtn").removeAttr("disabled");
            }

        });
    }
}

function handleresetsettings()
{
    var form = $("#ResetPanelForm");

    $.mobile.loading('show');
    console.log("handling Reset");
    $("#resetbtn", form).attr("disabled", "disabled");
    console.log('reset Now');

    window.localStorage["username"] = undefined;
    window.localStorage["password"] = undefined;
    window.localStorage["loggedin"] = undefined;
    currentUser = null;


    $("#ProgressPanel").append("<p>Deleted login data</p>");

    $("#ProgressPanel").append("<p>Deleting address data</p>");
    addresses.reset();
    window.sessionStorage["syncaddress"] = undefined;
    provcitsuburbs = undefined;


    $("#ProgressPanel").append("<p>Deleting picture cache</p>");
    property.reset();


    $("#ProgressPanel").append("<p>Deleting templates data</p>");
    templates.reset();
    window.sessionStorage["syncoptiontemplates"] = undefined;
    optiontemplates = undefined;

    $("#ProgressPanel").append("<p>Deleting property listing data</p>");
    propertylistings.setupsync();

    window.sessionStorage.clear();
    window.localStorage.clear();

    addresses.setup();
    property.setup();
    templates.setup();

    $.mobile.loading('hide');

    listPropertiesFromDB("#proplistsync");

    $("#ProgressPanel").append("<p>Reset all local data</p>");


}

