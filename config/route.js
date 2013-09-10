module.exports = function(app, tool, user, photo) {
    var passport = tool.passport
    
    app.get('/signup', user.signup)
    app.post('/user', user.validCreate, user.create)
    app.get('/login', user.login)
    app.post('/login', user.validLogin,
        passport.authenticate('local', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        user.home
    )
    app.get('/auth/baidu', passport.authenticate('baidu'))
    app.get('/auth/baidu/callback',
        passport.authenticate('baidu', {
            failureRedirect: '/login',
            failureFlash: true
        }),
        user.home
    )
    app.get('/logout', user.logout)

    app.get('/user', tool.isAuthenticated, user.list)
    // app.param('userId', /^[a-z0-9]{24}$/, user.load)
    app.get('/user/:userId', tool.isAuthenticated, user.show)
    app.get('/user/:userId/edit', tool.isAuthenticated, user.edit)
    app.put('/user/:userId', tool.isAuthenticated, user.update)

    app.get('/user/photo/:userId',tool.isAuthenticated,photo.listByUser)
    app.get('/photo/add', tool.isAuthenticated, photo.add)
    app.post('/photo', tool.isAuthenticated, photo.create)
    app.get('/photo', tool.isAuthenticated, photo.list)
    // app.param('photoId', /^[a-z0-9]{24}$/, photo.load)
    app.get('/photo/:photoId', tool.isAuthenticated, photo.show)
    app.get('/photo/:photoId/edit', tool.isAuthenticated, photo.edit)
    app.put('/photo/:photoId', tool.isAuthenticated, photo.update)


    app.param('userId', /^[a-z0-9]{24}$/, user.load)
    app.param('photoId', /^[a-z0-9]{24}$/, photo.load)
}