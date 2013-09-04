module.exports = function(app, passport,tool,user) {
    app.get('/user/signup', user.signup)
    app.post('/user/signup', user.validCreate, user.create)
    app.get('/user/login', user.login)
    app.post('/user/login', user.validLogin,
        passport.authenticate('local', {
            successRedirect: '/user/test',
            failureRedirect: '/user/login',
            failureFlash: true
        })
    )
    app.get('/user/baidu', passport.authenticate('baidu'))
    app.get('/user/baidu/callback',
        passport.authenticate('baidu', {
            failureRedirect: '/login',
            successRedirect: '/user/test',
            failureFlash: true
        })
    )
    app.get('/user/logout', user.logout)
    app.get('/user/test', tool.isAuthenticated, user.test)
}