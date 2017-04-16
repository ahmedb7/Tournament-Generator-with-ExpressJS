let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser')
let userControl = require('../controls/user')
let tourneyControl = require('../controls/torney');

router.get('/all',function(req,res,next){
    tourneyControl.findTourneys() 
                 .then(function(tourneys){
                     res.render('../views/tourney/all-tourneys.hbs',{torney: tourneys})
                 })
                 .catch(console.log);
})

router.get('/my-tourneys',function(req,res,next){
    tourneyControl.findMyTourneys(req.user) 
                 .then(function(tourneys){
                     res.render('../views/tourney/my-tourneys.hbs',{torney: tourneys})
                 })
                 .catch(console.log);
})

router.use('/create-torney',userControl.isLoggedIn);
router.get('/create-torney',function(req,res,next){
    res.render('../views/tourney/create-tourney.hbs');
})

router.post('/create-torney',bodyParser.urlencoded({ extended: true }));
router.post('/create-torney',function(req,res,next) {
    tourneyControl.createTourney(req.body,req.user)
                 .then(function(newTorney){
                     res.redirect('/');
                 })
                 .catch(console.log);
})

router.post('/save-changes/:id',bodyParser.json(),function(req,res,next){
    tourneyControl.saveChanges(req.params.id,req.body)
                 .then(function(tourney){
                     res.sendStatus(200);
                 })
                 .catch(console.log);
})
router.get('/:id/edit',function(req,res,next){  
    tourneyControl.editTourney(req.params.id)
                  .then(function(tourney){
                      res.render('../views/tourney/edit-tourney.hbs',tourney)
                  })


})
router.get('/:id',function(req,res,next){
    tourneyControl.findTourney(req.params.id)
                 .then(function(tourney){
                    if(tourney.creatorUsername == res.locals.headerData.username){
                        tourney.myTourney = true;
                    };   
                    res.render('../views/tourney/single-tourney.hbs',tourney)
                 })
                 .catch(console.log);
})


module.exports = router;