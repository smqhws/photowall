
/**
 * Module dependencies.
 */

var express = require('express');
//var ctrls = require('./src/controllers')
var user = require('./src/controllers/user')
var http = require('http');
var path = require('path');

var mongoStore = require('connect-mongo')(express)
var connectString = 'mongodb://localhost/photowall'
var mongoose = require('mongoose')
mongoose.connect(connectString)

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/src/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
	secret: 'david_phonewall',
	store: new mongoStore({
		url: connectString,
		collection : 'sessions'
	})
}));
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/user/signup', user.signup)
app.post('/user/create',user.create)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

require('./src/models/user')
var tool = require('./tool')
var User = mongoose.model('User')

new User({
	phone:'',
	email:'ads@adsf.com',
	password:'1234567',
	profile:{
		birthday:'2121'
	}
}).save(function (err,user){
	if(err)
		console.log(err)
	else
		console.log(user)
})

User.findOne({phone:'18500231447'},function (err,doc){
	if(err)
		console.log(err)
	else if(doc){
		doc.password='123321'
		doc.save(function(err,doc){
			if(err)
				console.log(err)
			else{ 
				console.log(doc)
				console.log(doc.authenticate('1111111'))
			}
		})
	}
		
})

