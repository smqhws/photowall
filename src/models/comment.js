module.exports = function(mongoose, tool) {
    var Schema = mongoose.Schema
    var fs = tool.fs
    var path = tool.path
    var OtherError = tool.OtherError
    var _ = tool._
    var CommentSchema = new Schema({
        content: {
            type: String,
            default: ''
        },
        about:{
            type:Schema.Types.ObjectId
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
    })

    CommentSchema.path('about').validate(function(val) {
        return tool.is(val)
    }, 'Can\'t add a comment to an empty object')

    var schemaTrans = function(doc, ret, option) {
        if (ret.id && ret._id) delete ret._id
    }
    CommentSchema.set('toObject', {
        virtuals: true,
        transform: schemaTrans
    })
    CommentSchema.set('toJSON', {
        virtuals: true,
        transform: schemaTrans
    })

    CommentSchema.statics = {
        list: function(obj, cb) {
            var where = obj.where || {}
            var sort = obj.sort || {
                'createdDate': -1
            }

            this.find(where)
                .populate('addedBy', 'email profile')
                .sort(sort)
                .limit(obj.pageSize)
                .skip(obj.pageSize * obj.pageIndex)
                .exec(cb)
        }
    }
    mongoose.model('Comment', CommentSchema)
}