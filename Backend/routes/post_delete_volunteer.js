module.exports = function(app, dbconn) {
    // The parameters must be uid
    app.post('/delete_volunteer', function(req, res) {
        dbconn().then((db) => {
            // if document with argument id exists then delete volunteer, otherwise return UID not found
            existenceCheck = db.collection('bowls').find({'volunteers.id': parseInt(req.body.uid)}).toArray(function(err, items) {
                if (items.length > 0) {
                    db.collection('bowls').updateOne({'volunteers.id': parseInt(req.body.uid)},
                        {
                            $pull: {
                                'volunteers': { 'id': parseInt(req.body.uid)},
                            },
                        }
                    );
                    res.send('Successfully deleted volunteer');
                } else {
                    console.error('UID NOT FOUND:', req.body.uid);
                    res.status(400);
                    res.send('Error: A User With That ID Was Not Found!');
                }
            });
        });
    });
};