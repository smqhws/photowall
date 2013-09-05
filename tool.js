module.exports = {
    email: /^[a-z0-9A-Z_]+@[a-z0-9A-Z]+(\.[a-z0-9A-Z]+)+$/,
    phone: /^\d{11}$/,
    password: /^[a-z0-9A-Z_]{6,12}$/,
    is: function(str, reg) {
        if (!str || !str.length)
            return false
        if (reg)
            return str.match(reg)
        return true;
    },
    len:function(str,min,max){
        if(!str || typeof(min)!='number' || !str.length||str.length<min)
            return false
        if(typeof(max)=='number' )
            return str.length<max
        return true
    },
    isUnique: function(self, key, val, Model, cb) {
        if (!self.isNew && !self.isModified(key))
            return cb(true)
        obj = {}
        obj[key] = val;
        Model.find(obj, function(err, docs) {
            cb(!err && docs.length === 0)
        })
    },
    isAuthenticated: function(req, res, next) {
        if (req.isAuthenticated())
            next()
        else {
            req.flash('error', 'Must log in')
            res.redirect('/user/login')
        }
    },
    getErrMsg: function(err) {
        if (!err)
            return []
        var emsg = []
        if(err.errors){
            var errs = err.errors
            for (var e in errs) {
                emsg[emsg.length] = errs[e].type
            }
        }
        else if(err.message)
            emsg[emsg.length]=err.message
        return emsg
    },
    render:function(req,res,page,obj){
        obj.error=req.flash('error')
        res.render(page,obj)
    }

}