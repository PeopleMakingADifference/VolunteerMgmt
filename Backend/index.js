const express = require('express');
const app = express();
const mongodb = require('mongodb');
const bodyParser = require('body-parser'); // module used to parse POST parameters

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded( {extended: true} )); // support encoded bodies
app.use('/dashboard', express.static('static')); // Static file virtual path (where the dashboard gets served)
// app.get(/dashboard\/(dashboard|login|create-event)/, (req, res) => {
//   res.sendFile(`${__dirname}/static/index.html`);
// });

// CORS! Yes, really! For real!
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

let uri = '';
if (process.argv[2] == '--local' || process.argv[2] == '-l') {
    uri = 'mongodb://localhost:27017/pmd';
    console.log('Database set to local.');
} else if (process.argv[2] == '--prod' || process.argv[2] == '-p') {
    uri = process.env.MONGODB_ATLAS_URI;
    console.log('Database set to production.');
} else {
    console.log('Defaulted database to local. Use option --prod if production needed.');
    uri = 'mongodb://localhost:27017/pmd';
}

app.set('port', (process.env.PORT || 5000));

const client = new mongodb.MongoClient(uri, {useUnifiedTopology: true});

// package up the database connection into a promise to pass to our modularized backend components
const genericDatabaseConnection = () => {
    return new Promise((res, rej) => {
        if (!client.isConnected()) {
            client.connect(function(err) {
                if (err) {
                    client.close();
                    db = null;
                    rej(err);
                } else {
                    console.log('Client connected to server');
                    res(client.db());
                }
            });
        } else {
            res(client.db());
        }
    });
};

// define our routes, which are each defined in their own files in ./routes
const routes = [
    'get_message', 'get_uid', 'post_checkout', 'post_location', 'get_root', 'post_assignment', 'post_admin_checkout',
    'post_checkout', 'post_admin_checkin', 'post_checkin', 'post_message', 'post_token', 'post_verification', 'post_event',
    'post_checkout_reminder', 'post_checkout_reminded', 'post_event_deletion', 'post_isClosed', 'post_add_volunteer', 'post_delete_volunteer'];
// for each route, initialize that route by passing the express app and database connection function
for (let route of routes) {
    require(`./routes/${route}.js`)(app, genericDatabaseConnection);
}

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

process.on('SIGINT', function() {
    client.close();
    console.log('Databse connection closed');
    process.exit();
});
