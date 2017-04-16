let crypto = require('crypto')

module.exports = {
    generateSalt: function(){
       return crypto.randomBytes(128).toString('base64');
    },
    generateHashedPassword: function(salt,pass){
      return crypto.createHmac('sha256',salt).update(pass).digest('hex');
    }
}