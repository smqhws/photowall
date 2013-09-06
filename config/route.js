module.exports = function(app, passport,tool,user,photo) {
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

    app.param('id',photo.load)
    app.get('/photo',tool.isAuthenticated,photo.list)
    
    app.get('/photo/new',tool.isAuthenticated,photo.add)
    app.post('/photo/new',tool.isAuthenticated,photo.save)

    app.get('/photo/:id',tool.isAuthenticated,photo.show)
}