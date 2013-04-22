function PropertyListing()
{
    that = this;
   // var _self = this;
}

PropertyListing.prototype.setup = function (callback)
{

    //First, setup the database
    console.log('propertyListing db setup and initialised: ');
    this.db = window.openDatabase("propertyListing", 1, "propertyListing", 2000000);
    this.db.transaction(this.initDB, this.dbErrorHandler, callback);

}

PropertyListing.prototype.setupsync = function (callback)
{

    //First, setup the database
    console.log('propertyListing db setup and initialised: ');
    this.db = window.openDatabase("propertyListing", 1, "propertyListing", 2000000);
    this.db.transaction(this.initcleanDB, this.dbErrorHandler, callback);

}

PropertyListing.prototype.reset = function (callback)
{

    //First, setup the database
    console.log('propertyListing db setup and initialised: ');
    this.db = window.openDatabase("propertyListing", 1, "propertyListing", 2000000);
    this.db.transaction(this.resetDB, this.dbErrorHandler, callback);

}

PropertyListing.prototype.resetDB = function (t)
{
    t.executeSql('DROP TABLE IF EXISTS propertyListing');
}


//Geenric database error handler. Won't do anything for now.
PropertyListing.prototype.dbErrorHandler = function (e)
{
    if (e.code == e.DATABASE_ERR)
        console.log('nasty database error');
    console.log('DB Error:' + e.code + " ," + e.message);
    console.dir(e);
    alert('DB Error:' + e.code + " ," + e.message);
}

//I initialize the database structure
PropertyListing.prototype.initcleanDB = function (t)
{
    t.executeSql('DROP TABLE IF EXISTS propertyListing');
    t.executeSql('create table if not exists propertyListing(id INTEGER PRIMARY KEY AUTOINCREMENT,propertyid INTEGER, summary TEXT,jsonform TEXT,imagecount integer,formvars TEXT,status TEXT, lastmod DATE,submitteddate DATE,imagesuploadeddate DATE)');
    console.log('insert into propertyListing executing');
    for (var i = 1; i < 8; i++) {
        t.executeSql('insert into propertyListing(propertyid,status) values (?,?)', [i, 'Open'])
    }
}

PropertyListing.prototype.initDB = function (t)
{

    t.executeSql('create table if not exists propertyListing(id INTEGER PRIMARY KEY AUTOINCREMENT,propertyid INTEGER, summary TEXT, jsonform TEXT,imagecount integer,formvars TEXT,status TEXT, lastmod DATE,submitteddate DATE,imagesuploadeddate DATE)');
    //console.log('insert into propertyListing executing');
    //for (var i = 1; i < 8; i++) {
    //    t.executeSql('insert into propertyListing(propertyid,status) values (?,?)', [i, 'Open'])
    //}
}

PropertyListing.prototype.getAll = function (start, callback)
{
    console.log('Running getEntries');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t)
		{
		    t.executeSql('select id,propertyid, summary,jsonform,IFNULL(imagecount,0),formvars,status, lastmod,submitteddate,imagesuploadeddate from propertyListing order by propertyid asc', [],
				function (t, results)
				{
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

PropertyListing.prototype.getListingbyPropertyid = function (propertyid, callback)
{
    console.log('Running getListingbyPropertyid');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t)
		{
		    t.executeSql('select id,propertyid, summary, imagecount,formvars,status, lastmod,submitteddate,imagesuploadeddate from propertyListing where propertyid = ? order by lastmod desc', [propertyid],
				function (t, results)
				{
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

PropertyListing.prototype.getEntry = function (id, callback)
{

    this.db.transaction(
		function (t)
		{
		    t.executeSql('select id,propertyid, summary,jsonform, imagecount,formvars,status, lastmod,submitteddate,imagesuploadeddate from propertyListing where id = ?', [id],
				function (t, results)
				{
				    callback(that.fixResult(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}


//No support for edits yet
PropertyListing.prototype.saveEntry = function (data, callback)
{
    this.db.transaction(
		function (t)
		{
		    t.executeSql('insert into propertyListing(propertyid, summary, imagecount,formvars,status, lastmod,submitteddate,imagesuploadeddate) values(?,?,?,?,?,?,?,?)', [data.propertyid, data.summary, data.imagecount, data.formvars, data.status, new Date().getTime(), null, null],
			function ()
			{
			    callback();
			}, this.dbErrorHandler);
		}, this.dbErrorHandler);
}

//No support for edits yet
PropertyListing.prototype.applyChanges = function (propertydata,callback)
{
    //PropertyListing.prototype.savePropertyFormVars = function (propertylistingdata, callback) {
    this.db.transaction(
        function (t)
        {
            var sql = "insert or replace into propertyListing ( id,propertyid, summary,jsonform, imagecount,formvars,status, lastmod,submitteddate,imagesuploadeddate) values(?,?,?,?,?,?,?,?,?)";
            var params = [propertydata.id, propertydata.propertyid, propertydata.summary, propertydata.jsonform, propertydata.imagecount, propertydata.formvars, propertydata.status, propertydata.lastmod, propertydata.submitteddate, propertydata.imagesuploadeddate];
            t.executeSql(sql, params);
        }, this.dbErrorHandler, function (t)
        {
            callback();
        });
}

PropertyListing.prototype.savePropertyChanges = function (data, callback)
{

    //PropertyListing.prototype.savePropertyFormVars = function (propertylistingdata, callback) {
    this.db.transaction(
        function (t)
        {
            t.executeSql('insert or replace into propertyListing ( id, propertyid,summary,jsonform, formvars,status, lastmod) values(?,?,?,?,?,?,?)', [data.id, data.id, data.summary,data.jsonform, data.formvars, data.status, new Date().getTime()],
            function ()
            {
                callback();
            }, this.dbErrorHandler);
        }, this.dbErrorHandler);
}

//No support for edits yet
PropertyListing.prototype.saveSubmittedEntry = function (data, callback)
{
    this.db.transaction(
		function (t)
		{
		    t.executeSql('insert or replace into propertyListing set submitteddate = ? ,imagesuploadeddate = ? where propertyid = ?', [new Date().getTime(), new Date().getTime(), data.propertyid],
			function ()
			{
			    callback();
			}, this.dbErrorHandler);
		}, this.dbErrorHandler);
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
PropertyListing.prototype.fixResults = function (res)
{
    var result = [];
    for (var i = 0, len = res.rows.length; i < len; i++) {
        var row = res.rows.item(i);
        result.push(row);
    }
    return result;
}

//I'm a lot like fixResults, but I'm only used in the context of expecting one row, so I return an ob, not an array
PropertyListing.prototype.fixResult = function (res)
{
    if (res.rows.length) {
        return res.rows.item(0);
    } else return {};
}