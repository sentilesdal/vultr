var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var Firebase = require('firebase');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.set('views', path.join(__dirname+'public/views'));
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname,'/public')));
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.get('/submit', function(req,res){
  console.log('app get submit.html');
  res.render(path.join(__dirname,'/public/views/submit.html'));
});


app.listen(app.get('port'));


