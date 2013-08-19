var api_key = 'AI39si5lXW19Z9VDP8scyfWe-n6myEmOCsOM_I-huxhGS_JVpB582jwulvgu0TotRCCFEZb1WuZBh9zzWd8l7EQ5c5gqkjxfxQ';
var base_url = 'https://gdata.youtube.com/feeds/api/videos?alt=json&paid-content=false&max-results=50&q=';
var iframe_begin = '<iframe width="640" height="360" src="//www.youtube.com/embed/';
var iframe_end = '?autoplay=1&vq=small&loop=1&rel=0" frameborder="0" allowfullscreen></iframe>';
var video_json = '';

function random_int(min, max) {
    return Math.floor((Math.random()*max)+min);
}

function get_id(entry) {
    return entry['id']['$t'].replace('tag:youtube.com,2008:video:', '');
}

function get_embeddable_id(entries) {
	var r_entry = entries[random_int(0,24)];
	while (r_entry['yt$accessControl'][4]['permission'] == "denied") {
	   r_entry = entries[random_int(0,24)];
	}
	return get_id(r_entry);
}

function load_video_json() {
	var width = $(window).width();
	var height= $(window).height();
	console.log("width : "+width);
	console.log("height: "+height);
	
	if (height > 600) {
		var iframe_height = height / 3 ;
    } else {
		iframe_height = height / 2;
	}
	if (width >= 1067) {
		var iframe_width = width / 3 ;
	} else {
		iframe_width = width / 2 ;
	}

	// tired of concating strings, just replace dat shizzz
	var sized_frame = iframe_begin.replace("640", iframe_width);
	sized_frame = sized_frame.replace("360", iframe_height);

	var subject  = $('#subject').val();
	return $.ajax({
	  url: base_url+subject+'&v=2',
	  dataType: 'json',
	  headers: {'X-GData-Key': 'key='+api_key,
		    'accept:' : 'application/json'	
		   },
	  success: function(){
      			var entries = video_json['responseJSON']['feed']['entry']
			if ($('#chorus').is(':checked')) {
			    var id = get_embeddable_id(entries);
			    for (d=1 ; d < 10 ; d++) {
		                $('#v'+d.toString()).html(sized_frame+id+iframe_end);
			    }  
			} else {
				var used_ids = [];
			     	for (d=1 ; d < 10 ; d++) {
					var id = get_embeddable_id(entries);
					while (used_ids.indexOf(id) != -1) {
						var id = get_embeddable_id(entries);
					}
					console.log(id); used_ids.push(id);
					$('#v'+d.toString()).html(sized_frame+id+iframe_end);
					}	
				}
			}
		} 
	);
}

function parse_querystring(qs) {
    var params = qs.split("&amp;");
    console.log(params);
}

$(document).ready(function() {

    var querystring=window.location.search.substring(1); 
    console.log(querystring);
    if (querystring != "") {
   		//parse_querystring(querystring);
		console.log("querystring found");
       	$('search').val(querystring);
	load_video_json();
    }

    $('#submit').click(function() {
      video_json = load_video_json();
      }
    );
});
