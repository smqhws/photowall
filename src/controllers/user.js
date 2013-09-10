module.exports = function(tool, User) {
    var check = tool.check
    var render = tool.render
    var _ = tool._
    result = {
        signup: function(req, res) {
            render(req, res, 'user/signup_login', {
                title: 'Sign up',
                submitBtn: 'Sign up',
                action: '/user'
            })
        },
        validCreate: function(req, res, next) {
            var msg = check('email', req.param('email')).is(tool.email).msg
                .concat(check('password', req.param('password')).is(tool.password).msg)
            if (msg && msg.length) {
                req.flash('error', msg)
                res.redirect('/signup')
            } else
                next()
        },
        create: function(req, res) {
            var u = new User(req.body)
            u.save(function(err, doc) {
                if (err) {
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/signup')
                } else {
                    req.login(doc, function(err) {
                        if (err) {
                            //show err???
                            return next(err)
                        } else
                            res.redirect('/user/' + doc._id)

                    })
                }
            })
        },
        login: function(req, res) {
            render(req, res, 'user/signup_login', {
                title: 'Log in',
                submitBtn: 'Log in',
                action: 'login'
            })
        },
        validLogin: function(req, res, next) {
            var msg = check('email', req.param('email')).is(tool.email).msg
                .concat(check('password', req.param('password')).is(tool.password).msg)
            if (msg && msg.length) {
                req.flash('error', msg)
                res.redirect('/login')
            } else
                next()
        },
        logout: function(req, res) {
            req.logout()
            res.redirect('/login')
        },
        list: function(req, res) {
            tool.list(req, res, User, tool.getListOpt(req), 'user/list', 'Users')
        },
        show: function(req, res) {
            render(req, res, 'user/show', {
                title: req.otheruser.email,
                user: req.otheruser
            })
        },
        home: function(req, res) {
            render(req, res, 'user/show', {
                title: req.user.email,
                user: req.user
            })
        },
        edit: function(req, res) {
            render(req, res, 'user/edit', {
                title: req.otheruser.email,
                user: req.otheruser
            })
        },
        update: function(req, res) {
            var u = req.otheruser
            console.log(req.body)
            _.extend(u.profile, req.body)
            console.log(u)
            u.markModified('profile')
            u.uploadAndSave(req.files.image, function(err, doc) {
                if (err) {
                    req.flash("error", tool.getErrMsg(err))
                    res.redirect('/user/' + req.otheruser._id + '/edit')
                }
                res.redirect('/user/' + req.otheruser._id)
            })
        },
        load: function(req, res, next, userId) {
            User.findById(userId, function(err, doc) {
                if (err) {
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/user')
                }
                req.otheruser = doc
                next()
            })
        }
    }
    return result
}