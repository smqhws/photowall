module.exports = function(tool, check, User) {
    result = {
        signup: function(req, res) {
            res.render('user/signup_login', {
                title: 'Sign up',
                submitBtn: 'Sign up',
                action: 'signup',
                isAuth: false,
                error: req.flash('error')
            })
        },
        validCreate: function(req, res, next) {
            var msg = check('email', req.param('email')).is(tool.email).msg
                .concat(check('password', req.param('password')).is(tool.password).msg)
            if (msg && msg.length) {
                req.flash('error', msg)
                res.redirect('/user/signup')
            } else
                next()
        },
        create: function(req, res) {
            var u = new User(req.body)
            u.save(function(err, doc) {
                if (err) {
                    req.flash('error', tool.getErrMsg(err))
                    res.redirect('/user/signup')
                } else {
                    req.login(doc, function(err) {
                        if (err) {
                            //show err???
                            return next(err)
                        } else
                            res.redirect('/user/test')

                    })
                }
            })
        },
        login: function(req, res) {
            res.render('user/signup_login', {
                title: 'Log in',
                submitBtn: 'Log in',
                action: 'login',
                isAuth: false,
                error: req.flash('error')
            })
        },
        validLogin: function(req, res, next) {
            var msg = check('email', req.param('email')).is(tool.email).msg
                .concat(check('password', req.param('password')).is(tool.password).msg)
            if (msg && msg.length) {
                req.flash('error', msg)
                res.redirect('/user/login')
            } else
                next()
        },
        logout: function(req, res) {
            req.logout()
            res.redirect('/user/login')
        },

        test: function(req, res) {
            res.render('user/test', {
                title: 'test',
                isAuth: true,
                content: 'test page'
            })
        }
    }
    return result
}