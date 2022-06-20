const cote = require('cote');
const fs = require('fs')

const CollectedValidators = require('./../Blockchain/Consensus/CollectedValidators')
const NextValidatedBlock = require('./../Blockchain/Consensus/NextValidatedBlock')

const Subscriber = new cote.Subscriber({ name: 'Sub', subscribesTo: ['CalculatedBlock']})

Subscriber.on('CalculatedBlock', (Block) => {
    console.log('Block Received')
    var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))
    
    Block = JSON.parse(Block)
    CollectedValidators.CountedValidators()
    .then(List => {
        console.log(List)
        if(List.length > 0){
            //Checks if the node is in the top 50% of the blockchain. If it is, then start validating
            for (var i = 0; i <= parseInt(List.length / 2); i++) {
                console.log('Selected? ', List[i].Node == Self.ID)
                console.log(List[i].Node, Self.ID)
                if(List[i].Node == Self.ID){
                    console.log('New Block Received')
                    Block = JSON.stringify(Block)
                    NextValidatedBlock(Block)
                }
            }
        }
    })
})

module.exports = Subscriber