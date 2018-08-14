const bcrypt = require('bcrypt');

function generatePasswordWithHash(password) {
  return bcrypt.genSalt(10)
    .then((salt) => {
      return bcrypt.hash(password, salt);
    })
    .then(hash => {
      return Promise.resolve(hash);
    });
}

module.exports = {


  friendlyName: 'Password hash',


  description: 'Return a hased password',


  inputs: {
    password: {
      type: 'string',
      description: 'input password to hash',
      required: true
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {
    generatePasswordWithHash(inputs.password).then(hash => {
      return exits.success(hash);
    });
  }


};
