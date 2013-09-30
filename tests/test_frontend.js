#!/usr/local/bin/mocha

var Browser = require('zombie');
var async = require('async');
var assert  = require('assert');
var qs = require('querystring');
var req = require('request');
//var gv = require('../public/getvideos.js');


// This script contains the tests related to the database REST API.

var baseUrl = "http://stellatigre.com:4200";
var testQuery = "?term=funny+dogs";

var br = new Browser();
		
describe('get_id', function() {
		it('should work', function(done) {

			br.visit(baseUrl).then( function() {
				assert.equal(br.text, "hotdogs");
				done();
			});
		});
});

