const Sequelize = require('sequelize');

const sequelize = require('../util/db');

const ApiKeys = sequelize.define('ApiKeys', {
    HashID : {
        type : Sequelize.STRING,
        allowNull: false
    },
    Key : {
        type : Sequelize.STRING,
        allowNull: false
    },  
});

module.exports = ApiKeys;