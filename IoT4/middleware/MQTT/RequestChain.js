const cote = require('cote');
const fs = require('fs')

const SendPayload = require('./SendPayload.js')

const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['RequestChain']})

Subscriber.on('RequestChain', (Block) => {
    var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
    Block = JSON.parse(Block)
    console.log(Self.ID)
    if(Block.Publisher !== Self.ID){
        console.log('New node requested Chain')

        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
        Chain.To = Block.Publisher
        SendPayload(JSON.stringify(Chain), 'NewNode')
        console.log('Chain has been sent')

    }
})

module.exports = Subscriber