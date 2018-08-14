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
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      unique: true,
      isEmail: true,
      required: false
    },
    password: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'number',
      columnType: 'int',
      unique: true,
      required: true
    },
    gender: {
      type: 'number',
      columnType: 'int',
      required: true
    },
    address: {
      type: 'string',
      required: true
    },
    createdAt: {
      type: 'number',
      autoCreatedAt: true
    },
    updatedAt: {
      type: 'number',
      autoUpdatedAt: true
    },

  },

  /**
   * Encrypt password before creating a User
   * @param values
   * @param proceed
   */
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
