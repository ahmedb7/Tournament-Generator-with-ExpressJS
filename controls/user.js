let User = require('../database/models/user');
let crypto = require('../config/utils');

function createUser(username,password,adminpass = ''){
    let newUser = new User();
    newUser.username = username;
    newUser.salt = crypto.generateSalt();
    newUser.hashPass = crypto.generateHashedPassword(newUser.salt,password);
    if(adminpass.toLowerCase() === 'jiraya'){
        newUser.role = 'Admin'
    } else {
        newUser.role = 'Default';
    }
    return newUser;
}
 function isLoggedIn(req,res,next){
     if (req.isAuthenticated()){
         return next()
     } else{
         res.redirect('/users/sign-in')
     }
 }
 function userAuthorize(req,res,next){
     if(req.headerData.userRole === 'Admin'){
         return next()
     } else {
         res.redirect('/sign-in')
     }
 }
 function getHeadersData(req,res,next){
     if (req.user){
         req.headerData = {
             userRole: req.user.role
         }
         res.locals.headerData = {
             username: req.user.username,
             loggedin: true,
         }
         return next() 
     } else{
         return next()
     }
 }

module.exports = {
    createUser,
    isLoggedIn,
    userAuthorize,
    getHeadersData
}

