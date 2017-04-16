let mongoose = require('mongoose');
let crypto = require('../../config/utils');

let userSchema = mongoose.Schema({
    username: {type: String, require: true},
    hashPass: {type: String, require: true},
    salt: {type: String, require: true},
    role: {type: String, require: true},
    tourneys:[{type: mongoose.Schema.Types.ObjectId, ref: 'Torney' }]
})

userSchema.method({
    authenticate: function(password){
        let inputHash = crypto.generateHashedPassword(this.salt,password)
        if(inputHash == this.hashPass){
            return true;
        } else{
            return false;
        }
    }
})


module.exports = mongoose.model('User', userSchema);