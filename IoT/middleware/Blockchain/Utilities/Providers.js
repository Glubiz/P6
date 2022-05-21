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
        console.log(result.data.Providers)
        if (result.data.Providers.length > Chain.Providers.length){
            for(let i = 0; i < result.data.Providers.length; i++){
                console.log(result.data.Providers[i])
                var Hash = hash(result.data.Providers[i].EventHash + result.data.Providers[i].ProviderID, result.data.Providers[i].PreviousHash, result.data.Providers[i].TimeStamp)
                if(Hash != result.data.Providers[i].Hash){
                    break
                }

                if (result.data.Providers[i].Hash == result.data.Providers[result.data.Providers.length - 1].Hash){
                    Chain.Providers = result.data.Providers
                    console.log(Chain)

                    Chain.Events = result.data.Events
                    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
                }
            }
        }
    })
}

setInterval(Providers, 30 * 1000)

module.exports = Providers