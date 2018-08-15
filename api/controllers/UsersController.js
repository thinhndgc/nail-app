/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const constant = require('../constants/constant');
const error = require('../services/ErrorUtils');
const accountService = require('../services/AccountService');

var passwordValidator = require('password-validator');
var passwordSchema = new passwordValidator();
passwordSchema.is().min(8).has().not().spaces();

module.exports = {
  createCustomerAccount: function (req, res) {
    var countryCode = req.body.countryCode;
    var phoneNumber = req.body.phoneNumber;
    var password = req.body.password;

    if (!countryCode || !phoneNumber || !password) {
      return res.badRequest(error.toJsonErr(constant.REQUIRED_CREAT_USER_FILEDS));
    }

    if (!passwordSchema.validate(password)) {
      return res.badRequest(error.toJsonErr(constant.INVALID_PASSWORD_FORMAT));
    }

    accountService.createCustomerAccount(countryCode, phoneNumber, password).then(user => {
      return res.ok(user);
    }).catch(err => {
      switch (err) {
        case constant.PHONE_NUMBER_EXISTED:
          return res.badRequest(error.toJsonErr(err));
        default:
          return res.serverError(error.toJsonErr(constant.SYSTEM_ERROR));
      }
    });
  },
  verifyPhoneNumber: function (req, res) {
    var id = req.body.id;
    var verifyCode = req.body.verifyCode;

    if (!id || !verifyCode) return res.badRequest(error.toJsonErr(constant.REQUIRED_VERIFY_PHONE_FILEDS));
    accountService.verifyPhoneNumber(id, verifyCode).then(status => {
      return res.ok({
        status: status
      });
    }).catch(err => {
      switch (err) {
        case constant.USER_NOT_FOUND:
          return res.badRequest(error.toJsonErr(err));
        case constant.INVALID_VERIFY_CODE:
          return res.badRequest(error.toJsonErr(err));
        case constant.USER_VERIFIRED:
          return res.badRequest(error.toJsonErr(err));
        default:
          return res.serverError(error.toJsonErr(constant.SYSTEM_ERROR));
      }
    });
  },
  resendVerifyPhoneCode: function (req, res) {
    var id = req.body.id;
    accountService.resendVerifyPhoneCode(id).then(status => {
      return res.ok({
        status: status
      });
    }).catch(err => {
      switch (err) {
        case constant.USER_NOT_FOUND:
          return res.badRequest(error.toJsonErr(err));
        default:
          return res.serverError(error.toJsonErr(constant.SYSTEM_ERROR));
      }
    });
  }

};