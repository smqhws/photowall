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
            p.uploadAndSave(req.files.image,function(err,doc){
                if(err){
                    console.log(err)
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/photo/new')
                }
                else{
                    res.send(doc)
                }
            })
        }
    }
    return result
}