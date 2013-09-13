/**
 * Module dependencies.
 */
//without dependency
var express = require('express')
var http = require('http')
var mongoStore = require('connect-mongo')(express)
var connectString = 'mongodb://localhost/photowall'
var mongoose = require('mongoose')
mongoose.connect(connectString)
var flash = require('connect-flash')
var tool = require('./tool')



//depend on sth
require('./src/models/photo')(mongoose, tool)
require('./src/models/user')(mongoose, tool)
var User = mongoose.model('User')
var Photo = mongoose.model('Photo')
var photo = require('./src/controllers/photo')(tool, Photo)
var user = require('./src/controllers/user')(tool, User)
var jphoto = require('./src/controllers/jphoto')(tool,Photo)

var app = express();



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/src/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
  uploadDir: tool.path.join(__dirname, '/public/temp')
}));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
  secret: 'david_phonewall',
  store: new mongoStore({
    url: connectString,
    collection: 'sessions'
  })
}));
app.use(tool.passport.initialize());
app.use(tool.passport.session());
app.use(flash())
app.use(app.router);
app.use(require('stylus').middleware(tool.path.join(__dirname, '/public')));
app.use(express.static(tool.path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.param(function(name, fn) {
  if (fn instanceof RegExp) {
    return function(req, res, next, val) {
      var captures
      if (captures = fn.exec(String(val))) {
        req.params[name] = captures
        next()
      } else {
        next('route')
      }
    }
  }
})

require('./config/passport')(tool.passport, User)
require('./config/route')(app, tool, user, photo,jphoto)


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});



// new Photo({
//     title: 'test1',
//     path: '\\',
//     addedBy: '5221925034c0ec8e48000002'
// }).save(function(err, doc) {
//     if (err)
//         console.log(err)
//     else
//         Photo.find({
//             title: 'test1'
//         }).populate('addedBy', 'email').exec(function(err, docs) {
//             if (err)
//                 console.log(err)
//             if (docs.length)
//                 console.log(docs)
//         })
// })
// Photo.findOne({
//     title: 'test1'
// }).populate('addedBy', 'email').exec(function(err, doc) {
//     if (err)
//         console.log(err)
//     if (doc) {
//         doc.save(function(err, doc) {
//             if (err)
//                 console.log(err)
//             if (doc)
//                 console.log(doc)
//         })
//     }
// })

// new User({
//     email: 'ads@adsf.com',
//     password: '1234567',
//     profile: {
//         birthday: '2121'
//     }
// }).save(function(err, user) {
//     if (err)
//         console.log(err)
//     else
//         User.findOne({
//             email: 'ads@adsf.com'
//         }, function(err, doc) {
//             if (err)
//                 console.log(err)
//             else if (doc) {
//                 doc.password = '123321'
//                 doc.save(function(err, doc) {
//                     if (err)
//                         console.log(err)
//                     else {
//                         console.log(doc)
//                         console.log(doc.authenticate('1111111'))
//                     }
//                 })
//             }

//         })
// })