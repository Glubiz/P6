const fs = require('fs');
const axios = require('axios')
const hash = require('./Hash')

//Constants
const Server = require('../../../util/server')

const PriceFunctions = () => {
    const Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    axios({
        method: 'post',
        url: Server + "Price",
        params: {
            APIKey : Self.APIKey
        },
    })
    .then(result => {
        console.log(result)
        if (result.data.length > Chain.PriceFunctions.length){
            for(let data in result.data){
                var Hash = hash(data.EventHash + data.ProviderID, data.PreviousHash, data.DateTime)
                if(Hash != data.Hash){
                    break
                }

                if (data.Hash == result.data[result.data.length - 1]){
                    Chain.PriceFunctions = result.data
                    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
                }
            }
        }
    })
}

setInterval(PriceFunctions, 30 * 1000)

module.exports = PriceFunctions