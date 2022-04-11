const fs = require('fs')
const paths = require('./../../../util/blockchainPath');

module.exports = {
    getPreviousEvent(){
        // Loads the blockchain into the chain variable
        var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var PreviousBlock = Chain.Events[Chain.Events.length - 1]
        return PreviousBlock
    },
    getPreviousNode(AreaID){
        // Loads the blockchain into the chain variable
        var chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var previousBlock = chain.Nodes[chain.Nodes.length-1]
        return previousBlock
    }, 
    getPreviousArea(){
        // Loads the blockchain into the chain variable
        var chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var previousBlock = chain.Areas[chain.Areas.length-1]
        return previousBlock
    }, 
    getPreviousPrice(){
        // Loads the blockchain into the chain variable
        var Chain = JSON.parse(fs.readFileSync('./../Storage/Master.json'))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var previousBlock = Chain.PriceFunctions[Chain.PriceFunctions.length - 1]
        return previousBlock
    },
    getPreviousProvider(){
        // Loads the blockchain into the chain variable
        var chain = JSON.parse(fs.readFileSync(paths.path))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var previousBlock = chain.providers[chain.providers.length-1]
        return previousBlock
    },
}