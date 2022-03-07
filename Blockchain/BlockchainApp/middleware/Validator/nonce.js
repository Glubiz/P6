const SHA256 = require('crypto-js/sha256');
const fs = require('fs');

function nonce(hash) {
    // Instantiates the newNonce variable, which is used to calculate the nonce of the block
    var newNonce = 1
    var checkNonce = false

    // Runs the while loop where it calculates the nonce from the problem newNonce^2 - previousNonce^2 concatenated with previousHash, if the hash of the problem starts with three zeros the while loop is terminated and the nonce is returned
    while (!checkNonce){
        var hashOperation = SHA256((newNonce**2).toString() + hash).toString()
        if (hashOperation.substring(0, 4) == '0000'){
            checkNonce = true
        } else {
            newNonce += 1
        }
    }
    return newNonce
}

function getNodes(){
    var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))
    var nodes = chain.nodes
    const result = nodes.filter(block => block.nonce == 0)
    for (let block of result) {
        nodes[block.index].nonce = nonce(block.hash)
    }
    console.log(result)
    fs.writeFileSync('./Blockchain/Validator.json', JSON.stringify(chain, null, 4))
}

function getPrices(){
    var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))
    var prices = chain.prices
    const result = prices.filter(block => block.nonce == 0)
    for (let block of result) {
        prices[block.index].nonce = nonce(block.hash)
    }
    fs.writeFileSync('./Blockchain/Validator.json', JSON.stringify(chain, null, 4))
}

function getProviders(){
    var chain = JSON.parse(fs.readFileSync('./Blockchain/Validator.json'))
    var providers = chain.providers
    const result = providers.filter(block => block.nonce == 0)
    for (let block of result) {
        providers[block.index].nonce = nonce(block.hash)
    }
    fs.writeFileSync('./Blockchain/Validator.json', JSON.stringify(chain, null, 4))
}

getNodes()
getPrices()
getProviders()
module.exports = {getNodes, getPrices, getProviders}