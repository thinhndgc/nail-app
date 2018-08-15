const jwt = require('../services/JWT');
const bcrypt = require('bcrypt');
const constant = require('../constants/constant');
module.exports = {
  /**
   * Authenticates user by email and password.
   * @param phone_number
   * @param password
   * @returns {Promise}
   */
  authenticateUserByPassword: function (countryCode, phoneNumber, password) {
    return new Promise((resolve, reject) => {
      Users.findOne({
        countryCode: countryCode,
        phoneNumber: phoneNumber
      }).exec((err, user) => {
        if (err) return reject(err);
        if (!user) return reject(constant.USER_NOT_FOUND_WITH_PHONE_NUMBER);
        AuthService.validatePassword(password, user.password).then(isValid => {
          if (isValid) {
            jwt.generateToken(user, token => {
              Users.update({
                id: user.id
              }).set({
                token: token
              }).exec((err, updated) => {
                if (err) return reject(err);
                resolve(token);
              });
            });
          } else {
            return reject(constant.INVALID_PASSWORD);
          }
        });
      });
    });
  },
  validatePassword: function (password, dbPassword) {
    return bcrypt.compare(password, dbPassword);
  },
  authenticateUserByToken: function (token) {
    return new Promise((resolve, reject) => {
      jwt.verifyToken(token).then(decoded => {
        Users.findOne({
          id: decoded.id
        }).exec((err, user) => {
          if (err) {
            sails.log.error(error);
            return reject(constant.SYSTEM_ERROR);
          }
          if (!user) {
            return reject(constant.INVALID_TOKEN);
          }
          if (!_.isEqual(user.token, token)) {
            return reject(constant.INVALID_TOKEN);
          }
          return resolve(decoded);
        });
      }).catch(error => {
        sails.log.error(error);
        return reject(constant.SYSTEM_ERROR);
      });
    });
  },
  clearUserCredentials: function(id) {
    return new Promise((resolve, reject) => {
      Users.findOne({
        id: id
      }).exec((err, user) => {
        if (err) return reject(constant.SYSTEM_ERROR);
        if (!user) return reject(constant.USER_NOT_FOUND);
        Users.update({
          id: id
        }).set({
          token: ''
        }).exec((err, updated) => {
          if (err) return reject(constant.SYSTEM_ERROR);
          return resolve(updated);
        });
      });
    });
  }
};