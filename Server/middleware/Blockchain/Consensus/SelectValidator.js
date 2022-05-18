const fs = require('fs')

const Validators = []

const SelectValidators = () => {
    if(fs.existsSync('./middleware/Blockchain/Storage/Master.json')){
        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

        var Areas = Chain.Areas
        for (var Area of Areas){
            var Block = []

            // Needs to be changed to a percentage of the max available nodes
            for (var i = 0; i < Area.Nodes.length / 2; i++){
                // Finds a random validator node
                var index = Math.floor(Math.random() * parseInt(Area.Nodes.length - 1))

                if (!Area.Nodes[index].Blocked){
                    //Get the node id
                    var NodeID = Area.Nodes[index].NodeID
                    // If the node already exists in the array, then redo
                    if (Validators.includes(NodeID)){
                        i--
                    } else {
                        Block.push(NodeID)
                    }
    
                    if (i == (Area.Nodes.length / 2) - 1){
                        Validators.push({Area : Area, Validators : Block})
                    }
                } else {
                    i--
                }
            }
        }
    }
}

setInterval(SelectValidators, 900000)

module.exports = [Validators]