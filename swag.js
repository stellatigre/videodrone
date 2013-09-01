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

	// no concating strings, just replace dat shizzz after rounding
	var frame_text = iframe_begin.replace("640", Math.floor(iframe_width));
	frame_text = frame_text.replace("360", Math.floor(iframe_height));

	return frame_text;
}

function load_video_json(subject) {
	var sized_frame = size_iframes();
	return $.ajax({
	  url: base_url+subject+'&v=2',
	  dataType: 'json',
	  headers: {'X-GData-Key': 'key='+api_key,
		        'accept:' : 'application/json'	
				},
	  success: function(){
				// video_json is just where i store the response
      			var entries = video_json['responseJSON']['feed']['entry']
			if ($('#chorus').is(':checked')) {
			    var id = get_embeddable_id(entries);
			    for (d=1 ; d < 10 ; d++) {
				var iframe_fin = iframe_end.replace("ID", id);
				// string concatenation to make iframes.  life is short.
		                $('#v'+d.toString()).html(sized_frame+id+iframe_fin);
			    }  
			} else {
				var used_ids = [];
			     	for (d=1 ; d < 10 ; d++) {
					var id = get_embeddable_id(entries);
					// used_ids is for filtering duplicates
					while (used_ids.indexOf(id) != -1) {
						id = get_embeddable_id(entries);
					}
					console.log(id); used_ids.push(id);		
					iframe_fin = iframe_end.replace("ID", id);
					$('#v'+d.toString()).html(sized_frame+id+iframe_fin);
				}	
			}
		}
	});
}

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
		console.log(share_str);
		return share_str;
}

$(document).ready(function() {
 	
    var querystring=window.location.search.substring(1); 
    if (querystring != "") {
   		var parameters = parse_querystring(querystring);
    		console.log("Querystring : "+querystring);
		video_json = load_video_json(parameters[0]);
	
    }

    $('#submit').click(function() {
		//get video data
		var subject = $('#subject').val();
      	video_json = load_video_json(subject);
		
		// This is just for the querystring	
 		var share_link = make_querystring(subject);
		//$('#sharetext').attr('href', share_link);
		//$('#sharetext').text('Copy this to share this drone.');
      }
    );
});
