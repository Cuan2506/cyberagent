function Templates() {
    that = this;
}




Templates.prototype.setup = function (callback) {

    //First, setup the database
    console.log('template db setup and initialised: ');
    this.db = window.openDatabase("template", 1, "template", 1000000);
    this.db.transaction(this.initDB, this.dbErrorHandler, callback);

}

Templates.prototype.listTemplateType = function (callback) {
    callback('<ul data-role="listview" data-filter="true" data-filter-reveal="true" data-filter-placeholder="Search..." data-inset="true">');
}

Templates.prototype.syncsetup = function (optiontemplates, callback) {

    //First, setup the database
    //console.log('template db initial sync in progress');
    //this.db = window.openDatabase("template", 1, "template", 2000000);
    this.db.transaction(this.initSetup, this.dbErrorSync, callback);

}

//Templates.prototype.reset = function (callback) {

//    //First, setup the database
//    console.log('template db reset');
//    this.db = window.openDatabase("template", 1, "template", 1000000);
//    this.db.transaction(this.resetDB, this.dbErrorHandler, callback);

//}

//Geenric database error handler. Won't do anything for now.
Templates.prototype.dbErrorHandler = function (e) {
    alert('DB Error' + e);
    console.log('DB Error' + e);
    //console.dir(e);
}

Templates.prototype.dbErrorSync = function (e) {
    alert('DB Sync Error' + e);
    console.log('DB Error' + e);
    //console.dir(e);
}

//I initialize the database structure
Templates.prototype.initDB = function (t) {
    t.executeSql('create table if not exists template(id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, optiontype TEXT, optionfield TEXT,optionname TEXT,matchingelement TEXT)');
}

Templates.prototype.getAll = function (start, callback) {
    console.log('Running getAll');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select id, type,optiontype,optionfield,optionname,matchingelement from template order by type asc ', [],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Templates.prototype.getAllByOptionField = function (criteria, callback) {
    console.log('Running getAllByOptionField');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct type,optiontype,optionname,matchingelement from template where optionfield = ? order by optiontype,optionname asc', [criteria],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Templates.prototype.getOptionsByFieldNameByType = function (criteria, callback) {
    console.log('Running getOptionsByFieldNameByType');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct optionname from template where optionfield = ? and optiontype = ? order by optionname asc', [criteria],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);
}

Templates.prototype.getOptionsByFieldName = function (criteria, callback) {
   // console.log('Running getOptionsByFieldName');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct optionname from template where optionfield = ? and optionname <> "null" and optionfield not in ("Status","Type") order by optionname asc', [criteria],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);
}

Templates.prototype.getOptionsAndFieldNames = function (criteria, callback) {
    console.log('Running getOptionsByFieldNameByType');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct optionfield,optionname from template order by optionname asc', [],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);
}

Templates.prototype.getOptionTypes = function (start, callback) {
    console.log('Running getOptionTypes');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct optiontype from template order by optiontype asc', [],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Templates.prototype.getTemplateFields = function (start, callback) {
    console.log('Running getTemplateFields');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct optionfield from template where type not in ("A","T") order by optionfield asc', [],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Templates.prototype.getMatchingElements = function (start, callback)
{
    console.log('Running getTemplateFields');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t)
		{
		    t.executeSql('select distinct matchingelement from template order by matchingelement asc', [],
				function (t, results)
				{
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Templates.prototype.getTemplateOptions = function (start, callback) {
    console.log('Running getTemplateOptions');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct optionname from template order by optionname asc', [],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}


Templates.prototype.getEntry = function (id, callback) {

    this.db.transaction(
		function (t) {
		    t.executeSql('select id, province, city,suburb from template where id = ?', [id],
				function (t, results) {
				    callback(that.fixResult(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Templates.prototype.upDateMatchingElement = function (data, callback)
{

    this.db.transaction(
		function (t)
		{
		    t.executeSql('update template set matchingelement = ?  where optionfield = ?', [data.elementname,data.optionfield],
				function ()
				{
				    callback();
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

//No support for edits yet
Templates.prototype.saveEntry = function (data, callback) {
    this.db.transaction(
		function (t) {
		    t.executeSql('insert into template(province, city,suburb) values(?,?,?)', [data.province, data.city, data.suburb],
			function () {
			    callback();
			}, this.dbErrorSync);
		}, this.dbErrorSync);
}



Templates.prototype.reset = function (callback) {

    //First, setup the database
    console.log('template db reset: ');
    this.db = window.openDatabase("template", 1, "template", 100000);
    this.db.transaction(this.resetDB, this.dbErrorHandler, callback);

}

Templates.prototype.resetDB = function (t) {
    t.executeSql('DROP TABLE IF EXISTS template');
}



//No support for edits yet
Templates.prototype.initSetup = function (t) {

    t.executeSql('DROP TABLE IF EXISTS template');
    t.executeSql('create table if not exists template(id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, optiontype TEXT, optionfield TEXT,optionname TEXT,matchingelement TEXT)');
    $.each(optiontemplates, function (i, dataitem) {
        t.executeSql('insert into template(type, optiontype,optionfield,optionname,matchingelement) values(?,?,?,?,?)', [dataitem.type, dataitem.optiontype, dataitem.optionfield, dataitem.optionname, null]);
    });


}

Templates.prototype.htmlResults = function (res) {
    var result = [];
    for (var i = 0, len = res.rows.length; i < len; i++) {
        var row = res.rows.item(i);
        formelem = $(':input[name*="' + row + '"]');
        result.push(formelem);
    }
    return result;
}

Templates.prototype.returnJSON = function (res) {
    var result = [];
    for (var i = 0, len = res.rows.length; i < len; i++) {
        if (res.rows.item(i).optionname !== res.rows.item(i + 1).optionname) {
            var row = res.rows.item(i);
            result.push(row);
        }
    }
    return result;
}

//Utility to convert record sets into array of obs
Templates.prototype.fixResults = function (res) {
    var result = [];
    for (var i = 0, len = res.rows.length; i < len; i++) {
        var row = res.rows.item(i);
        result.push(row);
    }
    return result;
}

//I'm a lot like fixResults, but I'm only used in the context of expecting one row, so I return an ob, not an array
Templates.prototype.fixResult = function (res) {
    if (res.rows.length) {
        return res.rows.item(0);
    } else return {};
}