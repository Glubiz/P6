const fs = require('fs')

function getPreviousBlock(chainID){
    var chain = JSON.parse(fs.readFileSync(chainID.toString() + '.json'))
    return chain.Data[-1]
}

module.exports = getPreviousBlock()