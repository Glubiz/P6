const fs = require('fs')

module.exports = function getPreviousBlock(chainID){
    var fileName = chainID + '.json'
    var chain = JSON.parse(fs.readFileSync('./Blockchains/' + fileName))
    if(chain.data.length > 1){
        var previousBlock = chain.data[chain.data.length-1]
    } else {
        var previousBlock = chain.data[0]
    }
    return previousBlock
}