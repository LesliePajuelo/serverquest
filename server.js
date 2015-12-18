var express  = require('express');
var app      = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

require('./routes.js')(app)

app.use(express.static(__dirname + '/app/**/**'));
app.use(express.static(__dirname + '/bower_components/jquery/*'));
console.log(__dirname + '/bower_components')
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());


app.listen(8080);
console.log("App listening on port 8080");
