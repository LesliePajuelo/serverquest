var express  = require('express');
var app      = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var routes = require('./routes.js');

app.use(express.static(process.cwd() + '/dist/*'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(methodOverride());

routes(app);

app.listen(8080);
console.log("App listening on port 8080");
