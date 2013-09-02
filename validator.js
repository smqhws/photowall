function Validator(key, val) {
    this.val = val
    this.key = key
    this.msg = []
    this.isEmpty = false
}


Validator.prototype.is = function(reg, msg) {
    if (!this.isEmpty && reg)
        this.val.match(reg) ? true : (this.msg[this.msg.length] = msg && msg.length ? msg : this.key + ' format error')
    return this
}
exports.check = function(key, val) {
    var v = new Validator(key, val)
    if (!v.val || !v.val.length) {
        v.msg[v.msg.length] = v.key + " can\'t be empty"
        v.isEmpty = true
    }
    return v
}