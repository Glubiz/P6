const cote = require('cote');
const fs = require('fs');

// const Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

const Publisher = new cote.Publisher({ name: 'Pub', broadcasts: ['Block'] })

const Publish = (Block, Type) => {
    // const blockTransmition = new cote.Responder({ name: 'Block Transmition'});
    Block = JSON.parse(Block)

    Block.Type = Type
    Publisher.publish('Block', JSON.stringify(Block))
    // blockTransmition.on('Block', (req, cb) => {
    //     cb(Block);
    // });
}

// setTimeout(Publish(JSON.stringify({Hi: 'Hi'}), 'Test', '9000'), 10000)

module.exports = Publish