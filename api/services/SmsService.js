const twilio = require('twilio');
const constant = require('../constants/constant');

module.exports = {
    sendVerifyCode: function (countryCode, phoneNumber, verifyCode) {
        return new Promise((resolve, reject) => {
            var sendTo = '+' + countryCode + phoneNumber;
            sails.log.info('Sending verify code ' + verifyCode +' to ' + sendTo);
            var sendFrom = sails.config.appConfig.twilio.send_from_phone_number;
            var msg = constant.VERIFY_SMS_BODY + verifyCode;
            var accountSid = sails.config.appConfig.twilio.sid;
            var authToken = sails.config.appConfig.twilio.auth_token;
            var client = new twilio(accountSid, authToken);
            client.messages.create({
                from: sendFrom,
                body: msg,
                to: sendTo
            }).then(message => {
                resolve(message);
            }).done();
        });
    }
};