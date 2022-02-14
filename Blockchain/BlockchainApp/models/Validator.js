const Sequelize = require('sequelize');

const sequelize = require('../util/db');

const Validator = sequelize.define('Validator', {
  Hash : {
    type: Sequelize.STRING,
    allowNull: false
    },
  PreviousHash : {
    type: Sequelize.STRING,
    allowNull: false
    },
  Nonce : {
    type: Sequelize.INTEGER,
    allowNull: false
    },
  ChainID : {
    type: Sequelize.STRING,
    allowNull: false
    },
  Key : {
    type: Sequelize.STRING,
    allowNull: false
    },
});

module.exports = Validator;