module.exports = function(app, dbconn) {
    // The parameters must be uid and location
    app.post('/update_admin_checkout', function(req, res) {
        dbconn().then((db) => {
            // if document with argument id exists then update, otherwise return UID not found
            existenceCheck = db.collection('bowls').find({'volunteers.id': parseInt(req.body.uid)}).toArray(function(err, items) {
                if (items.length > 0) {
                    db.collection('bowls').updateOne({'volunteers.id': parseInt(req.body.uid)},
                        {
                            $set: {
                                'volunteers.$.checkout': req.body.checkout,
                            },
                        }
                    );
                    res.send('Successfully updated checkout');
                } else {
                    res.status(400);
                    res.send('Error: UID Not Found!');
                }
            });
        });
    });
};
