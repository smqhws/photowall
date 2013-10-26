module.exports = function(tool, Comment) {
    var render = tool.render
    var _ = tool._
    var check = tool.check
    var path = tool.path
    var fs = tool.fs
    result = {
        list: function(req, res) {
            Comment.list(tool.getListOpt(req,{where:{about:req.photo.id}}), function(err, objs) {
                if (err)
                    res.json(500, {
                        error: err
                    })
                res.json(objs)
            })
        },
        count:function  (req,res) {
            Comment.count({about:req.photo.id}).exec(function(err, count) {
                if (err)
                    res.json(500, {
                        error: err
                    })
                res.json({
                    count: count
                })
            })
        },
        create:function(req,res){
            var c = new Comment()
            c.content = req.param('content')
            c.addedBy = req.user.id
            c.about = req.photo.id
            c.save(function(err,doc){
                if(err){
                    return res.json(500,{error:err})
                } 
                res.json(doc)
            })
        },
        op:function(req,res){
            Comment.findById(req.params.commentId,function(err,doc){
                if(err)
                    return res.json(500,{error:err})
                doc[req.params.op]+=1
                doc.save(function(err,doc){
                    if(err)
                        return res.json(500,{error:err})
                    res.json({op:doc[req.params.op]})
                })
            })
        }
    }
    return result
}