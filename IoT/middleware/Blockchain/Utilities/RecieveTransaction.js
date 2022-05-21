const cote = require('cote');
const fs = require('fs')

const CreateBlock = require('../CreateBlock/CreateBlock')
const Validate = require('../Consensus/Validate')
const CollectedValidators = require('../Consensus/CollectedValidators')



const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['Block']})

Subscriber.on('Block', (Block) => {
    var BlockCheck
    Block = JSON.parse(Block)
    
    //Find out which type of block was sent, and runs the associated code for it
    if(Block.Type === 'Transaction') {
        console.log(Block.Type);

        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
        var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

        BlockCheck = Chain.Area[0].Transactions.filter(e => e.Hash === Block.Hash)

        BlockCheck.length == 0 && Block.PreviousHash == Chain.Area[0].Transactions[Chain.Area[0].Transactions.length - 1] && CreateBlock('Create Transaction', Block.NodeID, Block.TimeStamp, Block.ProviderID, Self.AreaCode, Block.AmountBought)

    } else if (Block.Type === 'Full') {
        console.log(Block.Type);

        if(fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
            var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

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
    } else if (Block.Type === 'Price Function'){

    } else if (Block.Type === 'Provider'){
        
    } else if (Block.Type === 'Validators'){
        var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

        if (Block.Sender != Self.ChainID){
            CollectedValidators.CollectedValidators(Block)
        }
    } else if (Block.Type === 'Ping'){
        var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

        if (Block.NodeID != Self.ChainID){
            var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

            for (var i = 0; i < Chain.Area.Nodes.length; i++){
                if(Block.NodeID == Chain.Area.Nodes[i].NodeID){
                    Chain.Area.Nodes[i].Pings = Block.Pings
                    Chain.Area.Nodes[i].PingUpdated = Block.Now

                    fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
                }
            }
        }
    }
})

module.exports = Subscriber