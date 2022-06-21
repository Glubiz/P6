const fs = require('fs')

const SendPayload = require('./../../MQTT/SendPayload')

const NextValidatedBlock = (Block) => {
    Block = JSON.parse(Block)
    var temp = Block.Publisher
    delete Block.Publisher
    console.log('NextValidatedBlock: ', Block)
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

    if(Block.EventBlock.PreviousHash === Chain.Events[Chain.Events.length - 1].Hash){
        if(Block.EventBlock.Type === 'Create Node'){
            if(Block.temp.PreviousHash === Chain.Nodes[Chain.Nodes.length - 1].Hash){
                Block.To = temp
                SendPayload(JSON.stringify(Block), 'BlockAccepted')
            }
        } else if(Block.EventBlock.Type === 'Create Provider'){
            if(Chain.Providers.length > 0){
                if(Block.temp.PreviousHash === Chain.Providers[Chain.Providers.length - 1].Hash){
                    Block.To = temp
                    SendPayload(JSON.stringify(Block), 'BlockAccepted')
                }
            } else if (Block.temp.PreviousHash === Block.EventBlock.Hash){
                Block.To = temp
                SendPayload(JSON.stringify(Block), 'BlockAccepted')
            }
        } else if(Block.EventBlock.Type === 'Create Price Function'){
            if(Chain.PriceFunctions.length > 0){
                if(Block.temp.PreviousHash === Chain.PriceFunctions[Chain.PriceFunctions.length - 1].Hash){
                    Block.To = temp
                    SendPayload(JSON.stringify(Block), 'BlockAccepted')
                }
            } else if (Block.temp.PreviousHash === Block.EventBlock.Hash){
                Block.To = temp
                SendPayload(JSON.stringify(Block), 'BlockAccepted')
            }
        } else if(Block.EventBlock.Type === 'Create Transaction'){
            if(Chain.Transactions.length > 0){
                if(Block.temp.PreviousHash === Chain.Transactions[Chain.Transactions.length - 1].Hash){
                    Block.To = temp
                    SendPayload(JSON.stringify(Block), 'BlockAccepted')
                }
            } else if (Block.temp.PreviousHash === Block.EventBlock.Hash){
                Block.To = temp
                SendPayload(JSON.stringify(Block), 'BlockAccepted')
            }
        }
    }
    console.log(Chain)
}

module.exports = NextValidatedBlock