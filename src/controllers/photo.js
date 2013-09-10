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
        edit: function(req, res) {
            render(req, res, 'photo/edit', {
                title: 'Edit Image',
                action: '/photo/' + req.photo._id,
                photo: req.photo
            })
        },
        update: function(req, res) {
            var p = req.photo
            _.extend(p, req.body)
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
            tool.list(req, res, Photo, tool.getListOpt(req), 'photo/list', 'Photos')
        },
        listByUser: function(req, res) {
            var obj = tool.getListOpt(req, {
                where: {
                    addedBy: req.otheruser._id
                }
            })
            tool.list(req, res, Photo, obj, 'photo/list', req.otheruser.getName(), {
                user: req.otheruser
            })
        },
        show: function(req, res) {
            render(req, res, 'photo/show', {
                title: req.photo.title,
                photo: req.photo,
            })
        },
        load: function(req, res, next, photoId) {
            Photo.load(photoId, function(err, doc) {
                if (err) {
                    console.log(err)
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/photo')
                } else {
                    req.photo = doc
                    next()
                }
            })
        }
    }
    return result
}