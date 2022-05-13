const cote = require('cote');
const BroadcastBlock = new cote.Responder({ name: 'Block' });

const Broadcast = (Block, Type, Area) => {
    Block = JSON.parse(Block)

    Block.Type = Type
    Block.Area = Area

    BroadcastBlock.on('Block', (req, cb) => {
        cb(Block);
    });

}

module.exports = Broadcast