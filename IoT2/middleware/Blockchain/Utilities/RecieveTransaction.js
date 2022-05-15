const cote = require('cote');
const fs = require('fs')

const CreateBlock = require('../CreateBlock/CreateBlock')

const Reciever = () => {
    const client = new cote.Requester({ name: 'Client' });

    client.send({ type: 'Block' }, (Block) => {
        var BlockCheck
        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

        console.log(Block)
        
        if(Block.Type === 'Transaction') {
            BlockCheck = Chain.Area[0].Transactions.filter(e => e.Hash === Block.Hash)

            BlockCheck.length == 0 && CreateBlock('Create Transaction', Block.NodeID, Block.ProviderID, Block.Area, Block.AmountBought)
        } 
        console.log(Block);
    })
}

setInterval(Reciever, 15000)

module.exports = Reciever()