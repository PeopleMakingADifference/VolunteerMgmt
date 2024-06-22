module.exports = function(app, dbconn) {
    app.get('/uid/:uid', function(req, res) {
        dbconn().then((db) => {
            result = db.collection('bowls').find({'volunteers.id': parseInt(req.params.uid)}, {'volunteers.$': 1}).toArray(function(err, items) {
                if (items.length > 0) {
                    // send only the minimum data the frontend needs
                    for (let v of items[0].volunteers) {
                        if (v.id === parseInt(req.params.uid)) {
                            const {firstname, lastname, assignment, location} = v;
                            let tokenNeeded = 'yes';
                            if (v.token) {
                              tokenNeeded = 'no';
                            } else {
                              console.log('Token is needed! for uid:' + v.id);
                            }
                            // Return 'None' if assignment/location missing to avoid app errors
                            res.send({
                                'name': firstname + ' ' + lastname,
                                'assignment': !assignment ? 'None' : assignment,
                                'location': !location ? 'None' : location,
                                'tokenNeeded': tokenNeeded,
                            });
                            return;
                        }
                    }
                }
                res.status(400);
                res.send('Error: UID Not Found!');
            });
        });
    });
};

