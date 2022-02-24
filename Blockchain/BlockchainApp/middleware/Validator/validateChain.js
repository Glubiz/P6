const fs = require('fs')
const hash = require('./hash')

// module.exports = 
function validateChain(){
    var now = new Date().getTime().toString()
    // Loads the blockchain into the chain variable
    var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))

    // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
    for(let data of chain.data){
        console.log(data)
        if (now - parseInt(data.timeStamp) >= 10080 && !data.validaterCandidate ){
            data.validaterCandidate = true
        }
        var Hash = hash(data.index.toString(), data.nonce.toString(), data.chainID, data.port, data.previousHash, data.timeStamp)
        if(Hash == data.hash){
            continue
        } else {
            //Skal indhente ledger fra noder til at validere chainen.
            console.log(data.index)
            return data.index
        }
    }
    return 200
}

validateChain()