require('../models/user')
var User = require('mongoose').model('User')
module.exports={
	signup : function (req,res){
		res.render('user/signup',{title:'Sign up'})
	},
	create : function (req,res){
		var u = new User(req.body)
		u.save(function(err,doc){
			if(err){
				res.render('user/signup',{
					title:'Sign up',
					errs:err.errors
				})
				console.log(JSON.stringify(err))
			}
			else{
				res.json(doc)
				console.log(JSON.stringify(doc))
			}
		})
	}
}