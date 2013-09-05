module.exports = function(mongoose, tool, imager) {
    var Schema = mongoose.Schema
    var fs = require('fs')
    var path = require('path')
    var OtherError = require('../../error').OtherError
    var PhotoSchema = new Schema({
        title: {
            type: String,
            default: '',
            required: true
        },
        desc: {
            type: String,
            default: ''
        },
        path: {
            type: String,
            default: ''
        },
        addedDate: {
            type: Date,
            default: Date.now
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        plus1: {
            type: Number,
            default: 0
        },
        minus1: {
            type: Number,
            default: 0
        },
        lastModifiedDate: {
            type: Date,
            default: Date.now
        },
        lastModifiedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        tag: [{
            content: {
                type: String,
                default: ''
            },
            plus1: {
                type: Number,
                default: 0
            },
            minus1: {
                type: Number,
                default: 0
            },
            addedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
        comment: [{
            content: {
                type: String,
                default: ''
            },
            plus1: {
                type: Number,
                default: 0
            },
            minus1: {
                type: Number,
                default: 0
            },
            addedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            addedDate: {
                type: Date,
                default: Date.now
            },
            lastModifiedDate: {
                type: Date,
                default: Date.now
            },
            lastModifiedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        }]
    })

    PhotoSchema.path('title').validate(function(val) {
        return tool.len(val, 1, 100)
    }, 'Title can\'t be blank and should be less than 100 words')
    PhotoSchema.path('path').validate(function(val) {
        return tool.is(val)
    }, 'Path can\'t be empty')
    PhotoSchema.pre('save', function(next) {
        if (!this.isNew)
            this.lastModifiedDate = Date.now()
        next()
    })
    PhotoSchema.method('uploadAndSave', function(file, cb) {
        var self = this
        var tempPath = file.path
        var ext = path.extname(file.name).toLowerCase()
        var targetPath = path.resolve(tempPath+ext)
        if (ext === '.jpg')
            fs.rename(tempPath, targetPath, function(err) {
                if (err) {
                    return cb(new OtherError('Can\'t save image'))
                } else {
                    self.path = targetPath
                    self.save(cb)
                }
            })
        else {
            fs.unlink(tempPath, function(err) {
                if (err) console.log(tempPath + 'can not be deleted')
                cb(new OtherError('Only jpg image is allowed'))
            })
        }
    })
    mongoose.model('Photo', PhotoSchema)
}