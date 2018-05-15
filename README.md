# mongooseQuery
The goal of this assignment is to play with a MongoDB:
1. Connect to a database
2. Use mongoose to manipulate MongoDB objects
3. Gather lists of objects based on mongoose queries

## Set up environment
### Create express app
Use express generator (https://expressjs.com/en/starter/generator.html) to set up app
`$ npm install express-generator -g`

Change directory
`$ cd myapp`

Install dependencies:
`$ npm install`

Run the app:
`$ DEBUG=myapp:* npm start`

### Install mongoose
```shell
npm install mongoose
```
### Require mongoose
In `app.js` add:
```js
var mongoose = require('mongoose');
```

### Upload MongoDB credentials
Make a new file called `myapp/.env` which contains your username, password, and database name. If you would like you can use my database as an example:
```
DB_USER = rwuser
DB_PASS = us3node.js
DB_NAME = DesktopBackgrounds
```
#### Require dotenv
In `app.js` add:

```js
var dotenv = require('dotenv').config();
```

### Establish connection with MongoDB
In `app.js` add:
```js
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00-fmlwn.mongodb.net:27017,cluster0-shard-00-01-fmlwn.mongodb.net:27017,cluster0-shard-00-02-fmlwn.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
	// connected
	console.log('Mongoose connected to MongoDB');
});
```

Line by line using my db as an example:
```js
mongoose.connect(`mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00-fmlwn.mongodb.net:27017,cluster0-shard-00-01-fmlwn.mongodb.net:27017,cluster0-shard-00-02-fmlwn.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`);
```
*Feel free to use my example but understand that your hostname will vary based upon your instance | MongoDB's default port is 27017, per https://docs.mongodb.com/manual/reference/default-mongodb-port/*

Name the connection
```js
var db = mongoose.connection;
```

Setup error logging
```js
db.on('error', console.error.bind(console, 'connection error:'));
```

Setup succesful connection logging:
```js
db.once('open', function() {
	// connected
	console.log('Mongoose connected to MongoDB');
});
```
This line is no longer necessary with the latest version of mongoose

#### Common connection pitfalls
##### First time you run mongoDB on Mac OSX: 
`Error: couldn't connect to server [a bunch of numbers] at src/mongo/shell/mongo.js:145 exception:connect failed`
Resolution: https://stackoverflow.com/questions/7948789/mongodb-mongod-complains-that-there-is-no-data-db-folder?rq=1

##### Bad credentials error
```shell
connection error: { MongoError: authentication fail
    at /Users/pnicholas/Desktop/hes/wk7-8/mongooseQuery/myapp/node_modules/mongodb-core/lib/topologies/replset.js:1430:15
    at /Users/pnicholas/Desktop/hes/wk7-8/mongooseQuery/myapp/node_modules/mongodb-core/lib/connection/pool.js:877:7
    at /Users/pnicholas/Desktop/hes/wk7-8/mongooseQuery/myapp/node_modules/mongodb-core/lib/connection/pool.js:853:20
    at /Users/pnicholas/Desktop/hes/wk7-8/mongooseQuery/myapp/node_modules/mongodb-core/lib/auth/scram.js:207:20
    at /Users/pnicholas/Desktop/hes/wk7-8/mongooseQuery/myapp/node_modules/mongodb-core/lib/connection/pool.js:544:18
    at _combinedTickCallback (internal/process/next_tick.js:131:7)
    at process._tickCallback (internal/process/next_tick.js:180:9)
  name: 'MongoError',
  message: 'authentication fail',
  errors:
   [ { name: 'cluster0-shard-00-00-fmlwn.mongodb.net:27017',
       err: [Object] } ] }
(node:75592) UnhandledPromiseRejectionWarning: Unhandled promise rejection (rejection id: 1): MongoError: authentication fail
(node:75592) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

### Create Schema
Name the schema. Include properties of the object (ie. `goalies`), the SchemaType (http://mongoosejs.com/docs/api.html#types_Types), and whether or not that is a required property of the object:
```js
var goalieSchema = mongoose.Schema({
	name: {type: String, required:true},
	team: {type: String, required:false},
	handedness: {type: String, required:false},
	number: {type: Number, required: false}
});
```

### Create Model
Mongoose defines Models as, "Models are fancy constructors compiled from Schema definitions. An instance of a model is called a document. Models are responsible for creating and reading documents from the underlying MongoDB database." (http://mongoosejs.com/docs/models.html) In order to save your schema to a model
```js
var goalie = mongoose.model('goalie', goalieSchema);
```
you may want to create a separate module for your model to make it easier to reference throughout your app.
Go into MongoDB and create a new collection with the plural name of whatever you named your model. In my case this would be goalies.

### Set Objects Properties
```js
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
```

### Save to MongoDB
Save one
```js
c1.save((err, c)=>{
  if (err){console.log(err)}
  console.log("saved character!");
  console.log(c);
});
```
Save is a function available through mongoose that returns a promise. It will append a unwique `_id` property to each record Doc: http://mongoosejs.com/docs/api.html#model_Model-save

Save all. With a for loop:
```js
goaliesList.forEach( function (g) { // SAVE ALL
	g.save((e, goalieRecord)=>{
		if (e){console.log(e)}
		console.log(goalieRecord); 
	});
});
```

## Query MongoDb
Examples of queries:
```js
var query = goalie
	.where({ number: "30"}) // Find all w/ number 30
	.exec((err, goalie)=>{ // callback
		if (err){console.log(e)};
		console.log(goalie);
});

var query = goalie
	.where({ name: "Patrick Roy"}) // Find all w/ name 'Patrick Roy'
	.exec((err, goalie)=>{ // callback
		if (err){console.log(e)};
		console.log(goalie);
});
	
var query = goalie
	.where('number') // Find all w/ number < 30
	.lt(30)
	.exec((err, goalie)=>{ // callback
		if (err){console.log(e)};
		console.log(goalie);
});
```

For further expansion on this, try to create three queries of your own using any other operands besides lt which I have used above. To see the other operands you can use check out this doc: http://mongoosejs.com/docs/2.7.x/docs/query.html
