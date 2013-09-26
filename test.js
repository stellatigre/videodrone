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
				assert.ok(item.id);								// and an id ?
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
				
});

	 
