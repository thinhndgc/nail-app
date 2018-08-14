/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const authService = require('../services/AuthService');

var passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator();
passwordSchema.is().min(8)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().not().spaces();

module.exports = {
  login: function (req, res) {
    var phone = req.body.phone;
    var password = req.body.password;

    authService.authenticateUserByPassword(phone, password).then(token => {
        res.json({
          token: token
        });
      })
      .catch(err => {
        return res.json({
          error: err
        });
      });
  },
  checkToken: function (req, res) {
    var token = req.body.token;
    authService.authenticateUserByToken(token).then(decoded => {
        res.json({
            token: decoded
        });
    }).catch(err => {
        res.json({
            error: err
        });
    });
  },
  logout: function (req, res) {

  }
};
