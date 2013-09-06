module.exports = function(tool, check, Photo) {
    var render = tool.render
    result = {
        add: function(req, res) {
            render(req, res, 'photo/save', {
                title: 'New Image',
                action: 'new'
            })
        },
        save: function(req, res) {
            var p = new Photo(req.body)
            p.addedBy = req.user.id
            p.uploadAndSave(req.files.image, function(err, doc) {
                if (err) {
                    console.log(err)
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/photo/new')
                } else {
                    res.redirect('/photo/'+p._id)
                }
            })
        },
        load: function(req, res, next, id) {
            Photo.load(id, function(err, doc) {
                if (err) {
                    console.log(err)
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/photo')
                } else {
                    req.photo = doc
                    next()
                }
            })
        },
        list: function(req, res) {
            var pageIndex = (req.param('pageIndex') > 0 ? req.param('pageIndex') : 1) - 1
            var obj = {
                pageIndex: pageIndex,
                pageSize: 30
            }
            Photo.list(obj, function(err, docs) {
                if (err) return res.render('500')
                Photo.count().exec(function(err, count) {
                    render(req, res, 'photo/list', {
                        title: 'Photos',
                        photos: docs,
                        pageIndex: pageIndex + 1,
                        pageCount: Math.ceil(count / 30)
                    })
                })
            })
        },
        show: function(req, res) {
            render(req, res, 'photo/show', {
                title: req.photo.title,
                photo: req.photo
            })
        }
    }
    return result
}