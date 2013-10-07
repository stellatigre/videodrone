// Client side of Videodrone
// pieces of Strings, for making requests and filling in iframes.
var api_key = 'AI39si5lXW19Z9VDP8scyfWe-n6myEmOCsOM_I-huxhGS_JVpB582jwulvgu0TotRCCFEZb1WuZBh9zzWd8l7EQ5c5gqkjxfxQ';
var base_url = 'https://gdata.youtube.com/feeds/api/videos?alt=json&paid-content=false&max-results=50&q=';
var iframe_begin = '<iframe width="640" height="360" src="//www.youtube.com/embed/';
var iframe_end = 
'?autoplay=1&vq=small&loop=1&html5=1&rel=0showinfo=0&controls=0&autohide=1&playlist=ID" frameborder="0"></iframe>';
var video_json = '';

function random_int(min, max) {
    return Math.floor((Math.random()*max)+min);
}

// gets the video's ID #
function get_id(entry) {
    return entry['id']['$t'].replace('tag:youtube.com,2008:video:', '');
}

// ensures the video ID we've selected is embeddable
function get_embeddable_id(entries) {
	var r_entry = entries[random_int(0,49)];
	while (r_entry['yt$accessControl'][4]['permission'] == "denied") {
	   r_entry = entries[random_int(0,49)];
	}
	return get_id(r_entry);
}

// how big to make the iframes ? These dimensions preserve 16:9
function size_iframes () {
	var width = window.innerWidth;
	var height= window.innerHeight;		// need at least 200px by 200px players
	if (height < 400 ||  width < 400) {alert("Window is too small for multiple Youtube videos to fit.");}

	if (height > 600) {	var iframeHeight = (height / 3) - 12 ;} 
	else { iframe_height = (height / 2) - 18 ; }	// subtract to make it fit better
	
	if (width >= 1067) {var iframeWidth = (width / 3)-10; } 
	else { iframeWidth = (width / 2)-13 ; }

	// no concating strings, just replace after rounding
	var frameText = iframe_begin.replace("640", Math.floor(iframeWidth));
	frameText = frameText.replace("360", Math.floor(iframeHeight));
	
	return frameText;
}

// div is an int 1-9 - this inserts the iframe HTML
function insert_frame(id, div, sized_frame) {
	var iframe_fin = iframe_end.replace("id", id);			//a playlist of itself (to loop)
	$('#v'+div.toString()).html(sized_frame+id+iframe_fin);	//actually fill our div in
}

function fill_divs(sized_frame){
	// video_json is just where i store the response
	var entries = video_json['responseJSON']['feed']['entry'];
	var used_ids = []; 
					 
	for (div=1 ; div < 10 ; div++) {
		if ($('#harmony').is(':checked')) {		// "Harmony" mode - default
			var id = get_embeddable_id(entries);
			while (used_ids.indexOf(id) != -1) {	//pick feed entries till embeddable
				id = get_embeddable_id(entries);
			}
			used_ids.push(id);						// used for dupe filtering
			insert_frame(id, div, sized_frame);		
		} 			 
		else {									// "Chorus" - have to pick this one,
			id = get_embeddable_id(entries);
			insert_frame(id, div, sized_frame);
		}
	}	
}

function load_video_json(subject) {		// this sends the Youtube API request.
	return $.ajax({						
	  url: base_url+subject+'&v=2',
	  dataType: 'json',
	  headers: {'X-GData-Key': 'key='+api_key,
		    'accept:': 'application/json'	
		   	},
	  success: function() {
			  fill_divs(size_iframes());	// once we get our response data back	
	 		}							// make the iframes
	});
}

function parse_querystring(qs) { 		
    var params = qs.split("&");
	return params;
}

function make_querystring(phrase) {
		if ($('#chorus').is(':checked')) {var mode='&mode=chorus';}
		else {mode = ''};

		var subject_str = encodeURIComponent(phrase);
		subject_str = subject_str.replace(/%20/g, '+');	//regular enocding is ugly
		
		var share_str = window.location.href+'?'+subject_str+mode;
		return share_str;
}

//done with helper functions - what's happening after page is loaded?
$(document).ready(function() {
 	
    var querystring=window.location.search.substring(1); 
    if (querystring != "") {
   		var parameters = parse_querystring(querystring);
		video_json = load_video_json(parameters[0]);    // load videos based on query
    }

    $('#submit').click(function() {		// our onClick event, pulls everything in
		
		var subject = $('#subject').val();		// grab textbox value
      	video_json = load_video_json(subject);		// make API request
		var share_link = make_querystring(subject);		// make share link
		$('#sharetext').attr('href', share_link);	// display our share link
		$('#sharetext').text(share_link);	

		$.post('http://stellatigre.com:4200/db', { 'query' : subject }); // POST to DB 
	});
});
