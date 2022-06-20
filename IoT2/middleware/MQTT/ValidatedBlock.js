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
        Chain.Nodes.push(Block.temp)
    } else if(Block.EventBlock.Type === 'Create Provider'){
        Chain.Providers.push(Block.temp)
    } else if(Block.EventBlock.Type === 'Create PriceFunction'){
        Chain.PriceFunctions.push(Block.temp)
    } else if(Block.EventBlock.Type === 'Create Transaction'){
        Chain.Transactions.push(Block.temp)
    }
    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))

    var Pending = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Pending.json'))
    Pending = Pending.slice(1)
    fs.writeFileSync('./middleware/Blockchain/Storage/Pending.json', JSON.stringify(Pending, null, 4))

})

module.exports = Subscriber