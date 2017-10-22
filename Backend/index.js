var express = require('express');
var app = express();
var mongodb = require('mongodb');
var bodyParser = require('body-parser'); // module used to parse POST parameters
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


if (process.argv[2] == "--local" || process.argv[2] == "-l") {
	var uri = 'mongodb://localhost:27017/pmd';
	console.log("Database set to local.");
} else if (process.argv[2] == "--prod" || process.argv[2] == "-p") {
	var uri = process.env.MONGODB_URI;
	console.log("Database set to production.");
} else {
	console.log("Defaulted database to local. Use option --prod if production needed.");
	var uri = 'mongodb://localhost:27017/pmd';
}

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get("/", function(req, res){
    console.log("getting all vols")
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    mongodb.MongoClient.connect(uri, function(err, db){
		if (err) throw err;
		result = db.collection('volunteers').find().toArray(function(err, items){
			console.log(items);
			res.send(items);
		});
		db.close();
	});
});

app.get("/:uid", function(req, res){
        console.log("getting vol by UID")
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        mongodb.MongoClient.connect(uri, function(err, db){
		if (err) throw err;
		console.log(req.params);
		result = db.collection('volunteers').find({id:parseInt(req.params.uid)}).toArray(function(err, items){
			if (items.length > 0){
				res.send(items);
			} else {
				res.send("Error: UID Not Found!");
			}
		});
		db.close();
	});
});

// The parameters must be uid and location
app.post("/update_location", function(req, res){
        console.log("updating location")
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	mongodb.MongoClient.connect(uri, function(err, db){
		if (err) throw err;
		// if document with argument id exists then update, otherwise return UID not found
		existence_check = db.collection('volunteers').find({"id" : parseInt(req.body.uid)}).toArray(function(err, items){
			if (items.length > 0){
				db.collection('volunteers').update({id:parseInt(req.body.uid)},
					{
		    			$set: {
		    					"location": req.body.location
		   	 				}
		  			})
					res.send("Successfully updated location");
				}
			else {
					res.send("Error: UID Not Found!");
				}
		});
	});
});


// The parameters must be uid and assignment
app.post("/update_assignment", function(req, res){
        console.log("updating assignment")
        console.log(req.body.uid)
        console.log(req.body.assignment)
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	mongodb.MongoClient.connect(uri, function(err, db){
		if (err) throw err;
		// if document with argument id exists then update, otherwise return UID not found
		existence_check = db.collection('volunteers').find({"id" : parseInt(req.body.uid)}).toArray(function(err, items){
			if (items.length > 0){
				db.collection('volunteers').update({id:parseInt(req.body.uid)},
					{
		    			$set: {
		    					"assignment": req.body.assignment
		   	 				}
		  			})
					res.send("Successfully updated assignment");
				}
			else {
					res.send("Error: UID Not Found!");
				}
		});
	});
});



app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
