const fs = require('fs')
const hash = require('./hash')
const calculateNonce = require('./nonce')
const getPreviousBlock = require('./previousBlock')

const getPreviousNode = getPreviousBlock.getPreviousNode
const getPreviousPrice = getPreviousBlock.getPreviousPrice


function createGenesis(){
    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var dateTime = new Date().getTime().toString()

    // Instantiate the new chain with the ID, and the timestamp. All the blocks are added to the data array in the block
    var chain = 
    {
        Chain : "Validator",
        instantiated : dateTime,
        nodes : [],
        providers : [],
        prices : []
    }

    // Loads the genesis data into the block with key value pairs to be ready to be sent to the blockchain
    var block = {
        'index' : 0, 
        'nonce' : 1,
        'chainID' : "Genesis",
        'IP' : "127.0.0.1",
        'port' : '0000',
        'hash' : hash("0", "1", "Genesis", "None", dateTime),
        'previousHash' : "None",
        'timeStamp' : dateTime,
        'validaterCandidate' : false,
        'blocked' : false
    }

    // Adds the block to the chain
    chain.nodes.push(block)

    // Loads the genesis data into the block with key value pairs to be ready to be sent to the blockchain
    block = {
        'index' : 0, 
        'nonce' : 1,
        'providerID' : "Genesis",
        'hash' : hash("0", "1", "Genesis", "None", dateTime),
        'previousHash' : "None",
        'timeStamp' : dateTime,
        'blocked' : false
    }

    // Adds the block to the chain
    chain.providers.push(block)

    // Loads the genesis data into the block with key value pairs to be ready to be sent to the blockchain
    block = {
        'index' : 0, 
        'nonce' : 1,
        'providerID' : "Genesis",
        'price' : "0",
        'hash' : hash("0", "1", "Genesis", "None", dateTime),
        'previousHash' : "None",
        'timeStamp' : dateTime,
        'blocked' : false
    }

    // Adds the block to the chain
    chain.prices.push(block)
    // Creates and writes the blockchain to the json file belonging to the correct household
    fs.writeFileSync('./middleware/Validator/Blockchain/Validator.json', JSON.stringify(chain, null, 4))
}

function createNode(chainID, ip) {
    // Checks if the blockchain is created before adding the new block
    try {
        if (fs.existsSync('./middleware/Validator/Blockchain/Validator.json')) {
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var snapshot = fs.readFileSync('./middleware/Validator/Blockchain/Validator.json')
            var json = JSON.parse(snapshot)
            var chain = json
            var index = chain.nodes.length

            // Calls the getPreviousBlock function to collect the hash of the previous block
            var previousBlock = getPreviousNode()
            var previousHash = previousBlock.hash
            
            // Calls the nonce function to get to calculate the nonce of the block and thereby making the block immutable
            var nonce = calculateNonce('node')

            // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
            var dateTime = new Date().getTime().toString()

            // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
            var block = {
                'index' : index, 
                'nonce' : nonce,
                'chainID' : chainID,
                'IP' : ip,
                'port' : '4000',
                'hash' : hash(index.toString(), nonce, chainID + '4000', previousHash, dateTime.toString()),
                'previousHash' : previousHash,
                'timeStamp' : dateTime,
                'validaterCandidate' : false,
                'blocked' : false
            }

            // Adds the block to the chain
            chain.nodes.push(block)

            // Writes the updated blockchain to the json file belonging to the correct household
            fs.writeFileSync('./middleware/Validator/Blockchain/Validator.json', JSON.stringify(chain, null, 4))
            return new Promise((resolve, reject) => {
                resolve(200)
            });
        } else {
            // Loads the genesis block, this is only done once
            createGenesis()

            // Recalls the createBlock function to add the block containing the data to the newly created chain
            createNode(chainID, ip)
        }
    } catch(err) {
        console.error(err)
        return new Promise((resolve, reject) => {
            reject(500)
        });
    }
}

function createPrice(providerID, price) {
    // Checks if the blockchain is created before adding the new block
    try {
        if (fs.existsSync('./middleware/Validator/Blockchain/Validator.json')) {
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var snapshot = fs.readFileSync('./middleware/Validator/Blockchain/Validator.json')
            var json = JSON.parse(snapshot)
            var chain = json
            var index = chain.prices.length

            // Calls the getPreviousBlock function to collect the hash of the previous block
            var previousBlock = getPreviousPrice()
            var previousHash = previousBlock.hash
            
            // Calls the nonce function to get to calculate the nonce of the block and thereby making the block immutable
            var nonce = calculateNonce('price')

            // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
            var dateTime = new Date().getTime().toString()

            // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
            var block = {
                'index' : index, 
                'nonce' : nonce,
                'providerID' : providerID,
                'price' : price,
                'hash' : hash(index.toString(), nonce, providerID + price.toString(), previousHash, dateTime.toString()),
                'previousHash' : previousHash,
                'timeStamp' : dateTime,
                'blocked' : false
            }

            // Adds the block to the chain
            chain.prices.push(block)

            // Writes the updated blockchain to the json file belonging to the correct household
            fs.writeFileSync('./middleware/Validator/Blockchain/Validator.json', JSON.stringify(chain, null, 4))
            return new Promise((resolve, reject) => {
                resolve(200)
            });
        } else {
            // Loads the genesis block, this is only done once
            createGenesis()

            // Recalls the createBlock function to add the block containing the data to the newly created chain
            createPrice(chainID, ip)
        }
    } catch(err) {
        console.error(err)
        return new Promise((resolve, reject) => {
            reject(500)
        });
    }
}

function createProvider(providerID) {
    // Checks if the blockchain is created before adding the new block
    try {
        if (fs.existsSync('./middleware/Validator/Blockchain/Validator.json')) {
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var snapshot = fs.readFileSync('./middleware/Validator/Blockchain/Validator.json')
            var json = JSON.parse(snapshot)
            var chain = json
            var index = chain.providers.length

            // Calls the getPreviousBlock function to collect the hash of the previous block
            var previousBlock = getPreviousProvider()
            var previousHash = previousBlock.hash
            
            // Calls the nonce function to get to calculate the nonce of the block and thereby making the block immutable
            var nonce = calculateNonce('provider')

            // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
            var dateTime = new Date().getTime().toString()

            // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
            var block = {
                'index' : index, 
                'nonce' : nonce,
                'providerID' : providerID,
                'hash' : hash(index.toString(), nonce, providerID, previousHash, dateTime.toString()),
                'previousHash' : previousHash,
                'timeStamp' : dateTime,
                'blocked' : false
            }

            // Adds the block to the chain
            chain.providers.push(block)

            // Writes the updated blockchain to the json file belonging to the correct household
            fs.writeFileSync('./middleware/Validator/Blockchain/Validator.json', JSON.stringify(chain, null, 4))
            return new Promise((resolve, reject) => {
                resolve(200)
            });
        } else {
            // Loads the genesis block, this is only done once
            createGenesis()

            // Recalls the createBlock function to add the block containing the data to the newly created chain
            createProvider(providerID)
        }
    } catch(err) {
        console.error(err)
        return new Promise((resolve, reject) => {
            reject(500)
        });
    }
}
createNode('kafkaksdk', '127.0.0.1')
createPrice('gsdgsd', '1.66')
module.exports = {createNode, createPrice, createProvider}