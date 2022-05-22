const fs = require('fs')

// const paths = require('./../../../util/blockchainPath')
const Hash = require('./../Utilities/Hash')
const PreviousBlock = require('./../Utilities/PreviousBlock')

const getPreviousEvent = PreviousBlock.getPreviousEvent
const getPreviousArea = PreviousBlock.getPreviousArea
const getPreviousPrice = PreviousBlock.getPreviousPrice
const getPreviousProvider = PreviousBlock.getPreviousProvider

const CreateEvent = async (Type, ID, TimeStamp, ...args) => {
    try {
        if (fs.existsSync('./middleware/Blockchain/Storage/Master.json')) {
            var CreatedBlock

            // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
            var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

            // Calls the getPreviousBlock function to collect the hash of the previous block
            var PreviousBlock = getPreviousEvent()
            var PreviousHash = PreviousBlock.Hash

            // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
            var DateTime = TimeStamp

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
                CreatedBlock = await CreateNode(EventHash, ID, TimeStamp, args[0])
            } else if (Type === 'Create Provider'){
                CreatedBlock = await CreateProvider(EventHash, ID, TimeStamp, args[0], args[1])
            } else if (Type === 'Create Price Function'){
                CreatedBlock = await CreatePriceFunction(EventHash, ID, TimeStamp, args[0], args[1], args[2])
            } else if (Type === 'Create Transaction'){
                CreatedBlock = await CreateTransaction(EventHash, ID, TimeStamp, args[0], args[1], args[2])
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

const CreateNode = async (EventHash, ID, TimeStamp, Area) => {
    var AreaIndex
    
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    const AreaCheck = Chain.Areas.filter(area => area.AreaID == Area)
    if(AreaCheck.length === 0){
        await CreateArea(EventHash, Area)
        Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    }
    
    //Loops through the chain to find the correct area, and checks if the area contains any nodes
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
    var DateTime = TimeStamp

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
        'Pings' : 0,
        'PingUpdated' : DateTime
    }

    Chain.Areas[AreaIndex].Nodes.push(Block)

    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))

    return new Promise((resolve) => {
        resolve()
    });
}

const CreateTransaction = async (EventHash, ID, TimeStamp, Provider, Area, Usage) => {
    var AreaIndex
    var Price
    Usage /= 1000 

    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    for(let i = 0; i < Chain.Area.length; i++) {
        if(Chain.Area[i].AreaID === Area){
            if(Chain.Area[i].Transactions.length > 0){
                // Calls the getPreviousBlock function to collect the hash of the previous block
                var PreviousHash = Chain.Area[i].Transactions[Chain.Area[i].Transactions.length - 1].Hash
            } else {
                var PreviousHash = EventHash
            }
            AreaIndex = i
        }
    }


    var time = new Date(TimeStamp)
    time = parseFloat(time.getHours() + '.' + parseInt((time.getMinutes() / 60) * 100))

    var PriceFunctions = Chain.PriceFunctions.filter(price => price.Areas === '*' || price.Areas === Area && price.ProviderID === Provider)
    Price = (((parseInt(PriceFunctions[0].Top - PriceFunctions[0].Bottom)) / 2) * Math.sin(0.5 * (time - 6.5)) + 50) * Usage

    Price *= 7.5
    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = TimeStamp

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

    Chain.Area[AreaIndex].Transactions.push(Block)
    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))

    return new Promise((resolve) => {
        resolve()
    });
}

module.exports = CreateEvent;
