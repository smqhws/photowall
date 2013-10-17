module.exports = function(tool, Tag) {
    var render = tool.render
    var _ = tool._
    var check = tool.check
    var path = tool.path
    var fs = tool.fs
    result = {
        list: function(req, res) {
            Tag.list(tool.getListOpt(req), function(err, objs) {
                if (err)
                    res.json(500, {
                        error: err
                    })
                console.log(objs)
                res.json(objs)
            })
        }
    }
    return result
}