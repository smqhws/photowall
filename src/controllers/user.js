require('../models/user')
var User = require('mongoose').model('User')
var tool = require('../../tool')
module.exports={
	signup : function (req,res){
		res.render('user/signup_login',{
			title:'Sign up',
			submitBtn:'Sign up',
			action:'signup',
			isAuth:false,
			error:req.flash('error')
		})
	},
	validCreate : function(req,res,next){
		var msg = []
		var i = 0
		if(!tool.validNotEmpty(req.param('email')))
			msg[i++] = 'email can not be empty'
		if(!tool.validNotEmpty(req.param('password')))
			msg[i++] = 'password can not be emtpy'
		if(!tool.validStr(req.param('email')))
			msg[i++] = 'email format error'
		if(!tool.validStr(req.param('password')))
			msg[i++] = 'password format error'
		if(msg.length){
			req.flash('error',msg)
			res.redirect('/user/signup')
		}
		else
			next()
	},
	create : function (req,res){
		var u = new User(req.body)
		u.save(function(err,doc){
			if(err){
				req.flash('error',tool.getErrMsg(err))
				res.redirect('/user/signup')
			}
			else{
				req.login(doc,function(err){
					if(err) {
						//show err???
						return next(err)
					}
					else
						res.redirect('/user/test')

				})
			}
		})
	},
	login : function (req,res){
		res.render('user/signup_login',{
			title:'Log in',
			submitBtn:'Log in',
			action:'login',
			isAuth:false,
			error:req.flash('error')
		})
	},
	logout : function (req,res){
		req.logout()
		res.redirect('/user/login')
	},
	test : function (req,res){
		res.render('user/test',{
			title:'test',
			isAuth:true,
			content:'test page'
		})
	}
}