const fs = require('fs');
const axios = require('axios')
const hash = require('./Hash')

//Constants
const Server = require('../../../util/server')

const Providers = () => {
    const Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    axios({
        method: 'post',
        url: Server + "Providers",
        params: {
            APIKey : Self.APIKey
        },
    })
    .then(result => {
        if (result.data.length > Chain.Providers.length){
            for(let data in result.data){
                var Hash = hash(data.EventHash + data.ProviderID, data.PreviousHash, data.DateTime)

                if(Hash != data.Hash){
                    break
                }

                if (data.Hash == result.data[result.data.length - 1]){
                    Chain.Providers = result.data
                    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
                }
            }
        }
    })
}

setInterval(Providers, 30 * 1000)

module.exports = Providers