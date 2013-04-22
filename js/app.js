var startApp = function ()
{
    //alert('starting app');
    deviceReady();
};

function handleLogin()
{
    var form = $("#loginForm");
    //disable the button so we can't resubmit while we wait
    //alert("handling login");
    $.mobile.loading('show');
    console.log("handling login");
    $("#submitButton", form).attr("disabled", "disabled");
    var u = $("#username", form).val();
    var p = $("#password", form).val();
    if (u != '' && p != '') {
        $.post("http://www.uspdesigns.co.za/iphone/ValidateUser.apl?user=" + u + "&pass=" + p, function (res)
        {
            console.log("Login Result: " + res);
            if (res == true || res == "OK") {
                //store
                currentUser = u;
                window.localStorage["username"] = u;
                window.localStorage["password"] = p;
                window.localStorage["loggedin"] = 'true';
                $.mobile.loading('hide');
                $.mobile.changePage("#home");
                //navhome();
            } else {
                $.mobile.loading('hide');
                window.localStorage["loggedin"] = undefined;
                navigator.notification.alert("Your login failed", function () { });
            }
            $("#submitButton").removeAttr("disabled");
        }, "text");
    } else {
        navigator.notification.alert("You must enter a username and password", function () { });
        $("#submitButton").removeAttr("disabled");
    }
    return false;
}

function checkPreAuth()
{
    console.log("checkPreAuth");
    var form = $("#loginForm");
    if (window.localStorage["username"] != undefined && window.localStorage["password"] != undefined) {
        $("#username", form).val(window.localStorage["username"]);
        $("#password", form).val(window.localStorage["password"]);
        currentUser = window.localStorage["username"];
        handleLogin();
    }
}

function onResolveSuccess(fileEntry)
{
    console.log(fileEntry.name);
}

function fail(evt)
{
    console.log(evt.target.error.code);
}

function checkhomepage()
{
    console.log("checking logged in status");
    if (window.localStorage["loggedin"] != undefined) {
        console.log("logged in - hav to home");
        $.mobile.changePage("#home");

    }
    else {
        console.log("not logged in - hav to loginpage");
        $.mobile.changePage("#loginPage");
    }
}



function listPropertiesFromDB(pagetype)
{
    $.mobile.loading('show');
    console.log('running dblist getProperties');

    var selector = pagetype;
    console.log('running selector:' + selector);
    var propertylist = $(selector);
    var markup = "";
    var origmarkup = '<li data-role="list-divider">Properties</li>'

    switch (pagetype) {
        case ("#proplistsync"):
            origmarkup = '<li data-role="list-divider">Click to Upload</li>'

    }

    propertylist.html(origmarkup);
    propertylist.listview("refresh");

    propertylistings.getAll(function (data)
    {

        console.log('getProperties');
        for (var i = 0; i < data.length; ++i) {
            var property = data[i];


            //var href = '"#PanelStatus?id=' + property.propertyid + '&status="' + property.status + '"';
            var href = '"#PanelStatus?id=' + property.propertyid + '"';
            var anchor = '<a href=' + href + ' data-inline="true">';

            if (pagetype == '#proplistsync') {
                if (property.status != "Submitted") {
                    href = '"#popupDialog" data-rel="popup" data-position-to="window" data-inline="true" data-transition="pop"  id="propertyid' + property.propertyid + '"';
                    anchor = '<a href=' + href + ' data-inline="true">';

                    markup += '<li data-theme="d">' + anchor +
         '<h3><strong> Status: ' + property.status + '</strong></h3>' +
         '<p>' + formatListContent(property.summary) + '</p>' +
         '<p class="ui-li-aside">' + checkDate(property.lastmod) + '</p></a></li>';
                }
                else {

                    markup += '<li data-theme="d">' +
		 '<h3><strong> Status: ' + property.status + '</strong></h3>' +
		 '<p>' + formatListContent(property.summary) + '</p>' +
		 '<p class="ui-li-aside">' + checkDate(property.lastmod) + '</p></a></li>';
                }

            }
            else {


                markup += '<li data-theme="d">' + anchor +
             '<h3><strong> Status: ' + property.status + '</strong></h3>' +
             '<p>' + formatListContent(property.summary) + '</p>' +
             '<p class="ui-li-aside">' + checkDate(property.lastmod) + '</p></a></li>';

            }

        }
        console.log(markup);
        propertylist.append(markup);
        //$('#textitem')
        propertylist.listview("refresh");

    });
    $.mobile.loading('hide');
}




function deviceReady()
{
    //console.log("deviceReady");
    //navigator.splashscreen.hide();
    $("#loginPage").on("pageinit", function ()
    {
        console.log("pageinit run");
        $("#loginForm").on("submit", handleLogin);
        checkPreAuth();
    });

    $("#home").on("pageload", function ()
    {
        console.log("home pageinit run");

        checkhomepage();

        console.log("loading property pages into dom");


    });


    setPreferences();
    registerEvents();

    checkhomepage();

}

function setPreferences()
{
    appsetup();

}


function registerEvents()
{
    console.log('registering device events');

    var self = this;

    $(document).on("click", ".show-page-loading-msg", function ()
    {
        var $this = $(this),
			theme = $this.jqmData("theme") || $.mobile.loader.prototype.options.theme,
			msgText = $this.jqmData("msgtext") || $.mobile.loader.prototype.options.text,
			textVisible = $this.jqmData("textvisible") || $.mobile.loader.prototype.options.textVisible,
			textonly = !!$this.jqmData("textonly");
        html = $this.jqmData("html") || "";
        $.mobile.loading('show', {
            text: msgText,
            textVisible: textVisible,
            theme: theme,
            textonly: textonly,
            html: html
        });
    }).on("click", ".hide-page-loading-msg", function ()
    {
        $.mobile.loading('hide');
    });
}