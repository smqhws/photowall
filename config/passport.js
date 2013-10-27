module.exports = function(passport, User) {
    var LocalStrategy = require('passport-local').Strategy
    var BaiduStrategy = require('passport-baidu').Strategy
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, function(email, password, done) {
        User.findOne({
            email: email
        }, function(err, user) {
            if (err) {
                return done(err)
            }
            if (!user) {
                return done(null, false, {
                    message: 'This email : ' + email + ' has not be signed up'
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    message: 'Wrong password'
                })
            } else {
                return done(null, user)
            }
        })
    }))

    // passport.use(new BaiduStrategy({

    //     },
    //     function(accessToken, refreshToken, profile, done) {
    //         User.findOne({
    //             'baidu.id': profile.id
    //         }, function(err, user) {
    //             if (err) {
    //                 return done(err)
    //             }
    //             if (!user) {
    //                 user = new User({
    //                     provider: 'baidu',
    //                     baidu: profile._json
    //                 })
    //                 user.save(function(err) {
    //                     if (err) console.log(err)
    //                     return done(err, user)
    //                 })
    //             } else {
    //                 return done(err, user)
    //             }
    //         })
    //     }
    // ))
}