function Property() {
	that = this;
}

Property.prototype.setup = function(callback) {

    //First, setup the database
    console.log('property db setup and initialised: ');
	this.db = window.openDatabase("property", 1, "property", 1000000);
	this.db.transaction(this.initDB, this.dbErrorHandler, callback);

}

Property.prototype.reset = function (callback) {

    //First, setup the database
    console.log('property db setup and initialised: ');
    this.db = window.openDatabase("property", 1, "property", 1000000);
    this.db.transaction(this.resetDB, this.dbErrorHandler, callback);

}

Property.prototype.resetDB = function (t) {
    t.executeSql('DROP TABLE IF EXISTS property');
}


//Geenric database error handler. Won't do anything for now.
Property.prototype.dbErrorHandler = function(e) {
	console.log('DB Error');
	console.dir(e);
}

//I initialize the database structure
Property.prototype.initDB = function(t) {
	t.executeSql('create table if not exists property(id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, body TEXT, image TEXT,propertyid INTEGER, published DATE)');
}

Property.prototype.getEntries = function(start,callback) {
	console.log('Running getEntries');
	if(arguments.length === 1) callback = arguments[0];

	this.db.transaction(
		function(t) {
		    t.executeSql('select id, title, body, image,propertyid, published from property order by published desc', [],
				function(t,results) {
					callback(that.fixResults(results));
				},this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Property.prototype.getPropertyPics = function (propertyid, callback) {
    console.log('Running getEntries');
    if (arguments.length === 1) callback = arguments[0];

    this.db.transaction(
		function (t) {
		    t.executeSql('select id, title, body, image,propertyid, published from property where propertyid = ? order by published desc', [propertyid],
				function (t, results) {
				    callback(that.fixResults(results));
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Property.prototype.getEntry = function(id, callback) {

	this.db.transaction(
		function(t) {
			t.executeSql('select id, title, body,propertyid, image, published from property where id = ?', [id],
				function(t, results) {
					callback(that.fixResult(results));
				}, this.dbErrorHandler);
			}, this.dbErrorHandler);

}

Property.prototype.delEntry = function (id, callback) {

    this.db.transaction(
		function (t) {
		    t.executeSql('delete from property where id = ?', [id],
				function (t, results) {
				    callback();
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

Property.prototype.updateEntry = function (data, callback) {

    this.db.transaction(
		function (t) {
		    t.executeSql('insert or replace into property(id,title,body,image,propertyid,published) values(?,?,?,?,?,?)', [data.id,data.title, data.body, data.image, data.propertyid, new Date().getTime()],
				function (t, results) {
				    callback();
				}, this.dbErrorHandler);
		}, this.dbErrorHandler);

}

//No support for edits yet
Property.prototype.saveEntry = function(data, callback) {
	this.db.transaction(
		function(t) {
			t.executeSql('insert into property(title,body,image,propertyid,published) values(?,?,?,?,?)', [data.title, data.body, data.image,data.propertyid, new Date().getTime()],
			function() { 
				callback();
			}, this.dbErrorHandler);
		}, this.dbErrorHandler);
}


Property.prototype.returnJSON = function (res) {
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
Property.prototype.fixResults = function(res) {
	var result = [];
	for(var i=0, len=res.rows.length; i<len; i++) {
		var row = res.rows.item(i);
		result.push(row);
	}
	return result;
}

//I'm a lot like fixResults, but I'm only used in the context of expecting one row, so I return an ob, not an array
Property.prototype.fixResult = function(res) {
	if(res.rows.length) {
		return res.rows.item(0);
	} else return {};
}