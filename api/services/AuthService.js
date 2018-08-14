const Constant = require('../constants/constant');
const jwt = require('../services/JWT');
const bcrypt = require('bcrypt');
module.exports = {
  /**
   * Authenticates user by email and password.
   * @param phone_number
   * @param password
   * @returns {Promise}
   */
  authenticateUserByPassword: function (phone_number, password) {
    return new Promise((resolve, reject) => {
      Users.findOne({
        phone: phone_number
      }).exec((err, user) => {
        if (err) return reject(err);
        if (!user) return reject(Constant.USER_NOT_FOUND_WITH_PHONE_NUMBER);
        AuthService.validatePassword(password, user.password).then(isValid => {
          if (isValid) {
            jwt.generateToken(user, token => {
              resolve(token);
            });
          } else {
            return reject(Constant.INVALID_PASSWORD);
          }
        });
      });
    });
  },
  validatePassword: function (password, dbPassword) {
    return bcrypt.compare(password, dbPassword);
  },
  authenticateUserByToken: function(token) {
    return new Promise((resolve, reject) => {
        jwt.verifyToken(token).then(decoded => {
            return resolve(decoded);
        }).catch(error => {
            return reject(error);
        });
    });
  }

};
