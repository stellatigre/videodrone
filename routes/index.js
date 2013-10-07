
// GET home page.
 
exports.index =  function(req, res){
  res.render('index', { title: 'Videodrone'});
};

// in-browser test harness page

exports.testPage = function(req, res){
  res.render('testPage', { title: 'Videodrone Tests'});
};


