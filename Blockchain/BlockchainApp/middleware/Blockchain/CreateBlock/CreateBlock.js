const fs = require('fs')

// const paths = require('./../../../util/blockchainPath')
const Hash = require('./..//Utilities/Hash')
const PreviousBlock = require('./../Utilities/PreviousBlock')

const getPreviousEvent = PreviousBlock.getPreviousEvent
const getPreviousNode = PreviousBlock.getPreviousNode
// const getPreviousPrice = getPreviousBlock.getPreviousPrice


const CreateGenesis = () => {
    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = new Date().getTime().toString()

    //Event Hash
    var EventHash = Hash('Create Genesis' + 'System', 'None', DateTime)


    // Instantiate the new chain with the ID, and the timestamp. All the blocks are added to the data array in the block
    let Chain = 
    {
        Chain : "Master",
        Instantiated : DateTime,
        Events : [],
        Nodes : [],
        Providers : [],
        PriceFunctions : [],
        Areas : []
    }

    // Loads the genesis data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'Type' : 'Create Genesis',
        'Caller' : 'System',
        'Hash' : EventHash,
        'PreviousHash' : 'None',
        'TimeStamp' : DateTime,
    }

    // Adds the block to the chain
    Chain.Events.push(Block)

    fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve()
    });
}

const CreateEvent = (Type, ID, ...args) => {
    try {
        if (fs.existsSync('./../Storage/Master.json')) {
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

            // Calls the getPreviousBlock function to collect the hash of the previous block
            var PreviousBlock = getPreviousEvent()
            var PreviousHash = PreviousBlock.Hash

            // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
            var DateTime = new Date().getTime().toString()

            //Event Hash
            var EventHash = Hash(Type + ID, PreviousHash, DateTime)

            var Status = 'Failed'
            if (Type === 'Create Node'){
                CreateNode(EventHash, ID)
                .then(Status = 'Success')
            } else if (Type === 'Create Provider'){
                CreateProvider(EventHash)
                .then(Status = 'Success')
            } else if (Type === 'Create Price Function'){
                CreatePriceFunction(EventHash)
                .then(Status = 'Success')
            } else if (Type === 'Create Area') {
                CreateArea(EventHash)
                .then(Status = 'Success')
            } else {
                
            }
            return new Promise((resolve) => {
               // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
                var Block = { 
                    'Type' : Type,
                    'Caller' : ID,
                    'Hash' : EventHash,
                    'PreviousHash' : PreviousHash,
                    'TimeStamp' : DateTime,
                    'Status' : Status
                }
                Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))
                Chain.Events.push(Block)

                fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4)) 
                resolve()
            })
        } else {
            CreateGenesis()
            .then(CreateEvent(Type, ID, ...args))
        }
    } catch (e) {
        console.error(e)
        return new Promise((reject) => {
            reject(e)
        });
    }
}

const CreateNode = (EventHash, ID) => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

    if(Chain.Nodes.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousBlock = getPreviousNode()
        var PreviousHash = PreviousBlock.Hash
    } else {
        var PreviousHash = EventHash
    }

    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = new Date().getTime().toString()

    //Event Hash
    var NodeHash = Hash(EventHash + ID, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'NodeID' : ID,
        'Hash' : NodeHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'Blocked' : false,
        'Pings' : 0
    }

    Chain.Nodes.push(Block)

    fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve()
    });
}

const CreateProvider = (EventHash, ID, Areas = '*') => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

    if(Chain.Providers.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousBlock = getPreviousProvider()
        var PreviousHash = PreviousBlock.Hash
    } else {
        var PreviousHash = EventHash
    }

    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = new Date().getTime().toString()

    //Event Hash
    var ProviderHash = Hash(EventHash + ID, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'ProviderID' : ID,
        'Hash' : ProviderHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'Blocked' : false,
        'Private' : 0,
        'Areas' : Areas
    }

    Chain.Providers.push(Block)

    fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve()
    });
}

const CreatePriceFunction = (EventHash, ID, Areas = '*') => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

    if(Chain.PriceFunctions.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousBlock = getPreviousProvider()
        var PreviousHash = PreviousBlock.Hash
    } else {
        var PreviousHash = EventHash
    }

    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = new Date().getTime().toString()

    //Event Hash
    var PriceFunctionHash = Hash(EventHash + ID, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'ProviderID' : ID,
        'Hash' : PriceFunctionHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'Areas' : Areas
    }

    Chain.Providers.push(Block)

    fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve()
    });
}

const CreateArea = () => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

    if(Chain.Areas.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousBlock = getPreviousProvider()
        var PreviousHash = PreviousBlock.Hash
    } else {
        var PreviousHash = EventHash
    }

    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = new Date().getTime().toString()

    //Event Hash
    var AreaHash = Hash(EventHash + ID, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'AreaID' : ID,
        'Hash' : AreaHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'Nodes' : [],
        'Transactions' : []
    }

    Chain.Providers.push(Block)

    fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve()
    });
}

CreateEvent(Type = 'Create Node', ID = '1234')
// CreateGenesis()

//Mangler locale variabler i Create Event som skal passes til de bagved læggende funktioner