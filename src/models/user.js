module.exports = function(mongoose, tool) {
    var Schema = mongoose.Schema
    var crypto = require('crypto')

    var UserSchema = new Schema({
        email: {
            type: String,
            default: '',
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            default: '******'
        },
        hash: {
            type: String,
            default: ''
        },
        salt: {
            type: String,
            default: ''
        },
        provider: {
            type: String,
            default: ''
        },
        baidu: {},
        profile: {
            name:{
                type:String,
                default:''
            },
            sex: {
                type: String,
                default: ''
            },
            birthday: {
                type: String,
                default: ''
            },
            phone: {
                type: String,
                default: ''
            }
        }
    })



    UserSchema.methods = {
        makeSalt: function() {
            return Math.round((new Date().valueOf() * Math.random())) + ''
        },
        encryptPassword: function(password) {
            if (!tool.is(password))
                return ''
            try {
                return crypto.createHmac('sha1', this.salt).update(password).digest('hex')

            } catch (err) {
                return ''
            }
        },
        authenticate: function(password) {
            return this.encryptPassword(password) === this.hash
        }
    }

    UserSchema.path('email').validate(function(val) {
        return tool.is(val, tool.email)
    }, 'email format error')
    UserSchema.path('email').validate(function(val, cb) {
        tool.isUnique(this, 'email', val, mongoose.model('User'), cb);
    }, 'email must be unqiue')
    UserSchema.path('profile.phone').validate(function(val) {
        return tool.is(val) ? tool.is(val, tool.phone) : true
    }, 'phone format error')
    UserSchema.path('profile.phone').validate(function(val, cb) {
        tool.is(val) ? tool.isUnique(this, 'profile.phone', val, mongoose.model('User'), cb) : cb(true);
    }, 'phone must be sth unqiue')

    function validPassword(val) {
        return tool.is(val, tool.password)
    }

    UserSchema.pre('save', function(next) {
        if (!this.isNew && !this.isModified('password'))
            return next()
        if (!validPassword(this.password)) {
            next(new Error('Invalid Password'))
        } else {
            this.salt = this.makeSalt()
            this.hash = this.encryptPassword(this.password)
            this.password = "******"
            next()
        }
    })

    mongoose.model('User', UserSchema)
}