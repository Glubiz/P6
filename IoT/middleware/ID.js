const fs = require('fs')

var Identity = {
    ChainID: 0,
    APIKey: 0
}

const GetIdentity = async () => {
    try{
        fs.readFileSync('./middleware/General Storage/Keys.json')
        .then(Keys => {
            Identity.ChainID = Keys.ChainID
            Identity.APIKey = Keys.APIKey
        })
    } catch(e){
        await new Promise((resolve => setTimeout(resolve, 60 * 1000)))
        GetIdentity()
    }
}

GetIdentity()

module.exports = {Identity}

