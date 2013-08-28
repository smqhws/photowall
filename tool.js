var validStr = exports.validStr = function (str,reg){
	if(!str || !str.length)
		return false
	if(reg)
		return str.match(reg)
	return true;
}

var validUnique = exports.validUnique = function (self,obj,key,val,Model,cb){
	if(!self.isNew && !self.isModified(key))
		return cb(true)
	Model.find(obj,function (err,docs){
		cb(!err && docs.length === 0)
	})
}

var getErrMsg = exports.getErrMsg =function(err){
	var res = [],
		count = 0
	for(var i in err.errors){
		var e = {}
		e.path = i
		e.message = err.errors[i].type
		res[count++] = e
	}
	return res
}