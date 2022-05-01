const Sequelize = require('sequelize');

const sequelize = new Sequelize('damibfko_bachelor', 'damibfko_iot', 'c@5fK*8DBhVl', {
    host: 'web1.netgiganten.dk',
    dialect: 'mysql'
});

module.exports = sequelize;