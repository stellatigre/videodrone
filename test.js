#!/usr/local/bin/mocha
var async = require('async');
var assert  = require('assert');
var qs = require('querystring');
var req = require('request');

var baseUrl = "http://stellatigre.com";
var testQuery = "?term=funny+dogs";

describe('GET /db - ', function() {
	// Did our request even work ?
	it('should be 200 with no error', function (done) {
		req.get(baseUrl+'/db', function(error, response, body) {
			assert.equal(200, response.statusCode);  // 200 OK ?
			assert.equal(null, error);
			done();
		});	
	});

	// Let's get all the DB info and verify it has the proper keys
	it('should be valid JSON objects, with keys: querystring, count, id', function(done){
		req(baseUrl+'/db', function(error, response, body) {
			var json = JSON.parse(body);
			assert.ok(json);					//valid JSON ?
			async.forEach(json, function(item) { 
				assert.ok(item.querystring);					// got a querystring?
				assert.ok(item.count);							// plus a count.a
			});
			done();
		});
	});

	// query for "funny dogs" - do we only get the 1 result, relevant to it?
	it('should only return the term requested with the querystring', function(done) {
		req(baseUrl+'/db'+testQuery, function(error, response, body) {
			var json = JSON.parse(body);
			assert.equal(json.length, undefined);
			assert.equal(json.querystring, 'funny dogs');
			done();
		});
	});

	// make sure we get a proper error with a random query	
	it('should give a proper error', function(done) {
		var errorQuery = "?term="+Math.Random;
		req(baseUrl+'/db'+errorQuery, function(error, response, body) {
			assert.equal(body, 'term not found');
			done();
		});
	});
});

describe('POST /db - ', function() {

	var testNum  = 'supertest '+Math.random();
	var testPost = { 'query' : testNum };

	// post a test string , make sure we get success message
	it('should return a success message for new entries', function(done) {
		req.post({
			url  : baseUrl+'/db', 
			json : testPost
		},
		function(error, response, body) {
			var json = JSON.parse(JSON.stringify(body));
			assert.equal(json.success, 'true');  // check our success value
			done();
		});
	});

	// post an invalid value, check for error
	it('should have a error message', function(done) {
		req.post({
			url  : baseUrl+'/db',
			json : {notaquery : 'oh hai'}
		},
		function(error,response, body) {
			var json = JSON.parse(JSON.stringify(body));
			assert.equal(json.error, 'no query value');  // did we get an error ?
			done();
		});
	});
});
