const fs = require('fs')

function getPreviousNode(){
    // Loads the blockchain into the chain variable
    var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))

    // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
    var previousBlock = chain.nodes[chain.nodes.length-1]
    return previousBlock
}

function getPreviousPrice(){
    // Loads the blockchain into the chain variable
    var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))

    // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
    var previousBlock = chain.prices[chain.prices.length-1]
    return previousBlock
}

module.exports = {
    getPreviousNode(){
        // Loads the blockchain into the chain variable
        var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var previousBlock = chain.nodes[chain.nodes.length-1]
        return previousBlock
    }, 
    getPreviousPrice(){
        // Loads the blockchain into the chain variable
        var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var previousBlock = chain.prices[chain.prices.length-1]
        return previousBlock
    }
}