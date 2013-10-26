module.exports = function(tool, Photo) {
    var render = tool.render
    var _ = tool._
    var check = tool.check
    var path = tool.path
    var fs = tool.fs
    var s3 = tool.s3
    var crypto = tool.crypto
    result = {
        s3Field:function(req,res){

            var key = tool.project_name+"/upload/"+tool.guid()
            var signatureObject = {
                expiration:s3.expiration_date(),
                conditions:[
                    {bucket:s3.bucket},
                    {key:key},
                    {acl:s3.acl},
                    ['starts-with','$Content-Type',s3.content_type],
                    {success_action_status:s3.success_action_status},
                    {filesize:req.param('filesize')}
                ]
            }
            var signatureString = JSON.stringify(signatureObject)
            var policy = new Buffer(signatureString).toString('base64').replace(/\n|\r/, '');
            var hmac = crypto.createHmac("sha1", s3.secret_key);
            var hash2 = hmac.update(policy);
            var signature = hmac.digest(encoding="base64");
            res.json([
                {key:key},
                {AWSAccessKeyId:s3.access_key_id},
                {acl:s3.acl},
                {success_action_status:s3.success_action_status},
                {policy:policy},
                {signature:signature},
                {'Content-Type':s3.content_type}
            ])
        },
        create : function(req,res){
            var p = new Photo(req.body)
            p.addedBy = req.user.id
            p.save(function(err,doc){
                if(err)
                    res.json(500,{error:err})
                else
                    res.json({success:'success'})
            })
        },
        // create: function(req, res) {
        //     var p = new Photo(req.body)
        //     p.addedBy = req.user.id
        //     var targetDir = path.join(tool.uploadDir, req.user.id)
        //     var fm = tool.upload.fileManager({
        //         targetDir: targetDir,
        //         targetUrl: path.join(tool.uploadUri, req.user.id),
        //     })

        //     fm.move(req.param('name'), '', function(err, result) {
        //         if (err)
        //             res.json(500, {error: err})
        //         p.path = path.join(targetDir, req.param('name'))
        //         p.save(function(err, doc) {
        //             if (err)
        //                 res.json(500, {error: err})
        //             else
        //                 res.json({success: 'success'})
        //         })
        //     })

        // },
        update: function(req, res) {
            var p = req.photo
            _.extend(p, req.body)
            p.lastModifiedBy = req.user.id
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
            res.json(req.photo)
        },
        load: function(req, res, next, photoId) {
            Photo.load(photoId, function(err, doc) {
                if (err)
                    res.json(500, {
                        error: err
                    })
                req.photo = doc
                next()
            })
        },
        op:function(req,res){
            var photo = req.photo
            console.log(typeof(photo[req.params.op]))
            photo[req.params.op]+=1;
            photo.save(function(err,doc){
                if(err)
                    return res.json(500,{error:err})
                res.json({op:doc[req.params.op]})
            })
        }
    }
    return result
}