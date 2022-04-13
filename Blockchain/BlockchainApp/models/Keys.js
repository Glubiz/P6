const Sequelize = require('sequelize');

const sequelize = require('../util/db');

const ApiKeys = sequelize.define('ApiKeys', {
    ChainID : {
        type : Sequelize.STRING,
        allowNull: false
    },
    Key : {
        type : Sequelize.STRING,
        allowNull: false
    },  
});

module.exports = ApiKeys;