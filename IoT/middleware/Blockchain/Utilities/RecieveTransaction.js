const cote = require('cote');
const client = new cote.Requester({ name: 'Block' });

const CreateBlock = require('../CreateBlock/CreateBlock')

const Reciever = () => {
    client.send({ type: 'Block' }, (Block) => {
        if(Block.Type === 'Transaction'){
            CreateBlock('Create Transaction', Block.NodeID, Block.ProviderID, Block.Area, Block.AmountBought)
        }
        console.log(Block);
    });

}

module.exports = Reciever