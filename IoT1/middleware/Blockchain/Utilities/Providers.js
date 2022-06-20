const fs = require('fs');
const axios = require('axios')
const hash = require('./Hash')

//Constants
const Server = require('../../../util/server')

//This functions pings the cloud to get the providers every 30 seconds
const Providers = () => {
    const Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    if (Self.APIKey){
        axios({
            method: 'post',
            url: Server + "Providers",
            params: {
                APIKey : Self.APIKey
            },
        })
        .then(result => {
            if (result.data.Providers.length > Chain.Providers.length){
                for(let i = 0; i < result.data.Providers.length; i++){
                    var Hash = hash(result.data.Providers[i].EventHash + result.data.Providers[i].ProviderID, result.data.Providers[i].PreviousHash, result.data.Providers[i].TimeStamp)
                    if(Hash != result.data.Providers[i].Hash){
                        break
                    }
    
                    if (result.data.Providers[i].Hash == result.data.Providers[result.data.Providers.length - 1].Hash){
                        Chain.Providers = result.data.Providers
    
                        Chain.Events = result.data.Events
                        fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
                    }
                }
            }
        })
    }
}

setInterval(Providers, 30 * 1000)

module.exports = Providers