module.exports = function(app, dbconn) {
    // The parameters must be named 'checkoutTime' & 'uid'
    app.post('/update_checkout_reminded', function(req, res) {
        dbconn().then((db) => {
            // check if the user id exists
            existenceCheck = db.collection('bowls').find(
                {
                    'volunteers.id': parseInt(req.body.uid),
                },
                {
                    'volunteers.$': 1,
                }
            ).toArray(function(err, items) {
                if (items.length > 0) {
                    for (let v of items[0].volunteers) {
                        // check that the user has checked in, but has not checked out
                        if (v.id === parseInt(req.body.id) && v.checkin && v.checkin > 0 &&
                            v.checkout == false) {
                            const [checkoutHour, checkoutMinute] = req.body.checkoutTime.split(':');
                            const checkinTime = new Date(v.checkin);
                            const checkinHour = checkinTime.getHours();

                            // start based on whatever the checkin time was
                            let checkoutTime = new Date(v.checkin);

                            // edge case: the volunteer was volunteering past midnight
                            if (checkoutHour < checkinHour) {
                                // try rolling the checkoutTime over to the next day
                                checkoutTime.setDate(checkinTime.getDate() + 1);
                            }

                            // adjust the time to be correct
                            checkoutTime.setHours(checkoutHour);
                            checkoutTime.setMinutes(checkoutMinute);

                            // edge case: past midnight AND it was the last day of the month
                            if (checkinTime.getTime() > checkoutTime.getTime()) {
                                // roll over the checkouttime to the next month
                                checkoutTime.setMonth(checkoutTime.getMonth() + 1);
                            }

                            // edge case: past midnight AND last day of month AND last day of the year
                            // some kind soul was volunteering on new year's eve
                            if (checkinTime.getTime() > checkoutTime.getTime()) {
                                // roll the year over
                                checkoutTime.setFullYear(checkoutTime.getFullYear() + 1);
                            }

                            db.collection('bowls').updateOne(
                                {
                                    'volunteers.id': parseInt(req.body.uid),
                                },
                                {
                                    $set: {
                                        'volunteers.$.checkout': checkoutTime.getTime(),
                                    },
                                }
                            );
                            res.send('Successfully Checked Out');
                            return;
                        } else if (v.id === parseInt(req.body.id)) {
                            res.status(400);
                            res.send('Error: You have already checked out!');
                            return;
                        }
                    }
                }
                res.status(400);
                res.send('Error: Incorrect UID or exit code.');
            });
        });
    });
};
