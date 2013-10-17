module.exports = function(mongoose, tool) {
    var Schema = mongoose.Schema
    var fs = tool.fs
    var path = tool.path
    var OtherError = tool.OtherError
    var _ = tool._
    var TagSchema = new Schema({
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
        }
    })

    TagSchema.path('about').validate(function(val) {
        return tool.is(val)
    }, 'Can\'t add a tag to an empty object')

    var schemaTrans = function(doc, ret, option) {
        if (ret.id && ret._id) delete ret._id
    }
    TagSchema.set('toObject', {
        virtuals: true,
        transform: schemaTrans
    })
    TagSchema.set('toJSON', {
        virtuals: true,
        transform: schemaTrans
    })

    TagSchema.statics = {
        list: function(obj, cb) {
            var where = obj.where || {}
            var sort = obj.sort || {
                'plus1': 1,
                'minus1':-1
            }

            this.find(where)
                .populate('addedBy', 'email profile')
                .sort(sort)
                .limit(obj.pageSize)
                .skip(obj.pageSize * obj.pageIndex)
                .exec(cb)
        }
    }
    mongoose.model('Tag', TagSchema)
}