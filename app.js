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
var passport = require('passport')
var flash = require('connect-flash')

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
        collection: 'sessions'
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash())
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}



//////////////////////////////////////////////////
var LocalStrategy = require('passport-local').Strategy
require('./src/models/user')
var tool = require('./tool')
var User = mongoose.model('User')

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, function(email, password, done) {
    User.findOne({
        email: email
    }, function(err, user) {
        if (err) {
            return done(err)
        }
        if (!user) {
            return done(null, false, {
                message: 'This email : ' + email + ' has not be signed up'
            });
        }
        if (!user.authenticate(password)) {
            return done(null, false, {
                message: 'Wrong password'
            })
        } else {
            return done(null, user)
        }
    })
}))
////////////////////////////////////////////////////

app.get('/user/signup', user.signup)
app.post('/user/signup', user.validCreate, user.create)
app.get('/user/login', user.login)
app.post('/user/login',user.validLogin,
    passport.authenticate('local', {
        successRedirect: '/user/test',
        failureRedirect: '/user/login',
        failureFlash: true
    })
)
app.get('/user/logout', user.logout)
app.get('/user/test', tool.isAuthenticated, user.test)

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});



new User({
    email: 'ads@adsf.com',
    password: '1234567',
    profile: {
        birthday: '2121'
    }
}).save(function(err, user) {
    if (err)
        console.log(err)
    else
        console.log(user)
})

User.findOne({
    phone: '18500231447'
}, function(err, doc) {
    if (err)
        console.log(err)
    else if (doc) {
        doc.password = '123321'
        doc.save(function(err, doc) {
            if (err)
                console.log(err)
            else {
                console.log(doc)
                console.log(doc.authenticate('1111111'))
            }
        })
    }

})