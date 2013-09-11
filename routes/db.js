
var pg = require('pg');
var db_string = "postgres://postgres:5432@localhost/videodrone";

exports.add = function insert_term(query_term) {
    pg.connect(db_string , function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('INSERT INTO query_data VALUES', (query_term, 1));
    })
}

