var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var Firebase = require('firebase');

var app = express();
//var data = new Firebase('');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));


app.listen(app.get('port'));


