module.exports = function(app, dbconn) {
    // The parameters must be uid and location
    app.post('/update_admin_checkin', function(req, res) {
        dbconn().then((db) => {
            // if document with argument id exists then update, otherwise return UID not found
            existenceCheck = db.collection('bowls').find({'volunteers.id': parseInt(req.body.uid)}).toArray(function(err, items) {
                if (items.length > 0) {
                    db.collection('bowls').updateOne({'volunteers.id': parseInt(req.body.uid)},
                        {
                            $set: {
                                'volunteers.$.checkin': req.body.checkin,
                            },
                        }
                    );
                    res.send('Successfully updated checkin');
                } else {
                    res.status(400);
                    res.send('Error: UID Not Found!');
                }
            });
        });
    });
};
