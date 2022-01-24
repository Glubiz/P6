const Sequelize = require('sequelize');

const sequelize = require('./../util/db');

const User = sequelize.define('User', {
  Username : {
    type: Sequelize.STRING,
    allowNull: false
    },
  Password : {
    type: Sequelize.STRING,
    allowNull: false
    },
  Phrase : {
    type: Sequelize.STRING,
    allowNull: false
    }
}, {
  createdAt: false,
  updatedAt: false
});

module.exports = User;