const fs = require('fs');
const axios = require('axios')

//Constants
const Server = require('../../../util/server')

const SendPayload = require('./../../MQTT/SendPayload')

//This function pings the cloud to get the updated prices ever 30 seconds. 
const ServerData = () => {
    console.log('Requesting server for pricefunction or providers')
    var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

    axios({
        method: 'post',
        url: Server + "Data",
        params: {
            APIKey : Self.APIKey
        },
    })
    .then(result => {
        console.log(result.data.length)
        if (result.data){
            var temp = {
                Type: result.data.Type, 
                ID : Self.ID, 
                TimeStamp: result.data.TimeStamp.toString(), 
                Top: result.data.Top, 
                Bottom: result.data.Bottom
            }
            console.log(temp)

            SendPayload(JSON.stringify(temp), 'PendingBlock')
        }
    })
    .catch(err => console.log(err))
}

setInterval(ServerData, 30 * 1000)

module.exports = ServerData