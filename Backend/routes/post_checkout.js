/*

1) What we send the endpoint
User ID
(Event ID)
No additional data needed

2) What the endpoint does to the database
The endpoint updates the timestamp of the user, generated from the server

3) What the endpoint sends back on success and on an error
Success: Returns timestamp of checking out
If the endpoint send registers an error, then it will say “Error: UID not found”

*/
module.exports = function(app, dbconn) {
    // The parameter must be name 'checkout'
    app.post('/update_checkout', function(req, res) {
        dbconn().then((db) => {
            // if document with argument id exists then update, otherwise return UID not found
            existenceCheck = db.collection('bowls').find(
                {
                    'volunteers.id': parseInt(req.body.uid),
                    'exit_id': req.body.exitId.toUpperCase(),
                },
                {
                    'volunteers.$': 1,
                }
            ).toArray(function(err, items) {
                if (items.length > 0) {
                    if (items[0].isClosed===true) {
                        res.status(400);
                        res.send({'Error': 'This event has been closed.'});
                        return;
                    } else {
                        for (let v of items[0].volunteers) {
                            if (v.id === parseInt(req.body.uid)) {
                                if (!v.checkout) {
                                    db.collection('bowls').updateOne(
                                    {
                                        'volunteers.id': parseInt(req.body.uid),
                                        'exit_id': req.body.exitId.toUpperCase(),
                                    },
                                    {
                                        $set: {
                                            'volunteers.$.checkout': Date.now(),
                                        },
                                    });
                                    res.send('Successfully Checked Out');
                                } else {
                                    res.status(400);
                                    res.send('Error: You have already checked out!');
                                }
                                return;
                            }
                        }
                    }
                }
                res.status(400);
                res.send('Error: Incorrect UID or exit code.');
            });
        });
    });
};
