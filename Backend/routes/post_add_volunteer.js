module.exports = function(app, dbconn) {
    app.post('/add_volunteer', function(req, res) {
        dbconn().then((db) => {
            let data = {};
            // start by finding the bowl which has the volunteer with the highest ID
            db.collection('bowls').find().sort({'volunteers.id': -1}).limit(1).toArray(function(err, bowls) {
                let maxId = 0;
                if (bowls.length > 0) {
                    // of the bowl that has the volunteer with the highest id, actually find that id and save it
                    for (let item of bowls[0]['volunteers']) {
                        if (item['id'] > maxId) {
                            maxId = item['id'];
                        }
                    }
                }
                maxId += 1;
                data.id = maxId;
                data.name = req.body.volunteerName;
                data.email = req.body.volunteerEmail;
                data.assignment = req.body.volunteerAssignment;
                data.location = req.body.volunteerLocation;
                data.checkout = false;
                data.checkin = false;
                data.phone = req.body.volunteerPhone;

                db.collection('bowls').update(
                    {
                        'id': req.body.bowlID.toUpperCase(),
                    },
                    {
                        $push: {
                            'volunteers': data,
                        },
                    }
                ).catch((err) => {
                    res.status(400).send({'message': 'Error adding volunteer to database'});
                    console.error(err);
                    db.close();
                    return;
                });
                res.send({'message': 'Successfully updated volunteers'});
                db.close();
            });
        });
    });
};
