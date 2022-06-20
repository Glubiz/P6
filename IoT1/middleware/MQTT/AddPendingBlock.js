const cote = require('cote');
const fs = require('fs')

const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['PendingBlock']})

Subscriber.on('PendingBlock', (Block) => {
    const Self = fs.readFileSync('./middleware/Storage/Keys.json')

    Block = JSON.parse(Block)
    delete Block.Publisher

    if(fs.existsSync('./middleware/Blockchain/Storage/Pending.json')){
        var PendingBlocks = readFileSync('./middleware/Blockchain/Storage/Pending.json')
        var Check = PendingBlocks.filter(e => e.TimeStamp === Block.TimeStamp && e.ID === Block.ID)

        if(!Check){
            PendingBlocks.push(Block)
            fs.writeFileSync('./middleware/Blockchain/Storage/Pending.json', JSON.stringify(PendingBlocks, null, 4))
        }
    } else {
        Block = [Block]
        fs.writeFileSync('./middleware/Blockchain/Storage/Pending.json', JSON.stringify(Block, null, 4))
    }
})

module.exports = Subscriber