module.exports={
	email : /^[a-z0-9A-Z_]+@[a-z0-9A-Z]+(\.[a-z0-9A-Z]+)+$/,
	phone : /^\d{11}$/,
	password : /^[a-z0-9A-Z_]{6,12}$/,
	validNotEmpty : function (str) {
		return str && str.length
	},
	validStr : function (str,reg){
		if(!str || !str.length)
			return false
		if(reg)
			return str.match(reg)
		return true;
	},
	validUnique : function (self,key,val,Model,cb){
		if(!self.isNew && !self.isModified(key))
			return cb(true)
		obj = {}
		obj[key] = val;
		Model.find(obj,function (err,docs){
			cb(!err && docs.length === 0)
		})
	},
	isAuthenticated : function(req,res,next){
		if(req.isAuthenticated())
			next()
		else{
			req.flash('error','Must log in')
			res.redirect('/user/login')
		}
	},
	getErrMsg : function(err){
		if(!err)
			return []
		var emsg = []
		var i = 0
		var errs=err.errors
		for(var e in errs){
			emsg[i++]=errs[e].type
		}
		return emsg
	}

}