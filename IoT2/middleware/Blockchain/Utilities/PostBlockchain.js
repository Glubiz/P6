const fs = require('fs')
const axios = require('axios')

const Server = require('../../../util/server')

const PostBlockchain = () => {
    var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    axios({
        method: 'post',
        url: Server + "LogBlockchain",
        params: {
            APIKey : Self.APIKey,
            Blockchain : JSON.stringify(Chain)
        },
    }).then(response => {
        console.log('OK')
    }).catch(err => console.log(err))
}

setInterval(PostBlockchain, 30 * 1000)

module.exports = PostBlockchain