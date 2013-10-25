module.exports = function(tool, User) {
    var check = tool.check
    var render = tool.render
    var passport = tool.passport
    var _ = tool._
    result = {
        login: function(req, res,next) {
            passport.authenticate('local', function(err, user, info) {
                if (err) {
                    return res.json(500,{error:err})
                }
                if (!user) {
                    return res.json(500,{error:info})
                }
                req.logIn(user, function(err) {
                    if (err) {
                        return res.json(500,{error:err})
                    }
                    return res.json({user:req.user})
                });
            })(req, res, next);
        },
        logout: function(req, res) {
            req.logout()
            res.redirect('/')
        },
        status:function(req,res){
            res.json({user:req.user})
        }
    }
    return result
}