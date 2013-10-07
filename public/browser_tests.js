var assert =  chai.assert;

function checkQS() {
		assert.equal($('#sharetext').href, window.location+"?funny+pugs");
		assert.equal($('#sharetext').text, window.location+"?funny+pugs");
}

describe('videodrone helper functions', function() {

		it("should size iframes with integers 3-4 digits long", function() {
				var frameText = size_iframes();
				assert.match(frameText, /width=d*/, 'width is specified');
				assert.match(frameText, /height=d*/, 'height is specified');
	
				var results = frameText.match(/[0-9]{3,4}/g);
				assert.ok(results.length === 2, '2 integers with 3-4 digits matched');
				assert.ok(results[0]
		});

		it("should make the querystring correctly", function() {
				$('#subject').val('funny pugs');
				var qs = make_querystring($('#subject').val());		
				assert.equal(window.location+"?funny+pugs", qs);
		});

});

describe('upon making an API request', function() {

		it('should show the querystring', function(){
				$('#submit').click();
				window.setTimeout(checkQS(), 5000);
		});
});
