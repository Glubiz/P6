const cote = require('cote');
const fs = require('fs')

//Chooses the channel for broardcasting
const Publisher = new cote.Publisher({ name: 'Pub', broadcasts: ['ValidatedBlock', 'StartUp', 'NewNode', 'RequestChain', 'ValidatorCandidates', 'PendingBlock', 'CalculatedBlock', 'BlockAccepted'] })

const Publish = async (Block, Type) => {
    if(fs.existsSync('./middleware/Storage/Keys.json')){
        const Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
        //Loads the block
        Block = JSON.parse(Block)
        console.log(Block)
        Block.Publisher = Self.ID
    
        console.log(Type, "published")
        //Publishes the block
        Type === 'ValidatedBlock' && Publisher.publish('ValidatedBlock', JSON.stringify(Block))
        Type === 'StartUp' && Publisher.publish('StartUp', JSON.stringify(Block))
        Type === 'NewNode' && Publisher.publish('NewNode', JSON.stringify(Block))
        Type === 'RequestChain' && Publisher.publish('RequestChain', JSON.stringify(Block))
        Type === 'ValidatorCandidates' && Publisher.publish('ValidatorCandidates', JSON.stringify(Block))
        Type === 'PendingBlock' && Publisher.publish('PendingBlock', JSON.stringify(Block))
        Type === 'CalculatedBlock' && Publisher.publish('CalculatedBlock', JSON.stringify(Block))
        Type === 'BlockAccepted' && Publisher.publish('BlockAccepted', JSON.stringify(Block))

    } else {
        await new Promise((resolve => setTimeout(resolve,5000)))

        Publish(Block, Type)
    }
}


module.exports = Publish