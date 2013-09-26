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
	var r_entry = entries[random_int(0,24)];
	while (r_entry['yt$accessControl'][4]['permission'] == "denied") {
	   r_entry = entries[random_int(0,24)];
	}
	return get_id(r_entry);
}

// how big to make the iframes ?
function size_iframes () {
	var width = $(window).width();
	var height= $(window).height();
	
	if (height > 600) {
		var iframe_height = (height / 3) - 12 ;
    } else {
		iframe_height = (height / 2) - 18 ;
	}
	if (width >= 1067) {
		var iframe_width = (width / 3)-10;
	} else {
		iframe_width = (width / 2)-13 ;
	}

	// no concating strings, just replace after rounding
	var frame_text = iframe_begin.replace("640", Math.floor(iframe_width));
	frame_text = frame_text.replace("360", Math.floor(iframe_height));

	return frame_text;
}

// div is an int 1-9
function insert_frame(id, div, sized_frame) {
	var iframe_fin = iframe_end.replace("id", id);		//a playlist...of itself (to loop)
	$('#v'+div.toString()).html(sized_frame+id+iframe_fin);//actually fill our div in
}

function fill_divs(sized_frame){
	// video_json is just where i store the response
	var entries = video_json['responseJSON']['feed']['entry'];
	var used_ids = []; 
					 
	for (div=1 ; div < 10 ; div++) {
		// "Harmony" - all different videos - default
		if (-($('#chorus').is(':checked'))) {
			var id = get_embeddable_id(entries);
			while (used_ids.indexof(id) != -1) {
				id = get_embeddable_id(entries);
			}
			used_ids.push(id);
			insert_frame(id, div, sized_frame);
		}  // "chorus" - all the same video - only if selected
		else {
			id = get_embeddable_id(entries);
			insert_frame(id, div, sized_frame);
		}
	}	
}

//sends request to the Youtube APi for our videos to pick from
function load_video_json(subject) {
	var frame_text = size_iframes();
	return $.ajax({
	  url: base_url+subject+'&v=2',
	  dataType: 'json',
	  headers: {'X-GData-Key': 'key='+api_key,
		    'accept:': 'application/json'	
		   },
	  success: function() {
			  console.log(video_json);
			  fill_divs(frame_text);	
	  		}
	});
}

// these 2 are for making querystrings
function parse_querystring(qs) {
    var params = qs.split("&");
    console.log(params);
	return params;
}

function make_querystring(phrase) {
		var is_chorus =  $("#chorus").is(":checked")
		if (is_chorus) {var mode='&mode=chorus';}
		else {mode = ''};
		var subject_str = encodeURIComponent(phrase);
		subject_str = subject_str.replace(/%20/g, '+');
		
		var share_str = window.location.href+'?'+subject_str+mode;
		return share_str;
}

//done with helper functions ,
// what's happening after page is loaded?
$(document).ready(function() {
 	
    var querystring=window.location.search.substring(1); 
    if (querystring != "") {
   		var parameters = parse_querystring(querystring);
 		var share_link = make_querystring(parameters[0]);
			$('#sharetext').attr('href', share_link);
			$('#sharetext').text(share_link);
			console.log("Querystring : "+querystring);
			
		video_json = load_video_json(parameters[0]);
    }

    $('#submit').click(function() {
		//get video data
		var subject = $('#subject').val();
      	video_json = load_video_json(subject);
		share_link = make_querystring(subject);
		// This is just for the querystring	
		$('#sharetext').attr('href', share_link);
		$('#sharetext').text(share_link);

		//POST to backend db
		$.post('http://stellatigre.com/db', { 'query' : subject });
      }
    );
});
