let express = require('express');
let mongoose = require('mongoose');
let expressHbs = require('express-handlebars');
let session = require('./config/mongoose')();
let passport = require('passport');
let userController = require('./controls/user');

let index = require('./routes/index');
let users = require('./routes/users');
let tourney = require('./routes/tourney');
let app = express();

// view engine setup
app.engine('hbs', expressHbs({defaultLayout: 'layout.hbs',extname: '.hbs'}));
app.set('view engine', 'hbs');

//config
mongoose.Promise = global.Promise;
require('./config/passport')(passport)

// static files & middleware
app.use(session);
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(userController.getHeadersData);


// routes
app.use('/', index);
app.use('/users', users);
app.use('/tourney', tourney);








// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
