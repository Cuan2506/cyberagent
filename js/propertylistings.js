function refreshElem(element) {

    var keepNative = ":jqmData(role='none'), :jqmData(role='nojs')"

    //some of the form elements currently rely on the presence of ui-page and ui-content
    // classes so we'll handle page and content roles outside of the main role processing
    // loop below.
    element.find(":jqmData(role='page'), :jqmData(role='content')").andSelf().each(function () {
        $(this).addClass("ui-" + $(this).jqmData("role"));
    });

    element.find(":jqmData(role='nojs')").addClass("ui-nojs");

    // pre-find data els
    var $dataEls = element.find(":jqmData(role)").andSelf().each(function () {
        var $this = $(this),
        role = $this.jqmData("role"),
        theme = $this.jqmData("theme");

        switch (role) {
            case "collapsible":
            case "fieldcontain":
            case "navbar":
            case "listview":
                $this[role]();
                break;
        }
    });


    var allControls = element.find("input, textarea, select, button");
    var nonNativeControls = allControls.not(keepNative);

    var textInputs = allControls.filter("input[type=text]");
    if (textInputs.length && typeof textInputs[0].autocorrect !== "undefined") {
        textInputs.each(function () {
            // Set the attribute instead of the property just in case there
            // is code that attempts to make modifications via HTML.
            this.setAttribute("autocorrect", "off");
            this.setAttribute("autocomplete", "off");
        });
    }

    // enchance form controls
    nonNativeControls
    .filter("[type='radio'], [type='checkbox']")
    .checkboxradio();

    nonNativeControls
    .filter("button, [type='button'], [type='submit'], [type='reset'], [type='image']")
    .button();

    nonNativeControls
    .filter("input, textarea")
    .not("[type='radio'], [type='checkbox'], [type='button'], [type='submit'], [type='reset'], [type='image'], [type='hidden']")
    .textinput();

    nonNativeControls
    .filter("input, select")
    .filter(":jqmData(role='slider'), :jqmData(type='range')")
    .slider();

    nonNativeControls
    .filter("select:not(:jqmData(role='slider'))")
    .selectmenu();

    //links in bars, or those with  data-role become buttons
    element.find(":jqmData(role='button'), .ui-bar > a, .ui-header > a, .ui-footer > a")
    .not(".ui-btn")
    .not(keepNative)
    .buttonMarkup();

    element
    .find(":jqmData(role='controlgroup')")
    .controlgroup();

    //links within content areas
    element.find("a:not(.ui-btn):not(.ui-link-inherit)")
    .not(keepNative)
    .addClass("ui-link");

}


//                //var alteredoption = $('#formproperty :input[name*="' + optionfield.optionfield + '"]:first');

//                var searchfields1 = $(this).find('div:jqmData(type="search")');

//                var searchfields = $(this).find("input");

//                // $('form:first *:input[type!=hidden]:first').focus();

//                //                var templateoptions = '<div class="listWrap">' +
//                //   '<ul data-role="listview" data-filter="true">' +
//                //     // list items
//                //   '</ul>' +
//                //'</div>';
//                var $formproperty = $("#formproperty");
//                // Get the content area element for the page.
//                $content = $formproperty.children(":jqmData(data-type='search')");

//                //var allControls = element.find("input, textarea, select, button");


//                var elems = $formproperty.find("input[data-type=search]");

//                //elems.each(

//                //    function () {
//                //        // Set the attribute instead of the property just in case there
//                //        // is code that attempts to make modifications via HTML.
//                //        this.setAttribute("autocorrect", "off");
//                //        this.setAttribute("autocomplete", "on");
//                //        // this.hide();
//                //    }
//                //);


//                markup = "<p>" + optionfield + "</p><ul data-role='listview' data-inset='true'>",

//                // The array of items for this category.
//                //cItems = category.items,

//                //    // The number of items in the category.
//                //numItems = cItems.length;

//                //    // Generate a list item for each item in the category
//                //    // and add it to our markup.
//                //    for (var i = 0; i < numItems; i++) {
//                //        markup += "<li>" + cItems[i].name + "</li>";
//                //    }
//                //    markup += "</ul>";

//                //    // Find the h1 element in our header and inject the name of
//                //    // the category into it.
//                //    $header.find("h1").html(category.name);

//                // Inject the category items markup into the content element.
//                //  $content.html(markup);

//                // Pages are lazily enhanced. We call page() on the page
//                // element to make sure it is always enhanced before we
//                // attempt to enhance the listview markup we just injected.
//                // Subsequent calls to page() are ignored since a page/widget
//                // can only be enhanced once.
//                //   $page.page();

//                // Enhance the listview we just injected.
//                //    $content.find(":jqmData(role=listview)").listview();

//                // We don't want the data-url of the page we just modified
//                // to be the url that shows up in the browser's location field,
//                // so set the dataUrl option to the URL for the category
//                // we just loaded.
//                //     options.dataUrl = urlObj.href;

//                // Now call changePage() and tell it to switch to
//                // the page we just modified.
//                //       $.mobile.changePage($page, options);

//                //console.log(optionfield.optionfield + ' - ' + alteredoption.html);


//                //val('Found' + optionfield.optionfield);
//                };
//        });
//    }
//}

// Load the data for a specific category, based on
// the URL passed in. Generate markup for the items in the
// category, inject it into an embedded page, and then make
// that page the current active page.
//function showProperty(urlObj, options) {
//    var propertyid = urlObj.hash.replace(/.*id=/, ""),

//		// Get the object that represents the category we
//		// are interested in. Note, that at this point we could
//		// instead fire off an ajax request to fetch the data, but
//		// for the purposes of this sample, it's already in memory.
//		property = propertyData[categoryName],

//		// The pages we use to display our content are already in
//		// the DOM. The id of the page we are going to write our
//		// content into is specified in the hash before the '?'.
//		pageSelector = urlObj.hash.replace(/\?.*$/, "");

//    if (property) {
//        // Get the page we are going to dump our content into.
//        var $page = $(pageSelector),

//			// Get the header for the page.
//			$header = $page.children(":jqmData(role=header)"),

//			// Get the content area element for the page.
//			$content = $page.children(":jqmData(role=content)"),

//			// The markup we are going to inject into the content
//			// area of the page.
//			markup = "<p>" + category.description + "</p>",

//			// The array of items for this category.
//			cItems = category.items,

//			// The number of items in the category.
//			numItems = cItems.length;

//        // Generate a list item for each item in the category
//        // and add it to our markup.
//        for (var i = 0; i < numItems; i++) {
//            markup += "<li>" + cItems[i].name + "</li>";
//        }
//        markup += "</ul>";

//        // Find the h1 element in our header and inject the name of
//        // the category into it.
//        $header.find("h1").html(category.name);

//        // Inject the category items markup into the content element.
//        $content.html(markup);

//        // Pages are lazily enhanced. We call page() on the page
//        // element to make sure it is always enhanced before we
//        // attempt to enhance the listview markup we just injected.
//        // Subsequent calls to page() are ignored since a page/widget
//        // can only be enhanced once.
//        $page.page();

//        // Enhance the listview we just injected.
//        $content.find(":jqmData(role=listview)").listview();

//        // We don't want the data-url of the page we just modified
//        // to be the url that shows up in the browser's location field,
//        // so set the dataUrl option to the URL for the category
//        // we just loaded.
//        options.dataUrl = urlObj.href;

//        // Now call changePage() and tell it to switch to
//        // the page we just modified.
//        $.mobile.changePage($page, options);
//    }
//}