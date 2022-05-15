const cote = require('cote');
// const responder = new cote.Responder({ name: 'API', key:'block' });
// const publisher = new cote.Publisher({ name: 'publisher' });

const Broadcast = (Block, Type, Area) => {
    const blockTransmition = new cote.Responder({ name: 'Block Transmition' });
    Block = JSON.parse(Block)

    Block.Type = Type
    Block.Area = Area

    blockTransmition.on('Block', (req, cb) => {
        cb(Block);
    });
}

module.exports = Broadcast