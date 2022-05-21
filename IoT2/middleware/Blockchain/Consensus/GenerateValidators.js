const fs = require('fs')
const Publish = require('../Utilities/SendTransaction')


var Validators = {}

const SelectValidators = () => {
    var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

    if(fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

        var Areas = Chain.Area
        for (var Area of Areas){
            var Block = []
            Validators = {}

            // Needs to be changed to a percentage of the max available nodes
            for (var i = 0; i < Area.Nodes.length / 2; i++){
                // Finds a random validator node
                var index = Math.floor(Math.random() * parseInt(Area.Nodes.length - 1))
                if (!Area.Nodes[index].Blocked){
                    //Get the node id
                    var NodeID = Area.Nodes[index].NodeID
                    // If the node already exists in the array, then redo
                    if (Block.includes(NodeID)){
                        i--
                    } else {
                        Block.push(NodeID)
                    }
    
                    if (i == (Area.Nodes.length / 2) - 1){
                        Validators = {}
                        Validators.Validators = Block
                        Validators.Sender = Self.ChainID

                        return new Promise((resolve) => {
                            resolve()
                        });
                    }
                } else {
                    i--
                }
            }
        }
    }
    
}

const SendValidators = async () => {
    SelectValidators()
    .then(() => {
        if(Validators) {
            Validators = JSON.stringify(Validators)
            Publish(Validators, 'Validators')
        }
    })
}

setInterval(SendValidators, 15000)

module.exports = SendValidators