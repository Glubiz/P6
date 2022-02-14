const hash = require('hash')
const validator = require('../../models/Validator')

function createBlock(previousHash, chainID = '0', key = '0') {
    if (chain.length){
        var dateTime = new Date().toString()
        var index = chain.length + 1

        // var block = {
        //     'index' : index, 
        //     'nonce' : "0",
        //     'chainID' : chainID,
        //     'key' : key,
        //     'hash' : hash(index.toString(), nonce, chainID, previousHash, dateTime.toString()),
        //     'previousHash' : previousHash,
        //     'timeStamp' : dateTime,
        // }
        // block = JSON.stringify(block, null, 4);
        // fs.writeFileSync(chainID.toString() + '.json', block);
    }
}

module.exports = createBlock()