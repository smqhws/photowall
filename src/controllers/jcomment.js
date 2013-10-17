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
                setTimeout(function(){res.json(objs)},2000)
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
                    console.log(err)
                    res.json(500,{error:tool.getErrMsg(err)})
                }
                    
                res.json(doc)
            })
        }
    }
    return result
}