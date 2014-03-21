videodrone
==========

Videodrone is something of an interactive online art installation.  Given a keyword, it will produce a wall
of 4 or 9 videos (depending on screen size) from YouTube based on the search term.  It's intended both as an overload of digital stimuli, and a comment on pop culture in a way.

The PostgreSQL / node part of the app is simply storage for stats about what has been entered into the query box , and how many times each query has been entered.

It's implemented in JS, very simply, using v2 of the YouTube API and a bit of jQuery.


