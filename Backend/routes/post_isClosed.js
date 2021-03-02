module.exports = function(app, dbconn) {
    app.post('/update_is_closed', function(req, res) {
        dbconn().then((db) => {
            const isClosed = req.body.isClosed;
            console.log('isClosed:', isClosed, 'eventId:', req.body.eventId);
            db.collection('bowls').updateOne(
                {
                    'id': req.body.eventId.toUpperCase(),
                },
                {
                    $set: {
                        'isClosed': isClosed,
                    },
                }
            ).catch((err) => console.error(err));
            res.send('Successfully updated isClosed');
        });
    });
};
