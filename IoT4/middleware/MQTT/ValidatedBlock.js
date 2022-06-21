const cote = require('cote');
const fs = require('fs')

const SendPayload = require('./SendPayload.js')

const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['ValidatedBlock']})

Subscriber.on('ValidatedBlock', (Block) => {
    console.log('Validated Block Received')
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    Block = JSON.parse(Block)
    delete Block.Publisher
    
    if(Chain.Events.length > 0){
        if(Block.EventBlock.Caller !== Chain.Events[Chain.Events.length - 1].Caller && Block.EventBlock.TimeStamp !== Chain.Events[Chain.Events.length - 1].TimeStamp){
            Chain.Events.push(Block.EventBlock)
        }
    }
    else {
        Chain.Events.push(Block.EventBlock)
    }
    if(Block.EventBlock.Type === 'Create Node'){
        if(Chain.Nodes.length > 0){
            if(Block.temp.NodeID !== Chain.Nodes[Chain.Nodes.length - 1].NodeID){
                Chain.Nodes.push(Block.temp)
            }
        }
        else {
            Chain.Nodes.push(Block.temp)
        }
    } else if(Block.EventBlock.Type === 'Create Provider'){
        if(Chain.Providers.length > 0){
            if(Block.temp.ProviderID !== Chain.Providers[Chain.Providers.length - 1].ProviderID){
                Chain.Providers.push(Block.temp)
            }
        }
        else {
            Chain.Providers.push(Block.temp)
        }
    } else if(Block.EventBlock.Type === 'Create PriceFunction'){
        if(Chain.PriceFunctions.length > 0){
            if(Block.temp.ProviderID !== Chain.PriceFunctions[Chain.PriceFunctions.length - 1].ProviderID && Block.temp.TimeStamp !== Chain.PriceFunctions[Chain.PriceFunctions.length - 1].TimeStamp){
                Chain.PriceFunctions.push(Block.temp)
            }
        }
        else {
            Chain.PriceFunctions.push(Block.temp)
        }
    } else if(Block.EventBlock.Type === 'Create Transaction'){
        if(Chain.Transactions.length > 0){
            if(Block.temp.NodeID !== Chain.Transactions[Chain.Transactions.length - 1].NodeID && Block.temp.TimeStamp !== Chain.Transactions[Chain.Transactions.length - 1].TimeStamp){
                Chain.Transactions.push(Block.temp)
            }
        }
        else {
            Chain.Transactions.push(Block.temp)
        }
    }
    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))

    var Pending = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Pending.json'))
    Pending = Pending.slice(1)
    fs.writeFileSync('./middleware/Blockchain/Storage/Pending.json', JSON.stringify(Pending, null, 4))

})

module.exports = Subscriber