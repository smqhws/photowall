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
                    res.json(500,{error:tool.getErrMsg(err)})
                } else
                    res.json(doc.comment[doc.comment.length-1])
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
        home:function(req,res){
            res.render('angular/index')
        },
        list: function(req, res) {
            //tool.list(req, res, Photo, tool.getListOpt(req), 'photo/list', 'Photos')
            tool.list(Photo, tool.getListOpt(req), 'Photos', null, function(err, rend) {
                if (err)
                    res.json({
                        error: err
                    })
                _.each(rend.objs,function(element){
                    element.path=element.getUri()
                    //element.addedBy.profile.path=element.addedBy.getUri()
                })
                res.json(rend)
            })
        },
        listByUser: function(req, res) {
            // var obj = tool.getListOpt(req, {
            //     where: {
            //         addedBy: req.otheruser._id
            //     }
            // })
            // tool.list(req, res, Photo, obj, 'photo/list', req.otheruser.getName(), {
            //     user: req.otheruser
            // })
            var obj = tool.getListOpt(req, {
                where: {
                    addedBy: req.otheruser._id
                }
            })
            tool.list(Photo, obj, req.otheruser.getName(), {
                user: req.otheruser
            }, function(err, rend) {
                if (err)
                    res.json({
                        error: err
                    })
                res.json(rend)
            })
        },
        show: function(req, res) {
            req.obj.path = req.obj.getUri()
            res.json({photo:req.obj})
        },
        load: function(req, res, next, photoId) {
            tool.load(req, res, next, photoId, Photo, '/photo')
        }
    }
    return result
}