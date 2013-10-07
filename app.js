// Module dependencies.
var express = require('express');
var routes = require('./routes');			// pages we can serve
var db = require('./routes/db.js');			// Database-related routes, serve JSON
var http = require('http');
var path = require('path');
var config =require('./config.json');		// our config file

var app = express();

// all environments
app.set('port', process.env.PORT || config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}	

app.locals.basedir = '/home/stella/www/videodrone/';

app.get('/', routes.index);			// Videodrone frontend
app.get('/test', routes.testPage);  // testing harness on top of index

app.post('/db', db.add);			// database adding
app.get('/db', db.show);			// database quering


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
