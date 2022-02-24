const fs = require('fs')
const hash = require('./hash')

module.exports = function validateChain(chainID){
    // Loads the blockchain into the chain variable
    var chain = JSON.parse(fs.readFileSync('./Blockchains/' + chainID + '.json'))

    // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
    for(let data of chain.data){
        var Hash = hash(data.index, data.nonce, data.data, data.previousHash, data.dateTime)
        if(Hash == data.hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            return data.index
        }
    }
    return 200
}