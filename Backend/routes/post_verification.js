module.exports = function(app, dbconn) {
  app.post('/verification', function(req, res) {
    dbconn().then((db) => {
      db.collection('bowls').find(
        {
          'volunteers': {
            $elemMatch: {
              id: parseInt(req.body.uid),
              verif_code: req.body.verif_code,
            },
          },
        },
        {
          'volunteers.$': 1,
        }
      ).toArray((err, items) => {
        if (items.length === 1) {
          for (let v of items[0].volunteers) {
            if (v.verif_code === req.body.verif_code) {
              res.send({'response': 'Ok, you\'re verified.'});
              return;
            }
          }
        }
        res.status(400);
        res.send('Error: Verification Incorrect!');
      });
    });
  });
};

