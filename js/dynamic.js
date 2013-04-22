var propertyID;
var currentIndex = 0;
var propertylistingdata;
var pages = [$('#PanelStatus_div'), $('#PanelAddress_div'), $('#PanelSpesifics_div'), $('#PanelSectional_div'), $('#PanelNotes_div')];
var footernavbar = [$('#navListProp'), $('#navaddress'), $('#navspecifics'), $('#navnotes'),$('#navsectional')];


function scrollRight() {

    console.log('scrollright method - currentIndex' + currentIndex);
    if (currentIndex === 0) return;
    //    pages[currentIndex].removeClass('stage-center');
    //    pages[currentIndex].addClass('stage-right');

    //    pages[currentIndex - 1].removeClass('stage-left');
    //    pages[currentIndex - 1].addClass('stage-center');

    currentIndex = currentIndex - 1;
    //  hidepropertydivs();
    footernavbar[currentIndex].click();
    //  console.log(footernavbar);
}

function scrollLeft() {
    console.log('scrollLeft method - currentIndex' + currentIndex);
    if (currentIndex === pages.length - 1) return;

    //    pages[currentIndex].removeClass('stage-center');
    //    pages[currentIndex].addClass('stage-left');

    //    pages[currentIndex + 1].removeClass('stage-right');
    //    pages[currentIndex + 1].addClass('stage-center');

    //class="ui-btn-active ui-state-persist"

    currentIndex = currentIndex + 1;
    // hidepropertydivs();
    // pages[currentIndex].show();
    footernavbar[currentIndex].click();
    // $("#navaddress").click();
    //console.log(footernavbar);
}




function hidepropertydivs() {
    console.log('Hiding divs');
    $("#PanelStatus_div").hide();
    $("#PanelAddress_div").hide();
    $("#PanelSpesifics_div").hide();
    $("#PanelSectional_div").hide();
    $("#PanelNotes_div").hide();
};

$('#formproperty').change(function (e) {
    var elem = e.target;

    console.log('formproperty changed' + elem);

    //  console.log('formproperty changed ' + elem.nodename);

    //  if (elem.id.indexOf('PanelAddress') != -1) {
    var formchangeobj = $('#formproperty').serialize();
    var formarrayobj = $('#formproperty').serializeObject();
    setPageData(formchangeobj);
    setPropertyListingData();
    savePageData(formarrayobj);
  
});

//<span display="width: 100%; display: block;">
//    <span style="display: inline-block; width: 100px;">Label: </span>
//    <input type="text" name="test" style="width: 340px; float: right;">
//</span>

function navaddress() {
   
    hidepropertydivs();
    //console.log('set the file');

    //populateaddresses();
    //  $("#navaddress").addClass('ui-btn-active ui-state-persist');
    // footernavbar.listview("refresh");
    $("#PanelAddress_div").show();
    currentIndex = 1;
    //console.log('set the attr');
   
}

function navspecifics() {
  
    hidepropertydivs();
    $("#PanelSpesifics_div").show();
    currentIndex = 2;
}

function navsectional()
{
  
    hidepropertydivs();
    $("#PanelSectional_div").show();
    currentIndex = 4;
}

function navListProp()
{
   
    hidepropertydivs();

    console.log('Showing main listing page');
    $("#PanelStatus_div").show();
    currentIndex = 0;
}

function navnotes()
{
   
    hidepropertydivs();
    $("#PanelNotes_div").show();
    currentIndex = 3;
}

this.setPageData = function (data) {
    console.log('saving formproperty' + propertyID);
    if (data == null || data == '')
        window.localStorage.setItem('formproperty' + propertyID, null);
    window.localStorage.setItem('formproperty' + propertyID, JSON.stringify(data));
}

this.savePageData = function (data) {
    console.log('prop db saving formarray' + propertyID);
    if (data == null || data == '')
        return;
    window.localStorage.setItem('formarray' + propertyID, JSON.stringify(data));
}

this.getPageData = function () {
    var data = window.localStorage.getItem('formproperty' + propertyID);
    if (data == null || data == '')
        return data;
    return JSON.parse(data);
}

this.getPageArrayData = function () {
    var data = window.localStorage.getItem('formarray' + propertyID);
    if (data == null || data == '')
        return data;
    return JSON.parse(data);
}

this.getPropertyData = function () {
    if (propertylistings != undefined) {
        propertylistings.getEntry(propertyID, function (data) {
            var propertydata = data;
            console.log('prop db saving formproperty :' + data.jsonform);
            propertylistingdata = propertydata;
            console.log('prop db saving formproperty :' + propertylistingdata.jsonform);
            return JSON.parse(propertylistingdata.jsonform);
        })
    }
}

this.getAddressData = function () {
    var data = propertylistingdata.jsonform;
    if (data == null || data == '')
        return data;
    //var addressdata ={}
    var retvar = JSON.parse(data);
    //console.log(data.toJSON);
    console.log(retvar);
    alert(retvar.PanelAddress_txtStreetno + ' ' + retvar.PanelAddress_txtStreet + ', ' + retvar.PanelAddress_txtSuburb + ', ' + retvar.PanelAddress_txtCity);
    return retvar;
}

function populateoptiontemplates() {
    console.log('populate templates');
    if (templates != undefined) {
        templates.getTemplateFields(function (htmlresult) {
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

                var $templatefields = $formproperty.find(':input[name$=' + optionfield.optionfield.toLowerCase() + ']').each(function () {
                    // console.log("Template Fields: " + $templatefields);
                    var $this = $(this);
                    var elemid = $this.get(0)["id"];

                    var suggestselector = "#" + elemid + "_suggestions"

                    var optfieldsearch = optionfield.optionfield

                    templates.getOptionsByFieldName(optfieldsearch, function (optionnamesresult) {
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
                            callback: function (e) {
                                var $a = $(e.currentTarget);
                                $this.val($a.text());
                                $this.autocomplete('clear');
                            },
                            link: 'target.html?term=',
                            minLength: 0
                        });
                        //newelem = $this.htmlresult.append(markup);
                        console.log("enhanced elem: " + elemid + " - templatetags: " + templatetagoptions);
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

this.setPropertyListingData = function() {
    id = propertyID;
    var dynamicformelems = $('#formproperty').serializeObject();
    var commitformvars = getPageData();
    var summarydata = dynamicformelems.PanelAddress_txtStreetno + ' ' + dynamicformelems.PanelAddress_txtStreet + ', ' + dynamicformelems.PanelAddress_txtSuburb + ', ' + dynamicformelems.PanelAddress_txtCity;


    //  console.log('summarydata object:' + summarydata);

    propertylistings.savePropertyChanges({ id: id, summary: summarydata, jsonform: JSON.stringify(dynamicformelems), formvars: commitformvars, status: "In Progress" },
               function () {
                   console.log("data for property commiting to db...");
               }
       );

  
    var propertylist = $("#propcontextlist");
    propertylist.html('<li data-role="list-divider" data-theme="d">Properties</li>');
    propertylist.listview("refresh");
    listPropertiesFromDB("#propcontextlist");
    $("context-left-panel").panel("close");
}

function getPropertyListing() {
    propertylistings.getEntry(id, function (data) {
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

$("#PanelStatus").on("pageinit", function () {
    console.log("editpage init fired");


    populateaddresses();
    listPropertiesFromDB("#propcontextlist");

    function populateaddresses() {

        $("#PanelAddress_txtProvince").on("change", function () {
            //$(".cityList").hide();

            console.log('PanelAddress_txtProvince change');
            populatecities($(this).val());
            //$("#PanelAddress_txtCity").change();
            //$("#selectmenu" + $(this).val()).show();
        });
        $("#PanelAddress_txtCity").on("change", function () {
            //$(".cityList").hide();
            console.log('PanelAddress_txtCity change');
            populatesuburbs($(this).val());

            //$("#selectmenu" + $(this).val()).show();
        });

        addresses.getProvinceLookups(function (data) {
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
    function populatecities(id) {

        addresses.getCityLookups(id, function (data) {
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
    function populatesuburbs(id) {

        addresses.getSuburbLookups(id, function (data) {
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



    $("#PanelStatus").on("swiperight", function (e) {

        console.log("swiperight fired");
        scrollRight();

    });

    $("#PanelStatus").on("swipeleft", function (e) {

        console.log(e.target);

        console.log("swipeleft fired");
        //$('#PanelStatus').swipeleft(scrollLeft);
        scrollLeft();
        // $('#PanelStatus').swipeRight(scrollRight);

        //    $.mobile.changePage("#PanelPicturePageHome");
    });

    $("#PanelStatus").on("pagebeforeshow", function () {
        console.log("editpage pagebefore fired");
       // var hasaddy = jQuery.hasData($("#PanelAddress_txtSuburb"));
        //      = $("#PanelAddress_txtSuburb").hasData();
        //console.log("editpage hasData " + hasaddy);
        //alert("editpage hasData " + hasaddy);
        // $("div:jqmData(role='page')")
        //  if(
        //if (!hasaddy)
        //   

        populateoptiontemplates();

        navListProp();

        //var activePage = $.mobile.activePage[0].id;

        //alert(activePage);
    });

    $("#PanelStatus").on("pageshow", function () {
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
            //getPropertyData();
            //var $extract = $("div#PanelAddress_div").find('select').each(function () {
            //    var $this = $(this)
            //    console.log($this.html());
            //    console.log("PanelAddress_div form data " + $this.html() + $this.jqmData());
            //})

            console.log("getting formproperty for propertyID :=" + propertyID);
           // alert("pageshow event: getting formproperty for propertyID :=" + propertyID);

            var $form = $("#formproperty");
            var showstoreddata = getPageData();
            var formarr_show = getPageArrayData();
            //getAddressData();

            $form.get(0).reset();
            // alert("pageshow form data reset! -form: " + $form.get(0));

            if (formarr_show) {
                $('#PanelAddress_txtCity').html('');
                $('#PanelAddress_txtCity').selectmenu('refresh', true);
                $('#PanelAddress_txtSuburb').html('');
                $('#PanelAddress_txtSuburb').selectmenu('refresh', true);

                $("#PanelAddress_txtCity").val(formarr_show.PanelAddress_txtCity);
                $('#PanelAddress_txtCity').append('<option value="' + formarr_show.PanelAddress_txtCity + '">' + formarr_show.PanelAddress_txtCity + '</option>');
                $('#PanelAddress_txtCity').selectmenu('refresh', true);
                $("#PanelAddress_txtSuburb").val(formarr_show.PanelAddress_txtSuburb);
                $('#PanelAddress_txtSuburb').append('<option value="' + formarr_show.PanelAddress_txtSuburb + '">' + formarr_show.PanelAddress_txtSuburb + '</option>');
                $('#PanelAddress_txtSuburb').selectmenu('refresh', true);
                alert("pageshow form data - address: " + formarr_show.PanelAddress_txtStreetno + ' ' + formarr_show.PanelAddress_txtStreet + ', ' + formarr_show.PanelAddress_txtSuburb + ', ' + formarr_show.PanelAddress_txtCity);
            }
      
            $form.deserialize(showstoreddata, function () {
               // alert("pageshow event: formproperty deserialize for propertyID :=" + propertyID);
                //alert("form data replaced!");

            });
        }


    });


});
