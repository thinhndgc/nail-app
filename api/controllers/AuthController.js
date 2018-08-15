/**
 * AuthController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const authService = require('../services/AuthService');
const error = require('../services/ErrorUtils');
const moment = require('moment');
const constant = require('../constants/constant');

var passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator();
passwordSchema.is().min(8).has().not().spaces();

module.exports = {
  login: function (req, res) {
    var countryCode = req.body.countryCode;
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;
    if (!countryCode || !phoneNumber || _.isEmpty(password)) {
      return res.badRequest(error.toJsonErr(constant.REQUIRED_LOGIN_FILEDS));
    }
    if (!passwordSchema.validate(password)) {
      return res.badRequest(error.toJsonErr(constant.INVALID_PASSWORD_FORMAT));
    }

    authService.authenticateUserByPassword(countryCode, phoneNumber, password).then(token => {
        res.ok({
          token: token
        });
      })
      .catch(err => {
        sails.log.error(err);
        res.badRequest(error.toJsonErr(err));
      });
  },
  checkToken: function (req, res) {
    var token = req.body.token;
    if (_.isEmpty(token)) {
      return res.badRequest(error.toJsonErr(constant.REQUIRED_TOKEN));
    }
    authService.authenticateUserByToken(token).then(decoded => {
      var expTime = decoded.exp;
      if (moment().isAfter(moment.unix(expTime))) {
        res.badRequest(error.toJsonErr(constant.EXPIRED_TOKEN));
      } else {
        res.ok({
          id: decoded.id,
          exp_time: moment.unix(expTime).format(constant.DATE_FORMART_FULL_DATE)
        });
      }
    }).catch(err => {
      sails.log.error(err);
      res.forbidden(error.toJsonErr(err));
    });
  },
  logout: function (req, res) {
    var id = req.body.id;  
    if (Number.isInteger(id)) {
      return res.badRequest(error.toJsonErr(constant.INVALID_USER_ID));
    }
    if (id <= 0) {
      return res.badRequest(error.toJsonErr(constant.REQUIRED_USERID));
    }
    authService.clearUserCredentials(id).then(function () {
      return res.ok({
        status: constant.STATUS_OK
      });
    }).catch(err => {
      switch (err) {
        case constant.USER_NOT_FOUND:
          return res.badRequest(error.toJsonErr(err));
        case constant.SYSTEM_ERROR:
          return res.serverError(error.toJsonErr(err));
        default:
          return res.serverError(error.toJsonErr(err));
      }
    });
  }
};