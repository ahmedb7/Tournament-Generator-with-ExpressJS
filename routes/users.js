var express = require('express');
var router = express.Router();
let passport = require('passport');
let bodyParser = require('body-parser')
let csurf = require('csurf');
let csurfProt = csurf();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.use('/',bodyParser.urlencoded({ extended: true }));
router.use('/',csurfProt);
//sign in
router.get('/sign-in',function(req,res,next){
    res.render('../views/users/login.hbs',{csrfToken: req.csrfToken()});
})
router.post('/sign-in', passport.authenticate('local.sign-in',{
     successRedirect: '/',
     failureRedirect: 'users/sign-in'
}))
//sign up
router.get('/sign-up',function(req,res,next){
    res.render('../views/users/sign-up.hbs',{csrfToken: req.csrfToken()});
})

router.post('/sign-up',passport.authenticate('local.sign-up',{
    successRedirect: '/',
    failureRedirect: 'users/sign-up'
}))
//log-out
router.get('/log-out',function(req,res,next){
  req.logout();
  res.redirect('/')
})
//profile page
router.get('/:username',function(req,res,next){
  res.render('../views/users/profile-page.hbs');
})
module.exports = router;
