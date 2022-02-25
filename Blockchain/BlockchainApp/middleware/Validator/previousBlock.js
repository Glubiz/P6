const fs = require('fs')

function getPreviousBlock(){
    // Loads the blockchain into the chain variable
    var chain = JSON.parse(fs.readFileSync('./middleware/Validator/Blockchain/Validator.json'))

    // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
    var previousBlock = chain.data[chain.data.length-1]
    return previousBlock
}

module.exports = getPreviousBlock