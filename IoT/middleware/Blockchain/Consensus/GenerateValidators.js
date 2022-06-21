const fs = require('fs')
const Publish = require('./../../MQTT/SendPayload')



const SelectValidators = () => {
    
    var Self = JSON.parse(fs.readFileSync('./middleware/Storage/Keys.json'))

    if(fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
        var Block = []

        //Finds half of the nodes for validating
        for (var i = 0; i < Chain.Nodes.length / 2; i++){
            // Finds a random validator node
            var index = Math.floor(Math.random() * parseInt(Chain.Nodes.length - 1))

            if (!Chain.Nodes[index].Blocked){
                //Get the node id
                var NodeID = Chain.Nodes[index].NodeID
                // If the node already exists in the array, then redo
                if (Block.includes(NodeID)){
                    i--
                } else {
                    Block.push(NodeID)
                }
                //If this is the last iteration create a JSON object that contains the chosen nodes and the ChainID
                if (i == parseInt((Chain.Nodes.length / 2) - 1)){
                    var Validators = {}
                    Validators.Validators = Block
                    Validators.Sender = Self.ChainID
                    return new Promise((resolve) => {
                        resolve(Validators)
                    });
                }
            } else {
                i--
            }
        }

    } else {
        return new Promise((reject) => {
            reject()
        });
    }
    
}

//Sends the chosen nodes to the other nodes in the area (runs every minute)
const SendValidators = async () => {
    if(fs.existsSync('./middleware/Storage/Keys.json')){
        SelectValidators()
        .then(Validators => {
            if(Validators) {
                Validators = JSON.stringify(Validators)
                Publish(Validators, 'ValidatorCandidates')
            }
        })
        .catch(async () => {
            console.log('No nodes in blockchain yet ')
        })
    }
}
setInterval(SendValidators, 30000)

module.exports = SendValidators