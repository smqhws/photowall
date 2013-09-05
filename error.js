
var util = require('util')

var AbstractError = function (msg, constr) {
  Error.captureStackTrace(this, constr || this)
  this.message = msg || 'Error'
}
util.inherits(AbstractError, Error)
AbstractError.prototype.name = 'Abstract Error'

var OtherError = function (msg) {
  OtherError.super_.call(this, msg, this.constructor)
}
util.inherits(OtherError, AbstractError)
OtherError.prototype.name = 'Other Error'

exports.OtherError = OtherError