const fs = require('fs')
const paths = require('../../util/blockchainPath');


module.exports = {
    getPreviousNode(){
        // Loads the blockchain into the chain variable
        var chain = JSON.parse(fs.readFileSync(paths.path))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var previousBlock = chain.nodes[chain.nodes.length-1]
        return previousBlock
    }, 
    getPreviousPrice(){
        // Loads the blockchain into the chain variable
        var chain = JSON.parse(fs.readFileSync(paths.path))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var previousBlock = chain.prices[chain.prices.length-1]
        return previousBlock
    },
    getPreviousProvider(){
        // Loads the blockchain into the chain variable
        var chain = JSON.parse(fs.readFileSync(paths.path))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var previousBlock = chain.providers[chain.providers.length-1]
        return previousBlock
    }
}