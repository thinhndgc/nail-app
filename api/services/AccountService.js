const constant = require('../constants/constant');
const smsService = require('../services/SmsService');

module.exports = {
    createCustomerAccount: function (countryCode, phoneNumber, password) {
        return new Promise((resolve, reject) => {
            Users.count({
                countryCode: countryCode,
                phoneNumber: phoneNumber
            }).exec((err, result) => {
                if (err) {
                    sails.log.error(err);
                    return reject(constant.SYSTEM_ERROR);
                }

                if (result > 0) {
                    return reject(constant.PHONE_NUMBER_EXISTED);
                }

                var verifyCode = this.generateVerifyCode();
                Users.create({
                    countryCode: countryCode,
                    phoneNumber: phoneNumber,
                    password: password,
                    verifyCode: verifyCode
                }).fetch().exec((err, user) => {
                    if (err) {
                        sails.log.error(err);
                        return reject(constant.SYSTEM_ERROR);
                    }
                    smsService.sendVerifyCode(countryCode, phoneNumber, verifyCode);
                    resolve(user);
                });
            });
        });
    },
    resendVerifyPhoneCode: function (id) {
        return new Promise((resolve, reject) => {
            sails.log.info('Resend verify phone code for user id ' + id);
            Users.findOne({
                id: id
            }).exec((err, user) => {
                if (err) {
                    sails.log.error(err);
                    return reject(constant.SYSTEM_ERROR);
                }
                if (!user) return reject(constant.USER_NOT_FOUND);
                var verifyCode = this.generateVerifyCode();
                Users.update({
                    id: id
                }).set({
                    verifyCode: verifyCode,
                    isVerifired: 0
                }).fetch().exec((err, user) => {
                    if (err) {
                        sails.log.error(err);
                        return reject(constant.SYSTEM_ERROR);
                    }
                    var countryCode = user[0].countryCode;
                    var phoneNumber = user[0].phoneNumber;
                    smsService.sendVerifyCode(countryCode, phoneNumber, verifyCode);
                    return resolve(constant.STATUS_OK);
                });
            });
        });
    },
    verifyPhoneNumber: function (id, verifyCode) {
        return new Promise((resolve, reject) => {
            sails.log.info('Verify phone number for user id ' + id + ' with verify code ' + verifyCode);
            Users.findOne({
                id: id
            }).exec((err, user) => {
                if (err) {
                    sails.log.error(err);
                    return reject(constant.SYSTEM_ERROR);
                }
                if (!user) return reject(constant.USER_NOT_FOUND);
                if (user.isVerifired === 1) return reject(constant.USER_VERIFIRED);
                if (verifyCode === user.verifyCode) {
                    Users.update({
                        id: id
                    }).set({
                        verifyCode: 0,
                        isVerifired: 1
                    }).fetch().exec((err, user) => {
                        if (err) {
                            sails.log.error(err);
                            return reject(constant.SYSTEM_ERROR);
                        }
                        sails.log.info('updated verify status for user id ' + user[0].id);
                        return resolve(constant.STATUS_OK);
                    });
                } else {
                    return reject(constant.INVALID_VERIFY_CODE);
                }
            });
        });
    },
    generateVerifyCode: function () {
        min = Math.ceil(1000);
        max = Math.floor(9999);
        return Math.floor(Math.random() * (max - min)) + min;
    }
};