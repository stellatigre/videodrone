#!/usr/local/bin/mocha

var Browser = require('zombie');
var assert  = require('assert');

// This script contains the tests related to simple DOM checks.

var baseUrl = "http://stellatigre.com:4200";

var br = new Browser();
		
describe('DOM checks - ', function() {
	
	before(function(done) {
		this.timeout(5000);				// make sure we wait 5 seconds
		this.browser = new Browser();
		this.browser
			.visit(baseUrl)
			.then(done, done);
	});		

	it('should be served at the root path', function() {
		assert.equal(this.browser.location.pathname, "/"); 
	});

	it('should have a "subject" text input', function() {
		assert.ok(this.browser.field('#subject'));
	});

	it('should have 2 radio buttons, "harmony" and "chorus"', function() {
		assert.ok(this.browser.button('#chorus'));
		assert.ok(this.browser.button('#harmony'));
	});

	it('should have a "submit" input', function() {	
		assert.ok(this.browser.query('#submit'));
	});

	it('should have a "sharetext" div', function() {	
		assert.ok(this.browser.query('#sharetext'));
	});

	it('vid-container should have 9 blank divs for videos in it', function() {	
		assert.ok(this.browser.query('#vid-container'));
		var vids = this.browser.queryAll('.videos');
		assert.equal(vids.length, 9);
	});

});

