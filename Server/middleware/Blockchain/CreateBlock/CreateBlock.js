const fs = require('fs')

// const paths = require('./../../../util/blockchainPath')
const Hash = require('./..//Utilities/Hash')
const PreviousBlock = require('./../Utilities/PreviousBlock')

const getPreviousEvent = PreviousBlock.getPreviousEvent
const getPreviousArea = PreviousBlock.getPreviousArea
const getPreviousPrice = PreviousBlock.getPreviousPrice
const getPreviousProvider = PreviousBlock.getPreviousProvider

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
        Nodes : [],
        Transactions : []
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
    })
}

const CreateEvent = async (Type, ID, ...args) => {
    console.log("Length = " + fs.readFileSync('./middleware/Blockchain/Storage/Master.json').length)
    console.log("Exists = " + fs.existsSync('./middleware/Blockchain/Storage/Master.json'))
    try {
        if (fs.existsSync('./middleware/Blockchain/Storage/Master.json') && fs.readFileSync('./middleware/Blockchain/Storage/Master.json').length > 0) {
            var CreatedBlock

            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

            // Calls the getPreviousBlock function to collect the hash of the previous block
            var PreviousBlock = getPreviousEvent()
            var PreviousHash = PreviousBlock.Hash

            // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
            var DateTime = new Date().getTime().toString()
            console.log(Type, ID, PreviousHash, DateTime)

            //Event Hash
            var EventHash = Hash(Type + ID, PreviousHash, DateTime)
            // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
            var Block = { 
                'Type' : Type,
                'Caller' : ID,
                'Hash' : EventHash,
                'PreviousHash' : PreviousHash,
                'TimeStamp' : DateTime
            }

            // Loads chain
            Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
            Chain.Events.push(Block)
            fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4)) 

            if (Type === 'Create Node'){
                CreatedBlock = await CreateNode(EventHash, ID, DateTime)
            } else if (Type === 'Create Provider'){
                CreatedBlock = await CreateProvider(EventHash, ID, DateTime, args[0])
            } else if (Type === 'Create Price Function'){
                CreatedBlock = await CreatePriceFunction(EventHash, ID, DateTime, args[0], args[1])
            } else if (Type === 'Create Transaction'){
                CreatedBlock = await CreateTransaction(EventHash, ID, DateTime, args[0], args[1])
            }

            return new Promise((resolve) => {
                resolve(CreatedBlock)
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

const CreateNode = async (EventHash, ID, DateTime) => {
    
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    var PreviousHash = EventHash

    //Event Hash
    var NodeHash = Hash(EventHash + ID, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'NodeID' : ID,
        'Hash' : NodeHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'Address' : 'N/A',
        'Blocked' : false,
        'Pings' : 0,
        'PingUpdated' : DateTime
    }

    Chain.Nodes.push(Block)

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))

    return new Promise((resolve) => {
        resolve(Block)
    });
}

// const CreateTransaction = async (EventHash, ID, DateTime, Provider, Usage) => {
//     var AreaIndex
//     var Price
//     Usage /= 1000 

//     // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
//     var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

//     for(let i = 0; i < Chain.Areas.length; i++) {
//         if(Chain.Areas[i].AreaID === Area){
//             if(Chain.Areas[i].Transactions.length > 0){
//                 // Calls the getPreviousBlock function to collect the hash of the previous block
//                 var PreviousHash = Chain.Areas[i].Transactions[Chain.Areas[i].Transactions.length - 1].Hash
//             } else {
//                 var PreviousHash = EventHash
//             }
//             AreaIndex = i
//         }
//     }


//     var time = new Date()
//     time = parseFloat(time.getHours() + '.' + parseInt((time.getMinutes() / 60) * 100))

//     var PriceFunctions = Chain.PriceFunctions.filter(price => price.Areas === '*' || price.Areas === Area && price.ProviderID === Provider)
//     if (PriceFunctions.length > 0){
//         Price = (((parseInt(PriceFunctions[0].Top - PriceFunctions[0].Bottom)) / 2) * Math.sin(0.5 * (time - 6.5)) + 50) * Usage
    
//         Price *= 7.5
    
//         console.log(EventHash , ID , Provider , Price, PreviousHash, DateTime)

//         //Event Hash
//         var NodeHash = Hash(EventHash + ID + Provider + Price, PreviousHash, DateTime)
    
//         // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
//         var Block = { 
//             'EventHash' : EventHash,
//             'NodeID' : ID,
//             'ProviderID' : Provider,
//             'Price' : Price,
//             'Hash' : NodeHash,
//             'PreviousHash' : PreviousHash,
//             'TimeStamp' : DateTime,
//             'AmountBought' : Usage,
//         }
    
//         Chain.Areas[AreaIndex].Transactions.push(Block)
//         fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
    
//         return new Promise((resolve) => {
//             resolve(Block)
//         });
//     }
// }

const CreateProvider = (EventHash, ID, DateTime, Private = false) => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    if(Chain.Providers.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousBlock = getPreviousProvider()
        var PreviousHash = PreviousBlock.Hash
    } else {
        var PreviousHash = EventHash
    }

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
        'Private' : Private
    }

    Chain.Providers.push(Block)

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve(Block)
    });
}

const CreatePriceFunction = (EventHash, ID, DateTime, Top, Bottom) => {
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    if(Chain.PriceFunctions.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousBlock = getPreviousPrice()
        var PreviousHash = PreviousBlock.Hash
    } else {
        var PreviousHash = EventHash
    }

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
        'Top' : Top,
        'Bottom' : Bottom,
        'Updated' : Updated
    }

    Chain.PriceFunctions.push(Block)

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
    return new Promise((resolve) => {
        resolve(Block)
    });
}

const CreateArea = (EventHash) => {
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
    var AreaHash = Hash(EventHash, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'Hash' : AreaHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'Nodes' : [],
        'Transactions' : []
    }

    Chain.Area.push(Block)

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))

    return new Promise((resolve) => {
        resolve(Block)
    });
}

// CreateEvent(Type = 'Create Node', ID = '555', IP = '127.0.0.1', Port = '3033', Area = '9000')

// CreateEvent(Type = 'Create Provider', ID = '66623', Private = false, Areas = '*')
// CreateEvent(Type = 'Create Price Function', ID = '472590ae974d4c1f44b3780df0b152d9119f076c61bfb3e8cb6affd7889ac0a8', Top = '60', Bottom = '40', Areas = '*')


// CreateEvent(Type = 'Create Transaction', ID = '555', Provider = '666', Area = '9000', Usage = '100')


// CreateEvent(Type = 'Create Node', ID = '51352345', Area = "9000", IP = '127.0.0.1', Port = '3033')

// CreateArea("aksfaks", "9000d")
// CreateGenesis()

module.exports = CreateEvent;
