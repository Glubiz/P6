const fs = require('fs')

function findValidatorNode(){
    var chain = JSON.parse(fs.readFileSync('./Blockchains/' + 'kfkaksfkas' + '.json'))
    var maxIndex = chain.data.length - 1
    // Finds a random validator node
    var index = Math.floor(Math.random() * parseInt(maxIndex))
    console.log(index)
    return index
}
setInterval(findValidatorNode, 3000)

module.exports = findValidatorNode()