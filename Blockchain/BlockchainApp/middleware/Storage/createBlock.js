const fs = require('fs')
const hash = require('./hash')
const calculateNonce = require('./nonce')
const getPreviousBlock = require('./previousBlock')

function createGenesis(chainID){
    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var dateTime = new Date().getTime().toString()

    // Instantiate the new chain with the ID, and the timestamp. All the blocks are added to the data array in the block
    var chain = 
    {
        chainID : chainID,
        instantiated : dateTime,
        data : []
    }

    // Loads the genesis data into the block with key value pairs to be ready to be sent to the blockchain
    var block = {
        'index' : 0, 
        'nonce' : 1,
        'data' : "Genesis",
        'hash' : hash("0", "1", "Genesis", "None", dateTime),
        'previousHash' : "None",
        'timeStamp' : dateTime,
    }

    // Adds the block to the chain
    chain.data.push(block)

    // Creates and writes the blockchain to the json file belonging to the correct household
    fs.writeFileSync('./Blockchains/' + chainID + '.json', JSON.stringify(chain, null, 4))
}

function createBlock(chainID, data) {
    // Checks if the blockchain is created before adding the new block
    try {
        if (fs.existsSync('./Blockchains/' + chainID + '.json')) {
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var snapshot = fs.readFileSync('./Blockchains/' + chainID + '.json')
            var json = JSON.parse(snapshot)
            var chain = json
            var index = chain.data.length + 1

            // Calls the getPreviousBlock function to collect the hash of the previous block
            var previousBlock = getPreviousBlock(chainID)
            var previousHash = previousBlock.hash
            
            // Calls the nonce function to get to calculate the nonce of the block and thereby making the block immutable
            var nonce = calculateNonce(chainID, index)

            // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
            var dateTime = new Date().getTime().toString()

            // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
            var block = {
                'index' : index, 
                'nonce' : nonce,
                'data' : data,
                'hash' : hash(index.toString(), nonce, chainID, previousHash, dateTime.toString()),
                'previousHash' : previousHash,
                'timeStamp' : dateTime,
            }

            // Adds the block to the chain
            chain.data.push(block)

            // Writes the updated blockchain to the json file belonging to the correct household
            fs.writeFileSync('./Blockchains/' + chainID + '.json', JSON.stringify(chain, null, 4))
        } else {
            // Loads the genesis block, this is only done once
            createGenesis(chainID)

            // Recalls the createBlock function to add the block containing the data to the newly created chain
            createBlock(chainID, data)
        }
    } catch(err) {
        console.log(err)
    }
}



// module.exports = createBlock()