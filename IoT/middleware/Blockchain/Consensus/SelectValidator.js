const Pool = require('./Ping')

const Validators = []

const SelectValidators = () => {
    // Needs to be changed to a percentage of the max available nodes
    for (var i = 0; i < 5; i++){
        // Finds a random validator node
        var index = Math.floor(Math.random() * parseInt(Pool.length - 1))
        // If the node already exists in the array, then redo
        if (Validators.includes(index)){
            i--
        } else {
            Validators.push(index)
        }
    }
}

setInterval(SelectValidators, 900000)

module.exports = [Validators]