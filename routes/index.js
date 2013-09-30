
/*
 * GET home page.
 */


exports.index =  function(req, res){
  res.render('index', { title: 'Express swag'});
};

exports.testPage = function(req, res){
  res.render('testPage', { title: 'Express Tests'});
};
