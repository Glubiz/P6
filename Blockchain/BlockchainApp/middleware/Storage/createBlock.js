const fs = require('fs')
const hash = require('./hash')
const nonce = require('./nonce')
const getPreviousBlock = require('./previousBlock')

function createGenesis(chainID){
    var fileName = chainID + '.json'
    var dateTime = new Date().getTime().toString()
    var chain = 
    {
        chainID : chainID,
        instanciated : dateTime,
        data : []
    }

    var block = {
        'index' : 0, 
        'nonce' : 1,
        'data' : "Genesis",
        'hash' : hash("0", "1", "Genesis", "None", dateTime),
        'previousHash' : "None",
        'timeStamp' : dateTime,
    }

    chain.data.push(block)

    fs.writeFileSync('./Blockchains/' + fileName, JSON.stringify(chain, null, 4))
}

function createBlock(chainID, data) {
    var fileName = chainID + '.json'

    try {
        if (fs.existsSync('./Blockchains/' + fileName)) {
            var snapshot = fs.readFileSync('./Blockchains/' + fileName)
            var json = JSON.parse(snapshot)
            var chain = json
            var index = chain.data.length + 1
            var previousBlock = getPreviousBlock(chainID)
            var previousHash = previousBlock.hash
            var dateTime = new Date().getTime().toString()

            var block = {
                'index' : index, 
                'nonce' : nonce(chainID, index),
                'data' : data,
                'hash' : hash(index.toString(), nonce, chainID, previousHash, dateTime.toString()),
                'previousHash' : previousHash,
                'timeStamp' : dateTime,
            }
            chain.data.push(block)

            fs.writeFileSync('./Blockchains/' + fileName, JSON.stringify(chain, null, 4))
        } else {
            createGenesis(chainID)
        }
    } catch(err) {
        console.log(err)
    }

    
}

createBlock("123adasw", "llsdlfsaagg")

// module.exports = createBlock()