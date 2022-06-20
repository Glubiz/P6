const cote = require('cote');
const fs = require('fs')

const SendPayload = require('./SendPayload.js')

const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['ValidatedBlock']})

Subscriber.on('ValidatedBlock', (Block) => {
    console.log('Validated Block Received')
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    Block = JSON.parse(Block)
    delete Block.Publisher

    Chain.Events.push(Block.EventBlock)
    if(Block.EventBlock.Type === 'Create Node'){
        if(Block.temp.PreviousHash === Chain.Nodes[Chain.Nodes.length - 1].Hash){
            Chain.Nodes.push(Block.temp)
        }
    } else if(Block.EventBlock.Type === 'Create Provider'){
        if(Block.temp.PreviousHash === Chain.Providers[Chain.Providers.length - 1].Hash){
            Chain.Providers.push(Block.temp)
        }
    } else if(Block.EventBlock.Type === 'Create PriceFunction'){
        if(Block.temp.PreviousHash === Chain.PriceFunctions[Chain.PriceFunctions.length - 1].Hash){
            Chain.PriceFunctions.push(Block.temp)
        }
    } else if(Block.EventBlock.Type === 'Create Transaction'){
        if(Block.temp.PreviousHash === Chain.Transactions[Chain.Transactions.length - 1].Hash){
            Chain.Transactions.push(Block.temp)
        }
    }
    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))

    var Pending = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Pending.json'))
    Pending = Pending.slice(1)
    fs.writeFileSync('./middleware/Blockchain/Storage/Pending.json', JSON.stringify(Pending, null, 4))

})

module.exports = Subscriber