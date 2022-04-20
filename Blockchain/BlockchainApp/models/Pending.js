const Sequelize = require('sequelize');

const sequelize = require('../util/db');

const Pending = sequelize.define('Pending', {
    Type : {
        type : Sequelize.STRING,
        allowNull: false
    },
    UserID : {
        type : Sequelize.STRING,
        allowNull: true
    },  
    Date : {
        type : Sequelize.INTEGER,
        allowNull: false
    },
});

module.exports = Pending;