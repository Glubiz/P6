const fs = require('fs')
const Users = require('./../../../models/user')
const { Op } = require("sequelize");


const Link = () => {
    Users.findOne(
        {
            where: {
                [Op.and]: [
                    { Type: 'Pending' },
                    { HashID: null }
                ]
            }
        }
    )
    .then(User => {
        if(fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
            var Blockchain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
            if(Blockchain.Providers){
                Blockchain = Blockchain.Providers.filter(provider => provider.Email === User.Email)
        
                if(Blockchain.length > 0) {
                    Users.update({HashID : Blockchain.ProviderID}, {where: {Email: User.Email}})
                }
            }
        }
    })
}

setInterval(Link, 10000)

module.exports = Link