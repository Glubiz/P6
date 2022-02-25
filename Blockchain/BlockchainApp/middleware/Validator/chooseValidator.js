const fs = require('fs')
var arr = []

function findValidatorNode(){
    var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))
    var maxIndex = chain.data.length
    // If the network of nodes (IoT gateways) is big enough, we want 10% of the network to validate the chain. the nodes that has been in the network the longest weighs the most on the proccess
    // for (var i = 0; i < parseInt(maxIndex * 0.1); i++){
    
    arr = []
    for (var i = 0; i < 5; i++){
        // Finds a random validator node
        var index = Math.floor(Math.random() * parseInt(maxIndex))
        console.log(index)
        if (arr.includes(index)){
            i--
        } else {
            arr.push(index)
        }
    }
    console.log(arr)
}
setInterval(findValidatorNode, 3000)

module.exports = [arr]