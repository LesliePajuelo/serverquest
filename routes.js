// Express routes

module.exports = function(app){

  
  app.get('*', function(req, res){
  res.sendFile(__dirname + '/dist/index.html')
  });
};