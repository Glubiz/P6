const fs = require('fs')
const axios = require('axios')

const Server = require('./../util/server.js')


const Alive = () => {
    var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    axios({
        method: 'post',
        url: Server + 'Ping',
        params: {
            ID : Self.ChainID,
            AreaCode : '9000'
        },
    })
    .then(response => {
        console.log(response.data)
        for (let Node of Chain.Area[0].Nodes){
            if(Node.NodeID === Self.ChainID){
                Node.Pings = response.data.Pings
                Node.PingUpdated = response.data.Now

                fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
            }
        }
    })
    .catch(err => console.log(err))
}

setTimeout(Alive, 60000)
setInterval(Alive, 900 * 1000)

module.exports = Alive