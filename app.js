
/**
 * Module dependencies.
 */

var express = require('express')
  , data = require('./data/tableObj.json')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.pretty = true;
app.use(express.favicon(__dirname + '/public/images/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req,res){ res.render('index') });

app.get('/pascal', function(req,res){ 
  res.render('pascal'); 
});

app.get('/phyllotaxis', function(req,res){ 
  res.render('phyllotaxis'); 
});

// legacy
app.get('/javascripts/phyllotaxis.html', function(req,res){ 
  res.redirect('phyllotaxis'); 
});

app.get('/chart-maker', function(req,res){ 
  res.render('chart_maker', { tableObj: JSON.stringify(data) }); 
});

app.get('/waves', function(req,res){ 
  res.render('waves'); 
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
