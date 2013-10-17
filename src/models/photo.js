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
        }
    })

    //validation
    PhotoSchema.path('path').validate(function(val) {
        return tool.is(val)
    }, 'Path can\'t be empty')

    PhotoSchema.virtual('uri').get(function() {
        return tool.getUri(this,'path')
    })

    var schemaTrans = function (doc, ret, option) {
        if (ret.id && ret._id) delete ret._id
        if (ret.path) delete ret.path
    }
    PhotoSchema.set('toObject', {
        virtuals: true,
        transform: schemaTrans
    })
    PhotoSchema.set('toJSON', {
        virtuals: true,
        transform: schemaTrans
    })

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

            this.find(where, 'path')
                .sort(sort)
                .limit(obj.pageSize)
                .skip(obj.pageSize * obj.pageIndex)
                .exec(cb)
        },
        load: function(id, cb) {
            this.findById(id,'-comment')
                .populate('addedBy', 'email profile')
                .exec(cb)
        }
    }
    mongoose.model('Photo', PhotoSchema)
}