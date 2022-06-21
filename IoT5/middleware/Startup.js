const fs = require('fs')
const SHA256 = require('crypto-js/sha256');
const axios = require('axios')
const Server = require('./../util/server.js')
const SendPayload = require('./MQTT/SendPayload')


//This function is one run once in the lifetime of the node.
//It pings the server to get the API key needed to reach the API's in the cloud, and the ID. Furthermore it gets the latest updated chain from the cloud and sends it the the other nodes in the area.
const Startup = () => {
    console.log("Start")
    if(!fs.existsSync('./middleware/Storage/Keys.json')){
        var ip
        axios
        .get('https://api.ipify.org/?format=json')
        .then(async Data =>  {
            ip = Data.data.ip
            var Now = new Date().getTime().toString()
            var ID = SHA256(ip + Now).toString()
            
            
            await GetAPIKey(ID) 
            await new Promise((resolve => setTimeout(resolve,2000)))

            SendPayload(JSON.stringify({ID : ID}), 'RequestChain')
            console.log('Request sent')
            await new Promise((resolve => setTimeout(resolve,10000)))
            if(!fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
                console.log('No response from other nodes, resorting to fallback mode')
                Fallback(ID)
            } else {
                SendPayload(JSON.stringify({Type: 'Create Node', ID : ID, TimeStamp: new Date().getTime().toString()}), 'PendingBlock')
            }
        })
    }
}

const GetAPIKey = async (ID) => {
    axios({
        method: 'post',
        url: Server + 'addNode',
        params: {
            ID : ID
        },
    })
    .then(async response => {
        var KeyStorage = {
            ID : ID,
            APIKey : response.data.APIKey
        }
        fs.writeFileSync('./middleware/Storage/Keys.json', JSON.stringify(KeyStorage, null, 4))
        return new Promise((resolve) => {
            console.log('API Key is created')
            resolve()
        });
    })
    .catch(e => {
        return new Promise((reject) => {
            reject(e)
        });
    })
}

const Fallback = async (ID) => {
    console.log('Fallback mode activated')
    var APIKey = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json')).APIKey
    
    await new Promise((resolve => setTimeout(resolve,5000)))
    axios({
        method: 'post',
        url: Server + 'fetchTruncatedChain',
        params: {
            APIKey : APIKey
        },
    })
    .then(result => {
        result = result.data
        fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(result, null, 4))
    })
}

module.exports = Startup()