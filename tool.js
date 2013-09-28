var Imager = require('imager')
var imagerConfig = require('./config/imager.js')
var imager = new Imager(imagerConfig, 'uploadDirectory') // or 'S3' for amazon
var _ = require('underscore')
var sizeOf = require('image-size')
var Thumbbot = require("thumbbot")
var check = require('./validator').check
var fs = require('fs')
var path = require('path')
var passport = require('passport')
var OtherError = require('./error').OtherError
var upload = require('jquery-file-upload-middleware')
var uploadDir = path.join(__dirname,'/public/uploads')
var tool = module.exports = {
    _: _,
    sizeOf: sizeOf,
    Thumbbot: Thumbbot,
    check: check,
    fs: fs,
    path: path,
    passport: passport,
    OtherError: OtherError,
    imager: imager,
    defaultPageSize: 16,
    upload: upload,
    uploadDir:uploadDir,
    uploadUri:'/uploads',

    email: /^[a-z0-9A-Z_]+@[a-z0-9A-Z]+(\.[a-z0-9A-Z]+)+$/,
    phone: /^\d{11}$/,
    password: /^[a-z0-9A-Z_]{6,12}$/,
    date: /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/,

    guid: function() {
        function G() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
        }

        var guid = (G() + G() + "-" + G() + "-" + G() + "-" +
            G() + "-" + G() + G() + G()).toLowerCase();

        return guid
    },
    is: function(str, reg) {
        if (!str || !str.length)
            return false
        if (reg)
            return str.match(reg)
        return true;
    },
    len: function(str, min, max) {
        if (!str || typeof(min) != 'number' || !str.length || str.length < min)
            return false
        if (typeof(max) == 'number')
            return str.length < max
        return true
    },
    isUnique: function(self, key, val, Model, cb) {
        if (!self.isNew && !self.isModified(key))
            return cb(true)
        obj = {}
        obj[key] = val;
        Model.find(obj, function(err, docs) {
            cb(!err && docs.length === 0)
        })
    },
    isAuthenticated: function(req, res, next) {
        if (req.isAuthenticated())
            next()
        else {
            req.flash('error', 'Must log in')
            res.redirect('/login')
        }
    },
    getErrMsg: function(err) {
        if (!err)
            return []
        var emsg = []
        if (err.errors) {
            var errs = err.errors
            for (var e in errs) {
                emsg[emsg.length] = errs[e].type
            }
        } else if (err.message)
            emsg[emsg.length] = err.message
        return emsg
    },
    getListOpt: function(req, opt) {
        var pageIndex = (req.param('pageIndex') > 0 ? req.param('pageIndex') : 1) - 1
        var pageSize = req.param('pageSize') || this.defaultPageSize
        var obj = {
            pageIndex: pageIndex,
            pageSize: pageSize
        }
        _.extend(obj, opt)
        return obj
    },
    list: function(Model, obj, title, rend, cb) {
        Model.list(obj, function(err, docs) {
            if (err) return cb(err)
            Model.count().exec(function(err, count) {
                if (err) return cb(err)
                var rend = rend || {}
                _.extend(rend, {
                    title: title,
                    objs: docs,
                    pageIndex: obj.pageIndex + 1,
                    pageSize: obj.pageSize,
                    pageCount: Math.ceil(count / obj.pageSize)
                })
                cb(null, rend)
            })
        })
    },
    load: function(req, res, next, id, Model, redirect) {
        Model.load(id, function(err, doc) {
            if (err) {
                console.log(err)
                req.flash('error', tool.getErrMsg(err))
                res.redirect(redirect)
            } else {
                req.obj = doc
                next()
            }
        })
    },
    render: function(req, res, page, obj) {
        obj.error = req.flash('error')
        res.render(page, obj)
    },
    getUri: function(self, key) {
        var p = JSON.stringify(self.get(key)).slice(tool.uploadDir.length,-1)
        return path.join(this.uploadUri, p)
    },
    uploadAndSave: function(self, key, file, cb) {
        if (!file)
            return self.save(cb)

        if (self.get(key) && file) {
            if (self.get(key).indexOf('/upload/') != -1) {
                // /home/david/Workspace/dev/hello-ndoe/public/upload/xxxx.jpg
                var oldPath = self.get(key)
                if (self.get(key).indexOf('/upload/') == 0) {
                    // /upload/xxxx.jpg
                    oldPath = path.join(path.resolve(file.path, '../../'), self.get(key))
                }
                console.log(oldPath)
                fs.unlink(oldPath, function(err) {
                    if (err)
                        return cb(new OtherError('Old photo delete error'))
                })
            }
            // else{
            //     // http://www.placeholder.com/.....
            // }
        }

        var tempPath = file.path
        var ext = path.extname(file.name).toLowerCase()
        var targetPath = path.join(uploadDir, path.basename(file.path).toLowerCase() + ext)
        console.log(targetPath)
        if (_.contains(['.jpg', '.jpeg', '.png', '.gif'], ext))
            fs.rename(tempPath, targetPath, function(err) {
                if (err) {
                    return cb(new OtherError('New photo save error'))
                } else {
                    self.set(key, targetPath)
                    self.save(cb)
                }
            })
        else {
            fs.unlink(tempPath, function(err) {
                if (err)
                    console.log(tempPath + ' can not be deleted')
                cb(new OtherError('Only jpg,png and gif image are allowed'))
            })
        }
    }

}