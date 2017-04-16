let mongoose = require('mongoose');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let connection = 'localhost:27017/tourney';

let sessionConfig = {
  secret: 'sharingan',
  resave: false, 
  saveUninitialized: true,
  store: new MongoStore({mongooseConnection: mongoose.connection,touchAfter: 24 * 3600}),
  cookie: {maxAge: 180 * 60 * 1000}
  }

  module.exports = function mongooseConnect(){
      mongoose.connect(connection);
      return session(sessionConfig)
  }
  