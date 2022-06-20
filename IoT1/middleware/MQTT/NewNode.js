const cote = require('cote');
const fs = require('fs')

const Validate = require('./../Blockchain/Consensus/Validate')
const SendPayload = require('./SendPayload.js')

const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['NewNode']})

Subscriber.on('NewNode', (Block) => {
    const Self = fs.readFileSync('./middleware/Storage/Keys.json')

    Block = JSON.parse(Block)
    if(Block.To !== Self.ID && !fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
        delete Block.Publisher
        delete Block.To

        Validate.validateChain(JSON.stringify(Block))
        .then(() => {
            fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Block, null, 4))
            return new Promise((resolve) => {
                resolve()
            });
        })
        .catch(e => console.error('Chain failed to validate @ ', e))
    }
})

module.exports = Subscriber