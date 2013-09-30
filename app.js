
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var db   = require('./routes/db');
var http = require('http');
var path = require('path');
var async = require('async');

var pg = require('pg');

var app = express();

// all environments
app.set('port', process.env.PORT || 4200);
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


app.get('/', routes.index);
app.get('/db/:table/', db.show)
app.post('/db', db.add);
app.get('/db', db.show);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
