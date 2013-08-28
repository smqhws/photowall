var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	tool = require('../../tool')

var UserSchema = new Schema({
	email: {type :String, default: '', trim :true, lowercase: true},
	password: {type: String,default: '******'},
	phone: {type :String, default: ''},
	hash: {type :String, default: ''},
	salt: {type :String, default: ''},
	profile: {
		sex: {type :String, default: ''},
		birthday: {type :String, default: ''}
	}
})



UserSchema.methods={
	makeSalt: function (){
		return Math.round((new Date().valueOf() * Math.random())) + ''
	},
	encryptPassword: function (password){
		if(!tool.validStr(password))
			return ''
		try{
			return crypto.createHmac('sha1', this.salt).update(password).digest('hex')

		}
		catch(err){
			return ''
		}
	},
	authenticate: function (password){
		return this.encryptPassword(password) === this.hash
	}
}

UserSchema.path('email').validate(function(val) {
	return tool.validStr(val,/^[a-z0-9A-Z_]+@[a-z0-9A-Z]+(\.[a-z0-9A-Z]+)+$/)
},'email mustn\'t be empty')
UserSchema.path('email').validate(function(val,cb) {
	tool.validUnique(this,{email:val},'email',val,mongoose.model('User'),cb);
},'email must be sth unqiue')
UserSchema.path('phone').validate(function(val) {
	return tool.validStr(val,/^\d{11}$/)
},'phone mustn\'t be empty')
UserSchema.path('phone').validate(function(val,cb) {
	tool.validUnique(this,{phone:val},'phone',val,mongoose.model('User'),cb);
},'phone must be sth unqiue')

function validPassword(val){
	return tool.validStr(val,/^[a-z0-9A-Z_]{6,12}$/)
}

UserSchema.pre('save',function(next){
	if(!this.isNew && !this.isModified('password'))
		return next()
	if(!validPassword(this.password)){
		next(new Error('Invalid Password'))
	}
	else{
		this.salt = this.makeSalt()
		this.hash = this.encryptPassword(this.password)
		this.password = "******"
		next()
	}
})

mongoose.model('User',UserSchema)