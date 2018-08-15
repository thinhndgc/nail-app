const farmhash = require('farmhash');
const jwt = require('jsonwebtoken');
const moment = require('moment');

module.exports = {
  generateToken: function (user, done) {
    const passwordHash = farmhash.hash32(user.password);

    const payload = {
      id: user.id,
      pwh: passwordHash
    };

    const token = jwt.sign(
      payload,
      sails.config.appConfig.jwt_secret, {
        expiresIn: '7 days'
      }
    );
    return done(token);
  },
  verifyToken: function (token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, sails.config.appConfig.jwt_secret, function (err, decoded) {
        if (err) return reject(err);
        return resolve(decoded);
      });
    });
  }
};