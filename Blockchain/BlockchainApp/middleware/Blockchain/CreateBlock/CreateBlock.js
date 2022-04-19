const fs = require('fs')

// const paths = require('./../../../util/blockchainPath')
const Hash = require('./..//Utilities/Hash')
const PreviousBlock = require('./../Utilities/PreviousBlock')

const getPreviousEvent = PreviousBlock.getPreviousEvent
const getPreviousArea = PreviousBlock.getPreviousArea
const getPreviousPrice = PreviousBlock.getPreviousPrice


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

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve()
    });
}

const CreateEvent = async (Type, ID, ...args) => {
    try {
        if (fs.existsSync('./middleware/Blockchain/Storage/Master.json')) {
            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

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
                'Status' : 'Pending'
            }

            // Loads chain
            Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
            Chain.Events.push(Block)
            fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4)) 

            if (Type === 'Create Node'){
                await CreateNode(EventHash, ID, args[0], args[1], args[2])
            } else if (Type === 'Create Provider'){
                await CreateProvider(EventHash, ID, args[0], args[1])
            } else if (Type === 'Create Price Function'){
                await CreatePriceFunction(EventHash, ID, args[0], args[1], args[2])
            } else if (Type === 'Create Transaction'){
                await CreateTransaction(EventHash, ID, args[0], args[1], args[2])
            }

            return new Promise((resolve) => {
                resolve()
            })
        } else {
            await CreateGenesis()
            CreateEvent(Type, ID, ...args)
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
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    const AreaCheck = Chain.Areas.filter(area => area.AreaID == Area)
    if(AreaCheck.length === 0){
        await CreateArea(EventHash, Area)
        Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    }

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

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))

    return new Promise((resolve) => {
        resolve()
    });
}

const CreateTransaction = async (EventHash, ID, Provider, Area, Usage) => {
    var AreaIndex
    var Price
    Usage /= 1000 

    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    for(let i = 0; i < Chain.Areas.length; i++) {
        if(Chain.Areas[i].AreaID === Area){
            if(Chain.Areas[i].Transactions.length > 0){
                // Calls the getPreviousBlock function to collect the hash of the previous block
                var PreviousHash = Chain.Areas[i].Transactions[Chain.Areas[i].Transactions.length - 1].Hash
            } else {
                var PreviousHash = EventHash
            }
            AreaIndex = i
        }
    }


    var time = new Date()
    time = parseFloat(time.getHours() + '.' + parseInt((time.getMinutes() / 60) * 100))

    var PriceFunctions = Chain.PriceFunctions.filter(price => price.Areas === '*' || price.Areas === Area && price.ProviderID === Provider)
    Price = (((parseInt(PriceFunctions[0].Top - PriceFunctions[0].Bottom)) / 2) * Math.sin(0.5 * (time - 6.5)) + 50) * Usage

    Price /= 7.5
    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = new Date().getTime().toString()

    //Event Hash
    var NodeHash = Hash(EventHash + ID + Provider + Price, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'NodeID' : ID,
        'ProviderID' : Provider,
        'Price' : Price,
        'Hash' : NodeHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'AmountBought' : Usage,
    }

    Chain.Areas[AreaIndex].Transactions.push(Block)
    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))

    return new Promise((resolve) => {
        resolve()
    });
}

const CreateProvider = (EventHash, ID, Private = false, Areas = '*') => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

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
        'Private' : Private,
        'Areas' : Areas
    }

    Chain.Providers.push(Block)

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve()
    });
}

const CreatePriceFunction = (EventHash, ID, Top, Bottom, Areas) => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    if(Chain.PriceFunctions.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousBlock = getPreviousPrice()
        var PreviousHash = PreviousBlock.Hash
    } else {
        var PreviousHash = EventHash
    }

    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = new Date().getTime().toString()

    var Updated = DateTime

    // PriceFunction = ((Top - Bottom) / 2) * Math.sin(0.5 * (x - 6.5)) + 50

    //Event Hash
    var PriceFunctionHash = Hash(EventHash + ID, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'ProviderID' : ID,
        'Hash' : PriceFunctionHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'Areas' : Areas,
        'Top' : Top,
        'Bottom' : Bottom,
        'Updated' : Updated
    }

    Chain.PriceFunctions.push(Block)

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve()
    });
}

const CreateArea = (EventHash, ID) => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

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

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4), {flag: 'w'})

    return new Promise((resolve) => {
        resolve()
    });
}

// CreateEvent(Type = 'Create Node', ID = '555', IP = '127.0.0.1', Port = '3033', Area = '9000')

// CreateEvent(Type = 'Create Provider', ID = '666', Private = false, Areas = '*')
// CreateEvent(Type = 'Create Price Function', ID = '666', Top = '60', Bottom = '40', Areas = '*')


// CreateEvent(Type = 'Create Transaction', ID = '555', Provider = '666', Area = '9000', Usage = '100')


// CreateEvent(Type = 'Create Node', ID = '51352345', Area = "9000", IP = '127.0.0.1', Port = '3033')

// CreateArea("aksfaks", "9000d")
// CreateGenesis()

module.exports = CreateEvent;
