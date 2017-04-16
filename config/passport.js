let passport = require('passport');
let localPassport = require('passport-local');
let User = require('../database/models/user');
let controls = require('../controls/user');


module.exports = function(passport) {
    passport.serializeUser(function(user,done){
        done(null,user.id);
    })
    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user);
        })
    })

    passport.use('local.sign-up', new localPassport({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req,username,password,done){
       User.findOne({username: username}, function(err,user){
           if (err) {
               console.log(err);
               return done(err)
            };
           if (user) {
               console.log('there already is such a user');
               return done(null,false)
            };
            console.log(req.body.adminpass);
           let newUser = controls.createUser(username,password,req.body.adminpass);
               newUser.save(function(err){
                   if (err) return done(err);
                   return done(null,newUser);
               })
       }) 
    }))
    passport.use('local.sign-in', new localPassport({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username,password,done){
        User.findOne({username: username},function(err,user){
            if (err){
                console.log(err);
                return done(err);
            }
            if (!user){
                console.log('no such user');
                return done(null,false);
            }
            if(!user.authenticate(password)){
                console.log('wrong password');
                 return done(null,false);
            }
            return done(null,user);
        })
      }
    ))
}