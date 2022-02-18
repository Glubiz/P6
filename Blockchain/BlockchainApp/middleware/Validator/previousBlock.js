const fs = require('fs')

module.exports = function getPreviousBlock(chainID){
    // Loads the blockchain into the chain variable
    var chain = JSON.parse(fs.readFileSync('./Blockchains/' + chainID + '.json'))

    // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
    var previousBlock = chain.data[chain.data.length-1]
    return previousBlock
}