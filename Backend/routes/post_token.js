module.exports = function(app, dbconn) {
  // The parameters must be uid and token
    app.post('/update_token', function(req, res) {
        dbconn().then((db) => {
            // if document with argument id exists then update, otherwise return UID not found
            db.collection('bowls').find({'volunteers.id': parseInt(req.body.uid)}).toArray(function(err, items) {
                if (items.length > 0) {
                    for (let v of items[0].volunteers) {
                        if (v.id === parseInt(req.body.uid)) {
                            db.collection('bowls').updateOne(
                                {
                                    'volunteers.id': parseInt(req.body.uid),
                                },
                                {
                                    $set: {
                                        'volunteers.$.token': req.body.token,
                                    },
                                }
                            );
                            res.send('Successfully updated token');
                            console.log('Successfully updated token for UID: ' + req.body.uid);
                            return;
                        }
                    }
                }
                res.status(400);
                res.send('Error: UID Not Found!');
            })
        })
    });
};
