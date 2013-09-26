var pg = require('pg');				// PostgreSQL up in here
var db_string = "postgres://stella:Qu33rs4$atan@localhost/videodrone";

var client = new pg.Client(db_string); 
client.connect();				// get the DB connection ready

function isEmptyObject(obj) {
  return !Object.keys(obj).length;		//helper function 
}

function returnHandler(result, response){
	if(result.rows.length === 0) {response.send('term not found in database');}
	else if(result.rows.length === 1) {response.json(result.rows[0]);} //single result
	else {response.json(result.rows);}
}

//addAllRows () 

function dupeCheck(term) {
	var query = client.query('SELECT DISTINCT querystring FROM query_data WHERE querystring='+term+';');
	query.on('row', function(row, result) {
		result.addRow(row);	
	});
	console.log(result.rows);
	return result.rows;
}

exports.add = function insert_term(req, res) {

	if (req.body.query != null) {
			//if(!dupeCheck(req.body.query)) {
				var query = client.query(		// insert to DB
				'INSERT INTO query_data(querystring, count) values($1, $2)', [req.body.query, 1]
				);
				console.log(req.body.query);
				query.on('end', function() {
					res.json({'success' : 'true'});			// acknowledge success
				});
	
			//}
	}
	else {		// error for lack of query parameter
		res.send("please POST a 'query' value up in here.\n");
	}
}

exports.show = function show(req, res) {
	var term = '';
	if (!isEmptyObject(req.query) && req.query.term != undefined) {
		console.log(req.query);
		term = "WHERE querystring='"+req.query.term+"'";  // awkward stringification
	}

	//console.log(term);
	var query = client.query("SELECT DISTINCT * FROM query_data "+term+';');  //get all the data in table

	query.on('row', function(row, result) {
		result.addRow(row);				// add row data to results object
	});
	query.on('end', function(result) {
		returnHandler(result, res);			//send back our data in json format
	});
}



