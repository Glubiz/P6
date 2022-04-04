const fs = require('fs')
const hash = require('./../Utilities/Hash')
// const nonce = require('./nonce')
const paths = require('../../util/blockchainPath');

// module.exports = 
function validateChain(){
    var now = new Date().getTime().toString()
    // Loads the blockchain into the chain variable
    var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

    // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
    for (let i = 0; i < Chain.Nodes.length; i++){
        var data = Chain.Nodes[i]
        if (now - parseInt(data.timeStamp) >= 10080 && data.Pings > 100){
            fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4))
        }
        var Hash = Hash(data.EventHash + data.ID, data.PreviousHash, data.DateTime)
        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            console.log(i)
            return i
        }
    }
    // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
    for (let i = 0; i < Chain.Areas.length; i++){
        var data = Chain.Areas[i]
        if (now - parseInt(data.timeStamp) >= 10080 && data.Pings > 100){
            fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4))
        }

        var Hash = Hash(data.EventHash + data.ID, data.PreviousHash, data.DateTime)

        if(Hash == data.Hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            console.log(i)
            return i
        }
    }
    return 200
}