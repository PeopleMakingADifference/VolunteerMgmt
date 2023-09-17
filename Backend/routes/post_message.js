const messaging = require('../messaging/messaging.js');
module.exports = function(app, dbconn) {
    // The parameter must be name 'message'
    app.post('/update_message', function(req, res) {
        dbconn().then((db) => {
            const msg = req.body.message;
            if (/[\\/&;<(*)>$=]/.test( msg )) {
                res.status(400);
                res.send('Invalid input!\n');
            } else {
                let sendOne = (req.body.toWho && (req.body.toWho !== 'All Volunteers'));
                console.log(msg);

                // Update bowl message if not sending to a single volunteer
                if (!sendOne) {
                    db.collection('bowls').updateOne(
                        {
                            'id': req.body.eventId.toUpperCase(),
                        },
                        {
                            $set: {
                                'message': msg,
                            },
                        }
                    ).catch((err) => console.error(err));
                }
                db.collection('bowls').find({
                    id: req.body.eventId.toUpperCase(),
                }).toArray((err, items)=>{
                    const payload = {
                        notification: {
                            title: 'PMD: ' + items[0].name,
                            body: 'New message: ' + msg
                        },
                    };

                    // Send to one or all?
                    if (sendOne) {
                        let uid = 0;
                        for (let item of items[0].volunteers) {
                            let name = item['firstname'] + ' ' + item['lastname'];
                            if (name === req.body.toWho) {
                                uid = item['id'];
                                break;
                            }
                        }
                        if (uid === 0) {
                            res.status(400);
                            res.send('Volunteer was not found!');
                            console.error('Volunteer not found: ', req.body.toWho);
                        } else {
                            messaging.messageOne(dbconn, uid, payload)
                            .then((response) => {
                                console.log(response);
                            })
                            .catch((err) => {
                                console.error('push error', err);
                            });
                            res.send('Successfully updated message to volunteer');
                        }
                    } else {
                        messaging.messageAll(dbconn, req.body.eventId.toUpperCase(), payload)
                        .then((response) => {
                            console.log(response);
                        })
                        .catch((err) => {
                            console.error('push error', err);
                        });
                        res.send('Successfully updated message');
                    }
                });
            }
        });
    });
};
