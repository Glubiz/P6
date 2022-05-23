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
        console.log(Block);

        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
        var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

        //Checks if the transaction exist
        BlockCheck = Chain.Area[0].Transactions.filter(e => e.Hash === Block.Hash)
        console.log(BlockCheck.length, Chain.Area[0].Transactions[Chain.Area[0].Transactions.length - 1])
        //If the transaction does not exist created the block.
        if(BlockCheck.length == 0){
            if (Chain.Area[0].Transactions.length == 0){
                CreateBlock('Create Transaction', Block.NodeID, Block.TimeStamp, Block.ProviderID, Block.AmountBought, Block.Price).then(block => console.log('Block', block))

            } else {
                if(Block.PreviousHash == Chain.Area[0].Transactions[Chain.Area[0].Transactions.length - 1].Hash){
                    CreateBlock('Create Transaction', Block.NodeID, Block.TimeStamp, Block.ProviderID, Block.AmountBought, Block.Price).then(block => console.log('Block', block))
                }
            }
        }
    } else if (Block.Type === 'Full') {
        console.log(Block.Type);

        if(fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
            var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

            //If the received blockchain is longer than the one in storage
            if (Block.Events.length > Chain.Events.length){
                
                //Validates the blockchain before overwriting the old blockchain
                for(let i = 0; i < Chain.Events.length; i++){
                    console.log(i, JSON.stringify(Chain.Events[i]) !== JSON.stringify(Block.Events[i]))
                    
                    if (JSON.stringify(Chain.Events[i]) !== JSON.stringify(Block.Events[i])){
                        break
                    }

                    if (i == Chain.Events.length - 1){
                        Validate.validateChain(JSON.stringify(Block))
                        fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Block, null, 4))
                    }
                }
            }
        }
    } else if (Block.Type === 'Price Function'){

    } else if (Block.Type === 'Provider'){
        
    } else if (Block.Type === 'Validators'){
        console.log(Block.Type);

        //Used to find out how many votes each node has received
        CollectedValidators.CollectedValidators(JSON.stringify(Block))
    } else if (Block.Type === 'Ping'){
        console.log(Block.Type);

        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

        //Finds the pinged node and updates the "Pings" and "PingUpdated"
        for (var i = 0; i < Chain.Area[0].Nodes.length; i++){
            if(Block.NodeID == Chain.Area[0].Nodes[i].NodeID){
                Chain.Area[0].Nodes[i].Pings = Block.Pings
                Chain.Area[0].Nodes[i].PingUpdated = Block.Now

                fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
            }
        }
    } else if (Block.Type === 'Validation OK'){
        console.log(Block.Type);

        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
        //If the validated chain is long or equal length to the one in storage, overwrite
        if (Block.Events.length >= Chain.Events.length){
            Chain = Block
            fs.writeFileSync('./middleware/Blockchain/Storage/Master.json', JSON.stringify(Chain, null, 4))
        } 
    }
})

module.exports = Subscriber