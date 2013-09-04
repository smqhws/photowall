var mongoose = require('mongoose')
var Schema = mongoose.Schema
var tool = require('../../tool')

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
        lastModifiedBy :{
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
PhotoSchema.pre('save',function  (next) {
    if(!this.isNew)
        this.lastModifiedDate = Date.now()
    next()
})
mongoose.model('Photo', PhotoSchema)