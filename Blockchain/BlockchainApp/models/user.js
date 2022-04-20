const Sequelize = require('sequelize');

const sequelize = require('./../util/db');

const User = sequelize.define('User', {
  Email : {
    type: Sequelize.STRING,
    allowNull: false
    },
  Password : {
    type: Sequelize.STRING,
    allowNull: false
    },
  Type : {
    type: Sequelize.STRING,
    allowNull: false
    }
}, {
  createdAt: false,
  updatedAt: false
});

module.exports = User;