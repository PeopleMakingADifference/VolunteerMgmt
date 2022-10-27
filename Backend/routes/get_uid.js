module.exports = function(app, dbconn) {
    app.get('/uid/:uid', function(req, res) {
        dbconn().then((db) => {
            result = db.collection('bowls').find({'volunteers.id': parseInt(req.params.uid)}, {'volunteers.$': 1}).toArray(function(err, items) {
                if (items.length > 0) {
                    // send only the minimum data the frontend needs
                    for (let v of items[0].volunteers) {
                        if (v.id === parseInt(req.params.uid)) {
                            const {name, assignment, location} = v;
                            res.send({
                                'name': name,
                                'assignment': assignment,
                                'location': location,
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

