const fs = require('fs')

// const paths = require('./../../../util/blockchainPath')
const Hash = require('./..//Utilities/Hash')
const PreviousBlock = require('./../Utilities/PreviousBlock')

const getPreviousEvent = PreviousBlock.getPreviousEvent
const getPreviousNode = PreviousBlock.getPreviousNode
const getPreviousArea = PreviousBlock.getPreviousArea
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

const CreateEvent = async (Type, ID, Area = 0, IP = 0, Port = 0, Areas = "*", Top = 0, Bottom = 0, ...args) => {
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
            // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
             var Block = { 
                 'Type' : Type,
                 'Caller' : ID,
                 'Hash' : EventHash,
                 'PreviousHash' : PreviousHash,
                 'TimeStamp' : DateTime,
             }
             Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))
             Chain.Events.push(Block)
             fs.writeFileSync('./../Storage/Master.json', JSON.stringify(Chain, null, 4)) 
             console.log('1')

            if (Type === 'Create Node'){
                console.log("Create")
                await CreateNode(EventHash, ID, IP, Port, Area)
            } else if (Type === 'Create Provider'){
                CreateProvider(EventHash = EventHash, Areas = Areas)
                .then(Status = 'Success')
            } else if (Type === 'Create Price Function'){
                CreatePriceFunction(EventHash = EventHash, ID = ID, Top = Top, Bottom = Bottom)
                .then(Status = 'Success')
            }

            return new Promise((resolve) => {
                resolve()
            })
        } else {
            await CreateGenesis()
            CreateEvent(Type, ID, Area, IP, Port, Areas, Top, Bottom, ...args)
        }
    } catch (e) {
        console.error(e)
        return new Promise((reject) => {
            reject(e)
        });
    }
}

const CreateNode = async (EventHash, ID, IP, Port, Area) => {
    var AreaIndex
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))
    const AreaCheck = Chain.Areas.filter(area => area.AreaID == Area)
    if(AreaCheck.length === 0){
        await CreateArea(EventHash, Area)
        Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))
    }
    console.log(ID)

    for(let i = 0; i < Chain.Areas.length; i++) {
        if(Chain.Areas[i].AreaID === Area){
            if(Chain.Areas[i].Nodes.length > 0){
                // Calls the getPreviousBlock function to collect the hash of the previous block
                var PreviousHash = Chain.Areas[i].Nodes[Chain.Areas[i].Nodes.length - 1].Hash
            } else {
                var PreviousHash = EventHash
            }
            AreaIndex = i
        }
    }

    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = new Date().getTime().toString()

    //Event Hash
    var NodeHash = Hash(EventHash + ID, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'NodeID' : ID,
        'IP' : IP,
        'Port' : Port,
        'Hash' : NodeHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'Blocked' : false,
        'Pings' : 0
    }

    Chain.Areas[AreaIndex].Nodes.push(Block)

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

const CreateArea = (EventHash, ID) => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

    if(Chain.Areas.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousBlock = getPreviousArea()
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

    Chain.Areas.push(Block)
    // console.log(Chain)
    Chain = JSON.stringify(Chain, null, 4)
    // console.log(Chain)

    fs.writeFileSync('./../Storage/Master.json', Chain, {flag: 'w'})

    return new Promise((resolve) => {
        resolve()
    });
}

CreateEvent(Type = 'Create Node', ID = '555', Area = "9000", IP = '127.0.0.1', Port = '3033')

// CreateArea("aksfaks", "9000d")
// CreateGenesis()

//Mangler locale variabler i Create Event som skal passes til de bagved læggende funktioner