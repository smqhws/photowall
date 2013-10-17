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
require('./src/models/comment')(mongoose,tool)
require('./src/models/tag')(mongoose,tool)
var User = mongoose.model('User')
var Photo = mongoose.model('Photo')
var Comment = mongoose.model('Comment')
var Tag = mongoose.model('Tag')
var photo = require('./src/controllers/photo')(tool, Photo)
var user = require('./src/controllers/user')(tool, User)
var jphoto = require('./src/controllers/jphoto')(tool, Photo)
var jcomment = require('./src/controllers/jcomment')(tool,Comment)
var jtag = require('./src/controllers/jtag')(tool,Tag)
var juser = require('./src/controllers/juser')(tool,User)

var app = express();

tool.upload.configure({
    uploadDir: tool.uploadDir,
    uploadUrl: tool.uploadUri,
    imageVersions: {
        thumbnail: {
            width: 80,
            height: 80
        }
    }
});
tool.upload.on('begin', function(info) {
    info.name = tool.guid() + tool.path.extname(info.name).toLowerCase()
})
tool.upload.on('end', function(info) {

})
tool.upload.on('delete', function(info) {

})
tool.upload.on('error', function(info) {

})


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/src/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(tool.uploadUri, tool.upload.fileHandler());
app.use(express.bodyParser({
    uploadDir: tool.uploadDir
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
require('./config/route')(app, tool, user, photo, jphoto,jcomment,jtag,juser)


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