const cote = require('cote');
const fs = require('fs')

const SendPayload = require('./SendPayload.js')

const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['BlockAccepted']})

Subscriber.on('BlockAccepted', (Block) => {
    console.log('Block Accepted')
    var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
    
    Block = JSON.parse(Block)
    if(Block.To === Self.ID){
        delete Block.Publisher
        delete Block.To

        SendPayload(JSON.stringify(Block), 'ValidatedBlock')
    }
})

module.exports = Subscriber