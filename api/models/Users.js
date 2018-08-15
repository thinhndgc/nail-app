/**
 * Users.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'users',
  primaryKey: 'id',
  attributes: {
    id: {
      type: 'number',
      allowNull: false,
      columnType: 'int',
      autoIncrement: true,
    },
    name: {
      type: 'string'
    },
    email: {
      type: 'string',
      isEmail: true,
    },
    password: {
      type: 'string',
      required: true
    },
    countryCode: {
      type: 'number',
      columnType: 'int',
      required: true
    },
    phoneNumber: {
      type: 'number',
      columnType: 'int',
      unique: true,
      required: true
    },
    gender: {
      type: 'number',
      columnType: 'int',
    },
    address: {
      type: 'string',
    },
    token: {
      type: 'string'
    },
    verifyCode: {
      type: 'number',
      columnType: 'int'
    },
    isVerifired: {
      type: 'number',
      columnType: 'int',
      defaultsTo: 0
    },
    createdAt: {
      type: 'number',
      autoCreatedAt: true
    },
    updatedAt: {
      type: 'number',
      autoUpdatedAt: true
    }
  },
  beforeCreate: function (values, proceed) {
    sails.helpers.hashPassword(values.password).exec((err, hashedPassword) => {
      if (err) {
        return proceed(err);
      }
      values.password = hashedPassword;
      return proceed();
    });
  }

};
