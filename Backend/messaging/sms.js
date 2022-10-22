module.exports = function(dbconn, phone_num, uid, debug_mode){
    if(process.env.TRAVIS_MODE === "True"){
        return;
    }

    if(debug_mode === "true"){
        dbconn().then((db) => {
            db.collection('bowls').updateOne({'volunteers.id': parseInt(uid)},
            {
                $set: {
                    'volunteers.$.verif_code': '123456'
                },
            })
        });
    } else {
        const auth = {
            accountSid: process.env.TWILIO_ACC_ID,
            authToken: process.env.TWILIO_AUTH_TOKEN
        };
        // generate a string of 6 random numbers e.g. 301017
        let verif_num = "";
        for (let i = 0; i < 6; i++) {
            verif_num += parseInt(Math.random() * 10) + "";
        }

        // require the Twilio module and create a REST client
        const client = require('twilio')(auth.accountSid, auth.authToken);

        client.messages.create({
            to: phone_num,
            from: '+12083149864',
            body: 'Your PMD verification code is: ' + verif_num,
        })
        .then(message => console.log(message.sid))
        .catch(err => console.error(err));

        dbconn().then((db) => {
            db.collection('bowls').updateOne({'volunteers.id': parseInt(uid)},
            {
                $set: {
                    'volunteers.$.verif_code': verif_num,
                },
            })
        });
    }
}
