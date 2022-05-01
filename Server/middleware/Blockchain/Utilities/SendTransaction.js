const cote = require('cote');
const BroadcastBlock = new cote.Responder({ name: 'Block' });

const Broadcast = (Block) => {
    Block = JSON.parse(Block)

    BroadcastBlock.on('Block', (req, cb) => {
        cb(Block);
    });

}

module.exports = Broadcast