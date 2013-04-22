var propertyID;

function hidepropertydivs()
{
    console.log('Hiding divs');
    $("#PanelStatus_div").hide();
    $("#PanelAddress_div").hide();
    $("#PanelSpesifics_div").hide();
    $("#PanelSectional_div").hide();
    $("#PanelNotes_div").hide();
};

$('#formproperty').change(function (e)
{
    var elem = e.target;

    console.log('formproperty changed' + elem);

    // if (elem.id.indexOf('PanelAddress') != -1) {
    var formobj = $('#formproperty').serialize();
    setPageData(formobj);
    //}
});

//<span display="width: 100%; display: block;">
//    <span style="display: inline-block; width: 100px;">Label: </span>
//    <input type="text" name="test" style="width: 340px; float: right;">
//</span>

function navaddress()
{

    hidepropertydivs();
    //console.log('set the file');

    //populateaddresses();
    $("#PanelAddress_div").show();
    //console.log('set the attr');
}

function navspecifics()
{

    hidepropertydivs();
    $("#PanelSpesifics_div").show();
    //var formobj = $('#formproperty').serializeObject();
    // setPageData(formobj);
}

function navsectional()
{
    hidepropertydivs();
    $("#PanelSectional_div").show();
}

function navListProp()
{
    hidepropertydivs();

    console.log('Showing main listing page');
    $("#PanelStatus_div").show();

}

function navnotes()
{
    hidepropertydivs();
    $("#PanelNotes_div").show();
}

this.setPageData = function (data)
{
    console.log('saving formproperty' + propertyID);
    if (data == null || data == '')
        window.localStorage.setItem('formproperty' + propertyID, null);
    window.localStorage.setItem('formproperty' + propertyID, JSON.stringify(data));
}
this.getPageData = function ()
{
    var data = window.localStorage.getItem('formproperty' + propertyID);
    if (data == null || data == '')
        return data;
    return JSON.parse(data);
}

function populateoptiontemplates()
{
    console.log('populate templates');
    if (templates != undefined) {
        templates.getTemplateFields(function (htmlresult)
        {
            console.log('populate template html');

            var pageSelector = "#PanelStatus";

            var $page = $(pageSelector);

            var $formproperty = $("#formproperty");


            console.log(" $formproperty ");

            //console.log($formproperty);

            var len = htmlresult.length;

            console.log("Option fields found = " + len);


            for (var i = 0; i < len; i++) {

                var optionfield = htmlresult[i];

                var $templatefields = $formproperty.find(':input[name$=' + optionfield.optionfield.toLowerCase() + ']').each(function ()
                {
                    console.log("Template Fields: " + $templatefields);
                    var $this = $(this);
                    var elemid = $this.get(0)["id"];

                    var suggestselector = "#" + elemid + "_suggestions"

                    var optfieldsearch = optionfield.optionfield

                    templates.getOptionsByFieldName(optfieldsearch, function (optionnamesresult)
                    {
                        var optlen = optionnamesresult.length;
                        
                        console.log("Found " + optlen + " matches for optionfield:" + optfieldsearch)
                        var templatetagoptions = []; //= optionnamesresult.rows;
                        //var tagobj = optionnamesresult.rows;

                        for (var k = 0; k < optlen; ++k) {
                            var optionfieldname = optionnamesresult[k];
                            //console.log("optionfieldname:" + optionfieldname.optionname);
                            // templatetagoptions += "'" + optionfieldname.optionname + "'"+ ",";
                            //console.log("templatetags: " + templatetagoptions);
                            //for (var i = 0; i < result.rows.length; ++i) {
                            templatetagoptions.push(optionfieldname.optionname);
                            // }
                            //console.log("optionfield: " + optionfield.optionfield + ", values: " + optionfieldname.optionname);
                        }

                        //templatetagoptions += "''";

                        //console.log("templatetags for autocomplete: " + templatetagoptions);

                        $this.autocomplete({
                            target: $(suggestselector),
                            source: templatetagoptions,
                            callback: function (e)
                            {
                                var $a = $(e.currentTarget);
                                $this.val($a.text());
                                $this.autocomplete('clear');
                            },
                            link: 'target.html?term=',
                            minLength: 0
                        });
                        //newelem = $this.htmlresult.append(markup);
                        console.log("enhanced elem: " + elemid + " --- templatetags for autocomplete: " + templatetagoptions);
                    })

                    //

                    // var markup = "<ul data-role='listview' id='" + suggestselector + "' data-inset='true' data-theme='d' data-content-theme='d'></ul>";
                    //   console.log(markup);
                    // var enhancedelem = $this.html() + markup;


                    //console.log("Option field: " + optionfield.optionfield.toLowerCase() + ", Template field : " + elemid);
                    //templates.upDateMatchingElement({elemid,optionfield.optionfield})
                });


            }
        })
    }
};

function setPropertyListingData()
{
    id = propertyID;
    var dynamicformelems = $('#formproperty').serializeObject();
    var commitformvars = getPageData();
    var summarydata = dynamicformelems.PanelAddress_txtStreetno + ' ' + dynamicformelems.PanelAddress_txtStreet + ', ' + dynamicformelems.PanelAddress_txtSuburb + ', ' + dynamicformelems.PanelAddress_txtCity;


    //  console.log('summarydata object:' + summarydata);

    propertylistings.savePropertyChanges({ id: id, summary: summarydata, formvars: commitformvars, status: "In Progress" },
               function ()
               {
                   console.log("data for property commiting to db...");
               }
       );

    //$.mobile.changepage("")
    var propertylist = $("#propcontextlist");
    propertylist.html('<li data-role="list-divider" data-theme="d">Properties</li>');
    propertylist.listview("refresh");
    listPropertiesFromDB("#propcontextlist");
    $("context-left-panel").panel("close");
}

function getPropertyListing()
{
    propertylistings.getEntry(id, function (data)
    {
        console.log('getPropertyListing Entry');
        console.log('listing object:' + data);
        console.log('listing object id:' + data.id);
        console.log('listing object propertyid:' + data.propertyid);
        console.log('listing object status:' + data.status);
        console.log('listing object summary:' + data.summary);

        propertylistingdata = data;

        // var formobj = $('#formproperty').serializeObject()

        //  propertylistingdata.id = propertyID;

        //if (data.status == "Open") {
        //    propertylistingdata.status = "In Progress";
        // }
        //else {
        //     propertylistingdata.status = data.status;
        // }
        //      propertylistingdata.summary = formobj.PanelAddress_txtSuburb + ' - ' + formobj.PanelAddress_txtStreetno + ' ' + formobj.PanelAddress_txtStreet;
        //  propertylistingdata.formvars = getPageData();
        // propertylistingdata.propertyid = propertyID;

        console.log('propertylistingdata object - summary:' + propertylistingdata.summary);
        console.log('propertylistingdata object - summary:' + propertylistingdata.formvars);


    }
    )

}



$("#PanelStatus").on("pageinit", function ()
{
    console.log("editpage init fired");

    listPropertiesFromDB("#propcontextlist");

    function populateaddresses()
    {

        addresses.getProvinceLookups(function (data)
        {
            console.log('populate provinces');
            var s = "";

            var len = data.length;
            for (var i = 0; i < len; i++) {
                var province = data[i];
                $('#PanelAddress_txtProvince').append('<option value="' + province.province + '">' + province.province + '</option>');
                $('#PanelAddress_txtProvince').selectmenu('refresh', true);
            };
        });



    };
    function populatecities(id)
    {

        addresses.getCityLookups(id, function (data)
        {
            console.log('populate City');
            var s = "";

            var len = data.length;

            console.log('current PanelAddress_txtCity options :' + $('#PanelAddress_txtCity option').size());


            $('#PanelAddress_txtCity').html('<option value="select one">Select City</option>');
            $('#PanelAddress_txtCity').selectmenu('refresh', true);

            for (var i = 0; i < len; i++) {
                var province = data[i];

                $('#PanelAddress_txtCity').append('<option value="' + province.city + '">' + province.city + '</option>');
                $('#PanelAddress_txtCity').selectmenu('refresh', true);
            };
        });
    };
    function populatesuburbs(id)
    {

        addresses.getSuburbLookups(id, function (data)
        {
            console.log('populate suburbs');
            var s = "";

            var len = data.length;
            $('#PanelAddress_txtSuburb').html('<option value="select one">Select Suburb</option>');
            $('#PanelAddress_txtSuburb').selectmenu('refresh', true);
            for (var i = 0; i < len; i++) {
                var province = data[i];
                $('#PanelAddress_txtSuburb').append('<option value="' + province.suburb + '">' + province.suburb + '</option>');
                $('#PanelAddress_txtSuburb').selectmenu('refresh', true);
            };
        });
    };

    $("#PanelAddress_txtProvince").on("change", function ()
    {
        //$(".cityList").hide();

        populatecities($(this).val());

        //$("#selectmenu" + $(this).val()).show();
    });
    $("#PanelAddress_txtCity").on("change", function ()
    {
        //$(".cityList").hide();

        populatesuburbs($(this).val());

        //$("#selectmenu" + $(this).val()).show();
    });


    $("#PanelStatus").on("pagebeforeshow", function ()
    {
        console.log("editpage pagebefore fired");

        populateaddresses();
        populateoptiontemplates();

        navListProp();


    });

    $("#PanelStatus").on("pageshow", function ()
    {
        console.log("editpage pageshow fired");





        //$("#PanelStatus_txtoneline").autocomplete({
        //    target: $("#PanelStatus_txtoneline_suggestions"),
        //    source: availableTags,
        //    callback: function (e) {
        //        var $a = $(e.currentTarget);
        //        $('#PanelStatus_txtoneline').val($a.text());
        //        $("#PanelStatus_txtoneline").autocomplete('clear');
        //    },
        //    link: 'target.html?term=',
        //    minLength: 1
        //});

        // populateoptiontemplates();
        // navListProp();
        console.log("propertyID :=" + propertyID);

        if (propertyID != undefined) {
            console.log("getting formproperty for propertyID :=" + propertyID);
            var $form = $("#formproperty");
            var storeddata = getPageData();

            //$form.get(0).reset();

            $form.deserialize(storeddata, function ()
            {
                //alert("form data replaced!");
            });
        }


    });


});
