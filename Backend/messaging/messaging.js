const { applicationDefault, initializeApp } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');

if (process.env.TRAVIS_MODE === 'True') {
  // const serviceAccount = "nothing, there's no API KEY";
} else {
  initializeApp({
    credential: applicationDefault(),
    databaseURL: "https://people-making-a-difference.firebaseio.com"
  });
}

module.exports = {
  messageOne: function(dbconn, uid, payload) {
    return new Promise((resolve, reject) => {
      dbconn().then((db) => {
        db.collection('bowls').find(
          {
            'volunteers': {
              $elemMatch: {
                id: uid,
                token: {
                  $exists: true,
                },
              },
            },
          },
          {
            'volunteers.$': 1,
          }
        ).toArray((err, items) => {
          if (items.length === 1) {
            for (let v of items[0].volunteers) {
              if (v.id === uid) {
                let message = payload;
                message.token = v.token;
                getMessaging().send(message)
                .then((response) => {
                  resolve(response);
                  return;
                })
                .catch((err) => {
                  reject(err);
                  return;
                });
              }
            }
          }
        });
      });
    });
  },

  messageAll: function(dbconn, eventId, payload, filter = () => true ) {
    return new Promise((resolve, reject) => {
      dbconn().then((db) => {
        db.collection('bowls').find(
          {
            'id': eventId,
          }
        ).toArray((err, items) => {
          if (items.length === 1) {
            // this will resolve a promise whether it rejects or resolves with no errors
            const reflect = function(promise) {
              return promise.then(
                function() {
                  return {status: 'resolved'};
                },
                function(reason) {
                  return {status: 'rejected', reason: reason};
                });
            };
            let pushPromises = [];
            for (let volunteer of items[0].volunteers) {
              let message = payload;
              message.token = volunteer.token;
              if (token && filter(volunteer)) {
                pushPromises.push(getMessaging().send(message));
              }
            }
            // await all the push notification attempts
            // it is ok and expected if some of them fail
            Promise.all(pushPromises.map(reflect))
            .then((results) => {
              let rejections = results.filter((x) => x.status === 'rejected');
              // eslint-disable-next-line guard-for-in
              for (rejected in rejections) {
                console.log('Rejection reason: ${rejected.reason}');
              }
              resolve(`Attempted to send ${results.length}, ${results.filter((x) => x.status === 'resolved').length} succeeded.`);
              return;
            })
            .catch((err) => {
              reject(err);
              return;
            });
          }
        });
      });
    });
  },
};
