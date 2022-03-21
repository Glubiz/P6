const fs = require('fs')
const hash = require('./hash')
const getPreviousBlock = require('./previousBlock')
const paths = require('../../util/blockchainPath');

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
        'areaCode' : '0000',
        'chainID' : 'Genesis',
        'IP' : '127.0.0.1',
        'port' : '0000',
        'hash' : hash('0', 'Genesis', 'None', dateTime),
        'previousHash' : 'None',
        'timeStamp' : dateTime,
        'validaterCandidate' : false,
        'blocked' : false
    }

    // Adds the block to the chain
    chain.nodes.push(block)

    // Loads the genesis data into the block with key value pairs to be ready to be sent to the blockchain
    block = {
        'index' : 0,
        'providerID' : 'Genesis',
        'hash' : hash('0', 'Genesis', 'None', dateTime),
        'previousHash' : 'None',
        'timeStamp' : dateTime,
        'private' : false,
        'areaCode' : '0000',
        'blocked' : false
    }

    // Adds the block to the chain
    chain.providers.push(block)

    // Loads the genesis data into the block with key value pairs to be ready to be sent to the blockchain
    block = {
        'index' : 0,
        'providerID' : 'Genesis',
        'price' : '0',
        'amount' : '0',
        'hash' : hash('0', 'Genesis', 'None', dateTime),
        'previousHash' : 'None',
        'timeStamp' : dateTime,
        'blocked' : false
    }

    // Adds the block to the chain
    chain.prices.push(block)
    // Creates and writes the blockchain to the json file belonging to the correct household
    fs.writeFileSync(paths.path, JSON.stringify(chain, null, 4))
}

// Function for adding validation nodes (gateways) to the blockcahin. Will be called once a new gateway is connected to the internet.
function createNode(areaCode, chainID, ip) {
    // Checks if the blockchain is created before adding the new block
    try {
        if (fs.existsSync(paths.path)) {
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var snapshot = fs.readFileSync(paths.path)
            var search = snapshot.nodes
            console.log(snapshot)
            const result = search.filter(block => block.chainID == chainID)
            if (!result){
                var json = JSON.parse(snapshot)
                var chain = json
                var index = chain.nodes.length

                // Calls the getPreviousBlock function to collect the hash of the previous block
                var previousBlock = getPreviousNode()
                var previousHash = previousBlock.hash
                
                // Calls the nonce function to get to calculate the nonce of the block and thereby making the block immutable
                // var nonce = calculateNonce('node')

                
                // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
                var dateTime = new Date().getTime().toString()
                
                var calculatedHash = hash(index.toString(), chainID + '4000', previousHash, dateTime.toString())
                // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
                var block = {
                    'index' : index, 
                    'areaCode' : areaCode,
                    'chainID' : chainID,
                    'IP' : ip,
                    'port' : '4000',
                    'hash' : calculatedHash,
                    'previousHash' : previousHash,
                    'timeStamp' : dateTime,
                    'validaterCandidate' : false,
                    'blocked' : false
                }

                // Adds the block to the chain
                chain.nodes.push(block)

                // Writes the updated blockchain to the json file belonging to the correct household
                fs.writeFileSync(paths.path, JSON.stringify(chain, null, 4))
                return new Promise((resolve, reject) => {
                    resolve(200)
                });
            } else {
                return new Promise((resolve, reject) => {
                    reject(500)
                });
            }
        } else {
            // Loads the genesis block, this is only done once
            createGenesis()

            // Recalls the createBlock function to add the block containing the data to the newly created chain
            createNode(areaCode, chainID, ip)
        }
    } catch(err) {
        console.error(err)
        return new Promise((resolve, reject) => {
            reject(500)
        });
    }
}

// Function for adding new electricity providers to the blockchain. Will be called once a new provider is signing up to the ecosystem
function createProvider(providerID, private, areaCode) {
    // Checks if the blockchain is created before adding the new block
    try {
        if (fs.existsSync(paths.path)) {
            
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var snapshot = fs.readFileSync(paths.path)
            var search = snapshot.providers
            const result = search.filter(block => block.providerID == providerID)
            if (!result){
                var json = JSON.parse(snapshot)
                var chain = json
                var index = chain.providers.length
                
                // Calls the getPreviousBlock function to collect the hash of the previous block
                var previousBlock = getPreviousProvider()
                var previousHash = previousBlock.hash
                
                // Calls the nonce function to get to calculate the nonce of the block and thereby making the block immutable
                // var nonce = calculateNonce('provider')
                
                
                // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
                var dateTime = new Date().getTime().toString()
                
                var calculatedHash = hash(index.toString(),providerID, previousHash, dateTime.toString(), private.toString())
                // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
                var block = {
                    'index' : index, 
                    'providerID' : providerID,
                    'hash' : calculatedHash,
                    'previousHash' : previousHash,
                    'timeStamp' : dateTime,
                    'private' : private,
                    'areaCode' : areaCode,
                    'blocked' : false
                }
                
                // Adds the block to the chain
                chain.providers.push(block)
                
                // Writes the updated blockchain to the json file belonging to the correct household
                fs.writeFileSync(paths.path, JSON.stringify(chain, null, 4))
                return new Promise((resolve, reject) => {
                    resolve(200)
                });
            } else {
                return new Promise((resolve, reject) => {
                    reject(500)
                });
            }
        } else {
            // Loads the genesis block, this is only done once
            createGenesis()
            
            // Recalls the createBlock function to add the block containing the data to the newly created chain
            createProvider(providerID, private, areaCode)
        }
    } catch(err) {
        console.error(err)
        return new Promise((resolve, reject) => {
            reject(500)
        });
    }
}

// Function for adding prices to the blockchain. Will be called frequently once provides change the price. (may be switched for the transaction chain)
function createPrice(providerID, price, amount) {
    // Checks if the blockchain is created before adding the new block
    try {
        if (fs.existsSync(paths.path)) {
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var snapshot = fs.readFileSync(paths.path)
            var json = JSON.parse(snapshot)
            var chain = json
            var index = chain.prices.length
            console.log(index)

            // Calls the getPreviousBlock function to collect the hash of the previous block
            var previousBlock = getPreviousPrice()
            var previousHash = previousBlock.hash
            
            // Calls the nonce function to get to calculate the nonce of the block and thereby making the block immutable
            // var nonce = calculateNonce('price')

            
            // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
            var dateTime = new Date().getTime().toString()
            
            var calculatedHash = hash(index.toString(), providerID + price.toString(), previousHash, dateTime.toString())
            // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
            var block = {
                'index' : index,
                'providerID' : providerID,
                'price' : price,
                'amount' : amount,
                'hash' : calculatedHash,
                'previousHash' : previousHash,
                'timeStamp' : dateTime,
                'blocked' : false
            }

            // Adds the block to the chain
            chain.prices.push(block)

            // Writes the updated blockchain to the json file belonging to the correct household
            fs.writeFileSync(paths.path, JSON.stringify(chain, null, 4))
            return new Promise((resolve, reject) => {
                resolve(200)
            });
        } else {
            // Loads the genesis block, this is only done once
            createGenesis()

            // Recalls the createBlock function to add the block containing the data to the newly created chain
            createPrice(providerID, price, amount)
        }
    } catch(err) {
        console.error(err)
        return new Promise((resolve, reject) => {
            reject(500)
        });
    }
}
// createNode(9000, 'kafkaksdk', '127.0.0.1')
// createPrice('gsdgsd', '1.66', '1000')
module.exports = {createNode, createPrice, createProvider}