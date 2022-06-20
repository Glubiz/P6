const fs = require('fs')
const Hash = require('./../Utilities/Hash')

const CollectedValidators = require('./CollectedValidators')
const SendPayload = require('./../../MQTT/SendPayload')

//Activates the validation if the node has been voted as a validator
const ValidatePending = () => {
    CollectedValidators.CountedValidators()
    .then(async List => {
        var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
        
        if(List.length > 0){

            //Checks if the node is in the top 50% of the blockchain. If it is, then start validating
            for (var i = 0; i <= parseInt(List.length / 2); i++) {
                if(List[i].Node == Self.ID){
                    console.log('I have been choosen')
                    if(fs.existsSync('./middleware/Blockchain/Storage/Pending.json')){
                        if(JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Pending.json')).length > 0){
                            GenerateTemporaryBlocks()
                        }
                    }
                }
            }
        }
        return new Promise((resolve) => {
            resolve()
        });
    })
}

const GenerateTemporaryBlocks = () => {
    var Block
    var PendingBlocks = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Pending.json'))
    var temp = PendingBlocks[0]
    CreateEvent(JSON.stringify(temp))
    .then(async EventBlock => {
        if(temp.Type === 'Create Node'){
            temp = await CreateNode(EventBlock.Hash, JSON.stringify(temp))
        } else if (temp.Type === 'Create Provider') {
            temp = await CreateProvider(EventBlock.Hash, JSON.stringify(temp))
        } else if (temp.Type === 'Create Price Function') {
            temp = await CreatePriceFunction(EventBlock.Hash, JSON.stringify(temp))
        } else if (temp.Type === 'Create Transaction'){
            temp = await CreateTransaction(EventBlock.Hash, JSON.stringify(temp))
        }

        Block = {EventBlock, temp}
        Block = JSON.stringify(Block)
        return new Promise((resolve) => {
            console.log('Block pair created ', Block)
            SendPayload(Block, 'CalculatedBlock')
            resolve()
        });
    })

}

const CreateEvent = (Data) => {
    Data = JSON.parse(Data)
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    // Calls the getPreviousBlock function to collect the hash of the previous block
    var PreviousHash = Chain.Events[Chain.Events.length - 1].Hash

    //Event Hash
    var EventHash = Hash(Data.Type + Data.ID, PreviousHash, Data.TimeStamp)
    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'Type' : Data.Type,
        'Caller' : Data.ID,
        'Hash' : EventHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : Data.TimeStamp
    }
    return new Promise((resolve) => {
        console.log('Event Block Created: ', Block)
        resolve(Block)
    });
}

const CreateNode = (EventHash, Data) => {
    Data = JSON.parse(Data)
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    //Loops through the chain to find the correct area, and checks if the area contains any nodes
    if(Chain.Nodes.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousHash = Chain.Nodes[Chain.Nodes.length - 1].Hash
    } else {
        var PreviousHash = EventHash
    }
        

    // Collects the server time in epoch format, this is done to get a consistant format for the time to add into the new block
    var DateTime = Data.TimeStamp

    //Event Hash
    var NodeHash = Hash(EventHash + Data.ID, PreviousHash, DateTime)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'NodeID' : Data.ID,
        'Hash' : NodeHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : DateTime,
        'Address' : 'N/A',
        'Blocked' : false,
        'Pings' : 0,
        'PingUpdated' : DateTime
    }

    return new Promise((resolve) => {
        console.log('Node Block Created: ', Block)
        resolve(Block)
    });
}

const CreateProvider = (EventHash, Data) => {
    Data = JSON.parse(Data)
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    if(Chain.Providers.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousHash = Chain.Providers[Chain.Providers.length - 1].Hash
    } else {
        var PreviousHash = EventHash
    }

    //Event Hash
    var ProviderHash = Hash(EventHash + Data.ID, PreviousHash, Data.TimeStamp)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'ProviderID' : Data.ID,
        'Hash' : ProviderHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : Data.TimeStamp,
        'Blocked' : false,
        'Private' : false
    }

    return new Promise((resolve) => {
        console.log('Provider Block Created: ', Block)
        resolve(Block)
    });
}

const CreatePriceFunction = (EventHash, Data) => {
    Data = JSON.parse(Data)
    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    if(Chain.PriceFunctions.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousHash = Chain.PriceFunctions[Chain.PriceFunctions.length - 1].Hash
    } else {
        var PreviousHash = EventHash
    }

    var Updated = Data.TimeStamp

    //Event Hash
    var PriceFunctionHash = Hash(EventHash + Data.ID, PreviousHash, Data.TimeStamp)

    // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
    var Block = { 
        'EventHash' : EventHash,
        'ProviderID' : Data.ID,
        'Hash' : PriceFunctionHash,
        'PreviousHash' : PreviousHash,
        'TimeStamp' : Data.TimeStamp,
        'Top' : Data.Top,
        'Bottom' : Data.Bottom,
        'Updated' : Updated
    }
    return new Promise((resolve) => {
        console.log('PriceFunction Block Created: ', Block)
        resolve(Block)
    });
}

const CreateTransaction = (EventHash, Data) => {
    Data = JSON.parse(Data)
    
    var Price
    var Usage = Data.Usage /= 1000 

    // Loads the previous chain as a json file to find the chain length and to be able to push the new block to the chain
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    if(Chain.Transactions.length > 0){
        // Calls the getPreviousBlock function to collect the hash of the previous block
        var PreviousHash = Chain.Transactions[Chain.Transactions.length - 1].Hash
    } else {
        var PreviousHash = EventHash
    }


    var time = new Date(Data.TimeStamp)
    time = parseFloat(time.getHours() + '.' + parseInt((time.getMinutes() / 60) * 100))

    var PriceFunctions = Chain.PriceFunctions.filter(price => price.ProviderID === Provider)
    if (PriceFunctions.length > 0){
        Price = (((parseInt(PriceFunctions[0].Top - PriceFunctions[0].Bottom)) / 2) * Math.sin(0.5 * (time - 6.5)) + 50) * Usage

        Price *= 7.5

        //Event Hash
        var NodeHash = Hash(EventHash + Data.ID + Data.Provider + Price, PreviousHash, Data.TimeStamp)

        // Loads the data into the block with key value pairs to be ready to be sent to the blockchain
        var Block = { 
            'EventHash' : EventHash,
            'NodeID' : Data.ID,
            'ProviderID' : Data.Provider,
            'Price' : Price,
            'Hash' : NodeHash,
            'PreviousHash' : PreviousHash,
            'TimeStamp' : Data.TimeStamp,
            'AmountBought' : Usage
        }
        return new Promise((resolve) => {
            console.log('Transaction Block Created: ', Block)
            resolve(Block)
        });
    }
}

setInterval(ValidatePending, 5000)