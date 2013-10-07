var pg = require('pg');				// PostgreSQL up in here
var conf = require('../config.json');  // configuration file

// add in our postgres user / pass / host from config file - DB is "videodrone"
var dbString = "postgres://"+conf.psqlUser+":"+conf.psqlPass+"@"+conf.psqlHost+"/videodrone";

var client = new pg.Client(dbString); 
client.connect();				// get the DB connection ready

function isEmptyObject(obj) {
  return !Object.keys(obj).length;		//helper function 
}

function returnHandler(result, response){
	if(result.rows.length === 0) {response.send('term not found');}
	else if(result.rows.length === 1) {response.json(result.rows[0]);} //single result
	else {response.json(result.rows);}
}

function dupeCheck(term) {
	var query = client.query('SELECT DISTINCT querystring FROM query_data WHERE querystring IN values($1)', term);
	query.on('row', function(row, result) {
		result.addRow(row);	
	});
	query.on('end', function(result) { 
		return result.rows;
	});
}

exports.add = function insert_term(req, res) {

	if (req.body.query != null || "") {
			var query = client.query(		// insert to DB
				'INSERT INTO query_data(querystring, count) values($1, $2)', [req.body.query, 1]
			);
			
			query.on('end', function() {
				res.json({'success' : 'true'});			// acknowledge success
			});
	}
	else {		// error for lack of query parameter
		res.json({error : 'no query value'});
	}
}

exports.show = function show(req, res) {
	
	if (!isEmptyObject(req.query) && req.query.term != undefined) {
		var term = req.query.term;
		var query = client.query("SELECT DISTINCT * FROM query_data WHERE querystring=values($1)", term);
	}	
	else {query = client.query("SELECT DISTINCT * FROM query_data WHERE querystring IS NOT NULL");}

	query.on('row', function(row, result) {
		result.addRow(row);				// add row data to results object
	});
	query.on('end', function(result) {
		returnHandler(result, res);			//send back our data in json format
	});
}



