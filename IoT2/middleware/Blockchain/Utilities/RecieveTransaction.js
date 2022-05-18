const cote = require('cote');
const fs = require('fs')

const CreateBlock = require('../CreateBlock/CreateBlock')
const Validate = require('../Consensus/Validate')


const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['Block']})

Subscriber.on('Block', (Block) => {
    var BlockCheck
    Block = JSON.parse(Block)
    
    if(Block.Type === 'Transaction') {
        console.log(Block.Type);

        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
        var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

        BlockCheck = Chain.Area[0].Transactions.filter(e => e.Hash === Block.Hash)

        BlockCheck.length == 0 && CreateBlock('Create Transaction', Block.NodeID, Block.ProviderID, Self.AreaCode, Block.AmountBought)

    } else if (Block.Type === 'Full') {
        console.log(Block.Type);

        if(fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
            var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
            console.log(Block.Events.length > Chain.Events.length);
            console.log(Block.Events.length, Chain.Events.length);
            if (Block.Events.length > Chain.Events.length){
                for(let i = 0; i < Chain.Events.length; i++){
                    console.log(i, JSON.stringify(Chain.Events[i]) !== JSON.stringify(Block.Events[i]))
                    
                    if (JSON.stringify(Chain.Events[i]) !== JSON.stringify(Block.Events[i])){
                        break
                    }

                    if (i == Chain.Events.length - 1){
                        Validate(JSON.stringify(Block))
                        fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Block, null, 4))
                    }
                }
            }
        }
    }
})

module.exports = Subscriber