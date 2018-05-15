var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');							// add to require mongoose
var dotenv = require('dotenv').config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// CONNECT TO MONGODB

mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00-fmlwn.mongodb.net:27017,cluster0-shard-00-01-fmlwn.mongodb.net:27017,cluster0-shard-00-02-fmlwn.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// connected
	console.log('Mongoose connected to MongoDB');
});


// CREATE SCHEMA

var goalieSchema = mongoose.Schema({
	name: {type: String, required:true},
	team: {type: String, required:false},
	handedness: {type: String, required:false},
	number: {type: Number, required: false}
});


// CREATE MODEL

var goalie = mongoose.model('goalie', goalieSchema);


// SET OBJECTS PROPERTIES

var g1 = new goalie({ name: "Patrick Roy", team: "Colorado Avalanche", handedness: "left", number: "33" });
var g2 = new goalie({ name: "Martin Brodeur", team: "New Jersey Devils", handedness: "left", number: "30" });
var g3 = new goalie({ name: "Mike Richter", team: "New York Rangers", handedness: "right", number: "35" });
var g4 = new goalie({ name: "Connor Hellebuyck", team: "Winnipeg Jets", handedness: "left", number: "37" });
var g5 = new goalie({ name: "Marc-Andre Fleury", team: "Las Vegas Knights", handedness: "right", number: "29" });
var g6 = new goalie({ name: "Tuuka Rask", team: "Boston Bruins", handedness: "left", number: "40" });
var g7 = new goalie({ name: "Andrei Vasilevsky", team: "Tampa Bay Lightning", handedness: "left", number: "28" });
var g8 = new goalie({ name: "Matt Murray", team: "Pittsburgh Penguins", handedness: "left", number: "30" });
var g9 = new goalie({ name: "Pekka Rinne", team: "Nashville Predators", handedness: "left", number: "35" });
var g10 = new goalie({ name: "Ken Dryden", team: "Montreal Canadiens", handedness: "right", number: "29" });
var g11 = new goalie({ name: "Brayden Holtby", team: "Washington Capitals", handedness: "left", number: "70" });
goaliesList = [ g1, g2, g3, g4, g5, g6, g7, g8, g9, g10, g11 ]


// SAVE TO MONGODB

// g1.save((e, goalieRecord)=>{			// save one
//   if (e){console.log(e)}				// log if error
//   console.log(goalieRecord);			// log if saved
// });

// goaliesList.forEach( function (g) {	// save all
// 	g.save((e, goalieRecord)=>{
// 		if (e){console.log(e)}
// 		console.log(goalieRecord); 
// 	});
// });


// QUERY MONGODB

// Try to create three queries of your own using any other operands besides lt which I have used above. To see the other operands you can use check out this doc: http://mongoosejs.com/docs/2.7.x/docs/query.html


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
