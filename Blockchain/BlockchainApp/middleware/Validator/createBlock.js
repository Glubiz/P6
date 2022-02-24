const fs = require('fs')
const hash = require('./hash')
const calculateNonce = require('./nonce')
const getPreviousBlock = require('./previousBlock')

function createGenesis(){
    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var dateTime = new Date().getTime().toString()

    // Instantiate the new chain with the ID, and the timestamp. All the blocks are added to the data array in the block
    var chain = 
    {
        Chain : "Validator",
        instantiated : dateTime,
        data : []
    }

    // Loads the genesis data into the block with key value pairs to be ready to be sent to the blockchain
    var block = {
        'index' : 0, 
        'nonce' : 1,
        'chainID' : "Genesis",
        'IP' : "127.0.0.1",
        'port' : '0000',
        'hash' : hash("0", "1", "Genesis" , "127.0.0.1", "0000", "None", dateTime),
        'previousHash' : "None",
        'timeStamp' : dateTime,
        'validatorCandicate' : false
    }

    // Adds the block to the chain
    chain.data.push(block)

    // Creates and writes the blockchain to the json file belonging to the correct household
    fs.writeFileSync('./Blockchain/Validator.json', JSON.stringify(chain, null, 4))
}

function createBlock(chainID, ip, port) {
    // Checks if the blockchain is created before adding the new block
    try {
        if (fs.existsSync('./Blockchains/Validator.json')) {
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var snapshot = fs.readFileSync('./Blockchains/Validator.json')
            var json = JSON.parse(snapshot)
            var chain = json
            var index = chain.data.length + 1

            // Calls the getPreviousBlock function to collect the hash of the previous block
            var previousBlock = getPreviousBlock(chainID)
            var previousHash = previousBlock.hash
            
            // Calls the nonce function to get to calculate the nonce of the block and thereby making the block immutable
            var nonce = calculateNonce(chainID)

            // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
            var dateTime = new Date().getTime().toString()

            // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
            var block = {
                'index' : index, 
                'nonce' : nonce,
                'chainID' : chainID,
                'IP' : ip,
                'port' : port,
                'hash' : hash(index.toString(), nonce, chainID, port.toString(), previousHash, dateTime.toString()),
                'previousHash' : previousHash,
                'timeStamp' : dateTime,
                'validatorCandicate' : false
            }

            // Adds the block to the chain
            chain.data.push(block)

            // Writes the updated blockchain to the json file belonging to the correct household
            fs.writeFileSync('./Blockchains/Validator.json', JSON.stringify(chain, null, 4))
        } else {
            // Loads the genesis block, this is only done once
            createGenesis()

            // Recalls the createBlock function to add the block containing the data to the newly created chain
            createBlock(chainID, ip, port)
        }
    } catch(err) {
        console.log(err)
    }
}



// module.exports = createBlock()