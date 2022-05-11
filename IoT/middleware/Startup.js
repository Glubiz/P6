const fs = require('fs')
const axios = require('axios')
const Server = require('./../util/server.js')

const Startup = () => {
    console.log("Start")
    if(!fs.existsSync('./middleware/Storage/Keys.json')){
        var ip
        axios
        .get('https://api.ipify.org/?format=json')
        .then(async Data =>  {
            ip = Data.data.ip
            await new Promise((resolve => setTimeout(resolve,5000)))

            axios({
                method: 'post',
                url: Server + 'addNode',
                data: {
                    IP : ip,
                    AreaCode : '9000'
                },
            })
            .then(async response => {
                var KeyStorage = {
                    ChainID : response.data.ChainID,
                    APIKey : response.data.APIKey
                }
                fs.writeFileSync('./middleware/Storage/Keys.json', JSON.stringify(KeyStorage, null, 4))

                await new Promise((resolve => setTimeout(resolve,5000)))
                axios({
                    method: 'post',
                    url: Server + 'fetchTruncatedChain',
                    params: {
                        APIKey : response.data.APIKey,
                        AreaCode : '9000'
                    },
                })
                .then(result => {
                    result = result.data
                    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(result, null, 4))
                })
            })
        })
    }
}

module.exports = Startup()