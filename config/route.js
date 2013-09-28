module.exports = function(app, tool, user, photo, jphoto) {
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

    app.get('/user/photo/:userId', tool.isAuthenticated, photo.listByUser)
    app.get('/photo/add', tool.isAuthenticated, photo.add)
    app.post('/photo', tool.isAuthenticated, photo.create)
    app.get('/photo', tool.isAuthenticated, photo.list)
    // app.param('photoId', /^[a-z0-9]{24}$/, photo.load)
    app.get('/photo/:photoId', tool.isAuthenticated, jphoto.show)
    app.get('/photo/:photoId/edit', tool.isAuthenticated, photo.edit)
    //app.post('/photo/:photoId/comment', tool.isAuthenticated, photo.addComment)
    app.post('/photo/:photoId/tag', tool.isAuthenticated, photo.addTag)
    app.put('/photo/:photoId', tool.isAuthenticated, photo.update)

    // app.get('/',tool.isAuthenticated,jphoto.home)
    app.get('/jphoto', tool.isAuthenticated, jphoto.list)
    app.get('/jphoto/count', tool.isAuthenticated, jphoto.count)
    app.get('/jphoto/:photoId', tool.isAuthenticated, jphoto.show)
    app.get('/jphoto/:photoId/edit', tool.isAuthenticated, jphoto.edit)
    app.post('/jphoto', tool.isAuthenticated, jphoto.create)
    app.put('/jphoto/:photoId', tool.isAuthenticated, jphoto.update)

    app.post('/photo/:photoId/comment', tool.isAuthenticated, jphoto.addComment)

    // app.get('/uploads/:filename?', tool.isAuthenticated, function(req, res, next) {
    //     tool.upload.fileHandler()(req, res, next)
    // })
    // app.post('/uploads', tool.isAuthenticated, jphoto.create, function(req, res, next) {
    //     tool.upload.fileHandler()(req, res, next)
    // })
    // app.delete('/uploads/:filename', tool.isAuthenticated, function(req, res, next) {
    //     tool.upload.fileHandler()(req, res, next)
    // })
    
    app.param('userId', /^[a-z0-9]{24}$/, user.load)
    app.param('photoId', /^[a-z0-9]{24}$/, photo.load)
}