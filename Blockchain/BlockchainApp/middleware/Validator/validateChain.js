const fs = require('fs')
const hash = require('./hash')
// const nonce = require('./nonce')
const paths = require('../../util/blockchainPath');

// module.exports = 
function validateChain(){
    var now = new Date().getTime().toString()
    // Loads the blockchain into the chain variable
    var chain = JSON.parse(fs.readFileSync(paths.path))

    // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
    for (let i = 0; i < chain.nodes.length; i++){
        var data = chain.nodes[i]
        if (now - parseInt(data.timeStamp) >= 10080 && !data.validaterCandidate && !data.blocked){
            //Skal opdatere json filen
            data.validaterCandidate = true
            fs.writeFileSync(paths.path, JSON.stringify(chain, null, 4))
        }

        var Hash = hash(data.index.toString(), data.nonce.toString(), data.chainID + data.port, data.previousHash, data.timeStamp)
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