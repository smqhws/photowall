module.exports = function(tool, Photo) {
    var render = tool.render
    var _ = tool._
    var check = tool.check
    var path = tool.path
    var fs = tool.fs
    result = {
        add: function(req, res) {
            res.render('photo/edit', {
                action: '/jphoto',
                photo: new Photo()
            })
        },
        create: function(req, res) {
            var p = new Photo(req.body)
            p.addedBy = req.user.id
            var targetDir = path.join(tool.uploadDir, req.user.id)
            var fm = tool.upload.fileManager({
                targetDir: targetDir,
                targetUrl: path.join(tool.uploadUri, req.user.id),
            })

            req.filemanager.move(req.param('name'), '', function(err, result) {
                if (err)
                    res.json(500, {error: err})
                p.path = path.join(targetDir, req.param('name'))
                p.save(function(err, doc) {
                    if (err)
                        res.json(500, {error: err})
                    else
                        res.json({success: 'success'})
                })
            })

        },
        // create: function(req, res) {
        //     var p = new Photo(req.body)
        //     p.addedBy = req.user.id
        //     p.uploadAndSave(req.files.image, function(err, doc) {
        //         if (err) {
        //             res.json('500',{error:err})
        //         } else {
        //             res.json({success:'success'})
        //         }
        //     })
        // },
        edit: function(req, res) {
            res.render('photo/edit', {
                action: '/jphoto/' + req.obj._id,
                photo: req.obj
            })
        },
        update: function(req, res) {
            var p = req.obj
            _.extend(p, req.body)
            p.lastModifiedBy = req.user._id
            p.uploadAndSave(req.files.image, function(err, doc) {
                if (err) {
                    res.json(500, {
                        error: err
                    })
                } else {
                    res.json({
                        success: 'success'
                    })
                }
            })
        },
        addComment: function(req, res) {
            req.obj.addComment(req.param('content'), req.user._id, function(err, doc) {
                if (err) {
                    console.log(err)
                    res.json(500, {
                        error: tool.getErrMsg(err)
                    })
                } else
                    res.json(doc.comment[doc.comment.length - 1])
            })
        },
        count: function(req, res) {
            Photo.count().exec(function(err, count) {
                if (err)
                    res.json(500, {
                        error: err
                    })
                res.json({
                    count: count
                })
            })
        },
        list: function(req, res) {
            Photo.list(tool.getListOpt(req), function(err, objs) {
                if (err)
                    res.json(500, {
                        error: err
                    })
                res.json(objs)
            })
        },
        show: function(req, res) {
            res.json(req.obj)
        },
        load: function(req, res, next, photoId) {
            Photo.load(photoId, function(err, doc) {
                if (err)
                    res.json(500, {
                        error: err
                    })
                req.obj = doc
                next()
            })
        }
    }
    return result
}