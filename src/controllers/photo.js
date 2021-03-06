module.exports = function(tool, Photo) {
    var render = tool.render
    var _ = tool._
    var check = tool.check
    result = {
        add: function(req, res) {
            render(req, res, 'photo/edit', {
                title: 'New Image',
                action: '/photo',
                photo: new Photo()
            })
        },
        create: function(req, res) {
            var p = new Photo(req.body)
            p.addedBy = req.user.id
            p.uploadAndSave(req.files.image, function(err, doc) {
                if (err) {
                    console.log(err)
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/photo/new')
                } else {
                    res.redirect('/photo/' + p._id)
                }
            })
        },
        addComment: function(req, res) {
            req.obj.addComment(req.param('content'), req.user._id, function(err, doc) {
                if (err) {
                    console.log(err)
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/photo/' + req.obj._id)
                } else
                    res.redirect('/photo/' + req.obj._id)
            })
        },
        addTag: function(req, res) {
            req.obj.addTag(req.param('content'), req.user._id, function(err, doc) {
                if (err) {
                    console.log(err)
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/photo/' + req.obj._id)
                } else
                    res.redirect('/photo/' + req.obj._id)
            })
        },
        edit: function(req, res) {
            render(req, res, 'photo/edit', {
                title: 'Edit Image',
                action: '/photo/' + req.obj._id,
                photo: req.obj
            })
        },
        update: function(req, res) {
            var p = req.obj
            _.extend(p, req.body)
            p.lastModifiedBy = req.user._id
            p.uploadAndSave(req.files.image, function(err, doc) {
                if (err) {
                    console.log(err)
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/photo/' + p._id + '/edit')
                } else {
                    res.redirect('/photo/' + p._id)
                }
            })
        },
        list: function(req, res) {
            tool.list(Photo, tool.getListOpt(req), 'Photos', null, function(err, rend) {
                if (err)
                    res.render('500', {
                        error: err
                    })
                render(req, res, 'photo/list', rend)
            })
        },
        listByUser: function(req, res) {
            var obj = tool.getListOpt(req, {
                where: {
                    addedBy: req.otheruser._id
                }
            })
            tool.list(Photo, obj, req.otheruser.getName(), {
                user: req.otheruser
            }, function(err, rend) {
                if (err)
                    res.render('500', {
                        error: err
                    })
                render(req, res, 'photo/list', rend)
            })
        },
        show: function(req, res) {
            render(req, res, 'photo/show', {
                title: req.obj.title,
                photo: req.obj
            })
        },
        load: function(req, res, next, photoId) {
            tool.load(req, res, next, photoId, Photo, '/photo')
        }
    }
    return result
}