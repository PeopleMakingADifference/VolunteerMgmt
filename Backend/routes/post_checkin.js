module.exports = function(app, dbconn) {
  const sms = require('../messaging/sms.js');
  // The parameter must be name 'checkout'
  app.post('/update_checkin', function(req, res) {
      dbconn().then((db) => {
        // Make sure phone number is only digits
        const phoneNum = res.body.phone.replace(/\D/g,'');

        // if document with argument phone exists then update, otherwise return UID not found
        db.collection('bowls').find(
          {
            'id': req.body.eventId.toUpperCase(),
            'volunteers.phone': parseInt(phoneNum),
          },
          {
            'volunteers.$': 1,
          }
        ).toArray((err, items) => {
          if (items.length > 0) {
            if (items[0].isClosed===true) {
              res.status(400).send({'message': 'This event has been closed.'});
              return;
            } else {
              // The above find produces all volunteers for the event...
              for (let v of items[0].volunteers) {
                if (v.phone === parseInt(phoneNum)) {
                  if (!v.checkin) {
                    db.collection('bowls').updateOne(
                      {
                        'id': req.body.eventId.toUpperCase(),
                        'volunteers.phone': parseInt(phoneNum),
                      },
                      {
                        $set: {'volunteers.$.checkin': Date.now()},
                      }
                    );
                  } else if (v.checkout) {
                    res.status(400).send({'message': 'You have already checked out from this event.'});
                    return;
                  }

                  // send only the data we need to send
                  const {id, firstname, lastname} = v;

                  // send the sms verification token
                  sms(dbconn, phoneNum, id, req.body.debug);

                  res.send({'id': id, 'name': firstname + ' ' + lastname});
                  return;
                }
              }
            }
            res.status(400).send({'message': 'Error - no volunteer found for this event with this phone number.'});
          }
        });
      });
  });
};
