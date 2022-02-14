const Sequelize = require('sequelize');

const sequelize = require('../util/db');

const Data = sequelize.define('Data', {
  Hash : {
    type: Sequelize.STRING,
    allowNull: false
    },
  PreviousHash : {
    type: Sequelize.STRING,
    allowNull: false
    },
  Nonce : {
    type: Sequelize.STRING,
    allowNull: false
    },
  Device : {
    type: Sequelize.STRING,
    allowNull: false
    },
  Data : {
    type: Sequelize.STRING,
    allowNull: false
    },
});

module.exports = Data;