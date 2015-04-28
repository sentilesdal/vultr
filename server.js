var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.listen(3000);


