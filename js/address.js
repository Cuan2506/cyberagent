function Address() {
    var that = this; 
}

Address.prototype.setup = function (callback) {

    //First, setup the database
    console.log('address db setup and initialised: ');
    this.db = window.openDatabase("address", 1, "address", 1000000);
    this.db.transaction(this.initDB, this.dbErrorHandler, callback);

}

Address.prototype.syncsetup = function (provcitsuburbs, callback) {

    //First, setup the database
    console.log('address db initial sync in progress');
    this.db = window.openDatabase("address", 1, "address", 1000000);
    this.db.transaction(this.initSetup, this.dbErrorSync, callback);

}

//Address.prototype.reset = function (callback) {

//    //First, setup the database
//    console.log('address db reset');
//    this.db = window.openDatabase("address", 1, "address", 1000000);
//    this.db.transaction(this.resetDB, this.dbErrorHandler, callback);

//}

//Geenric database error handler. Won't do anything for now.
Address.prototype.dbErrorHandler = function (e) {
    alert('DB Error' + e);
    console.log('DB Error' + e);
    //console.dir(e);
}

Address.prototype.dbErrorSync = function (e) {
    alert('DB Sync Error' + e);
    console.log('DB Error' + e);
    //console.dir(e);
}

//I initialize the database structure
Address.prototype.initDB = function (t) {
    t.executeSql('create table if not exists address(id INTEGER PRIMARY KEY AUTOINCREMENT, province TEXT, city TEXT, suburb TEXT)');
}

Address.prototype.getLookups = function (start, callback) {
    console.log('Running getLookups');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select id, province, city,suburb from address order by province desc', [],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Address.prototype.getProvinceLookups = function (start, callback) {
    console.log('Running getProvinceLookups');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct province from address order by province desc', [],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Address.prototype.getCityLookups = function (province, callback) {
    console.log('Running getCityLookups');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct city from address where province=? order by city asc', [province],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Address.prototype.getSuburbLookups = function (city, callback) {
    console.log('Running getCityLookups');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select distinct suburb from address where city=? order by city asc', [city],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}


Address.prototype.getEntry = function (id, callback) {

    this.db.transaction(
		function (t) {
		    t.executeSql('select id, province, city,suburb from address where id = ?', [id],
				function (t, results) {
				    callback(that.fixResult(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

//No support for edits yet
Address.prototype.saveEntry = function (data, callback) {
    this.db.transaction(
		function (t) {
		    t.executeSql('insert into address(province, city,suburb) values(?,?,?)', [data.province, data.city, data.suburb],
			function () {
			    callback();
			}, this.dbErrorSync);
		}, this.dbErrorSync);
}



Address.prototype.reset = function (callback) {

    //First, setup the database
    console.log('address db reset');
    this.db = window.openDatabase("address", 1, "address", 100000);
    this.db.transaction(this.resetDB, this.dbErrorHandler, callback);

}

Address.prototype.resetDB = function (t) {
    t.executeSql('DROP TABLE IF EXISTS address');
}


// Transaction success callback
//
Address.prototype.validateSuccess = function (res) {
    // this will be empty since no rows were inserted.
    console.log("Insert ID = " + res.insertId);
    // this will be 0 since it is a select statement
    console.log("Rows Affected = " + res.rowAffected);
    // the number of rows returned by the select statement
    console.log("Insert ID = " + res.rows.length);

    res.push(row);
}

//No support for edits yet
Address.prototype.initSetup = function (t) {

    t.executeSql('DROP TABLE IF EXISTS address');
    t.executeSql('create table if not exists address(id INTEGER PRIMARY KEY AUTOINCREMENT, province TEXT, city TEXT, suburb TEXT)');
    $.each(provcitsuburbs, function (i, dataitem) {
        t.executeSql('insert into address(province, city,suburb) values(?,?,?)', [dataitem.province, dataitem.city, dataitem.suburb]);
    });


}

//No support for edits yet
//Address.prototype.initLoadDB = function (provcitsuburbs, callback) {

//    console.log('address db setup reopened for init: ');
//    this.db = window.openDatabase("address", 1, "address", 1000000);
//    console.log('Initialising inserts for Address Table')
//    this.db.transaction(
//		function (t) {
//		    t.executeSql('DROP TABLE IF EXISTS address');
//		    t.executeSql('create table if not exists address(id INTEGER PRIMARY KEY AUTOINCREMENT, province TEXT, city TEXT, suburb TEXT)');
//		    $.each(provcitsuburbs, function (i, dataitem) {
//		        t.executeSql('insert into address(province, city,suburb) values(?,?,?)', [dataitem.province, dataitem.city, dataitem.suburb]);
//		    })
//		}, function (t, results) {
//		    callback(that.validateSuccess(results));
//		}, this.dbErrorSync
//		)

//}

//Utility to convert record sets into array of obs
Address.prototype.fixResults = function (res) {
    var result = [];
    for (var i = 0, len = res.rows.length; i < len; i++) {
        var row = res.rows.item(i);
        result.push(row);
    }
    return result;
}

//I'm a lot like fixResults, but I'm only used in the context of expecting one row, so I return an ob, not an array
Address.prototype.fixResult = function (res) {
    if (res.rows.length) {
        return res.rows.item(0);
    } else return {};
}