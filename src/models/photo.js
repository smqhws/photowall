module.exports = function(mongoose, tool) {
    var Schema = mongoose.Schema
    var fs = tool.fs
    var path = tool.path
    var OtherError = tool.OtherError
    var _ = tool._
    var PhotoSchema = new Schema({
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
            }
        }]
    })

    //validation
    PhotoSchema.path('path').validate(function(val) {
        return tool.is(val)
    }, 'Path can\'t be empty')


    PhotoSchema.pre('save', function(next) {
        if (!this.isNew)
            this.lastModifiedDate = Date.now()
        next()
    })
    PhotoSchema.pre('remove', function(next) {
        var self = this
        fs.unlink(this.path, function(err) {
            if (err)
                console.log(self.path + ' can not be deleted')
            next()
        })
    })
    PhotoSchema.methods = {
        getUri: function() {
            return tool.getUri(this, 'path')
        },
        uploadAndSave: function(file, cb) {
            return tool.uploadAndSave(this, 'path', file, cb)
        },
        addComment: function(content, uid, cb) {
            this.comment.push({
                content: content,
                addedBy: uid
            })
            this.save(cb)
        },
        addTag: function(content, uid, cb) {
            this.tag.push({
                content: content,
                addedBy: uid
            })
            this.save(cb)
        }
    }

    PhotoSchema.statics = {
        list: function(obj, cb) {
            var where = obj.where || {}
            var sort = obj.sort || {
                'createdDate': -1
            }

            this.find(where,'_id path')
                .populate('addedBy','email profile')
                .populate('comment.addedBy','email profile')
                .populate('tag.addedBy','email profile')
                .sort(sort)
                .limit(obj.pageSize)
                .skip(obj.pageSize * obj.pageIndex)
                .exec(cb)
        },
        load: function(id, cb) {
            this.findById(id)
                .populate('addedBy','email profile')
                .populate('comment.addedBy','email profile')
                .populate('tag.addedBy','email profile')
                .exec(cb)
        }
    }
    mongoose.model('Photo', PhotoSchema)
}