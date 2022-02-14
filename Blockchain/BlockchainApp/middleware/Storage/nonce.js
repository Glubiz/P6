const SHA256 = require('crypto-js/sha256');
const getPreviousBlock = require('./previousBlock')

module.exports = function nonce(chainID) {
    var previousBlock = getPreviousBlock(chainID)
    var previousHash = previousBlock.hash
    var previousNonce = previousBlock.nonce
    var newNonce = 1
    var checkNonce = false
    while (!checkNonce){
        var hashOperation = SHA256((newNonce**2 - previousNonce**2).toString() + previousHash).toString()
        console.log(hashOperation)
        console.log(previousNonce)
        console.log(newNonce)
        if (hashOperation.substring(0, 3) == '000'){
            checkNonce = true
        } else {
            newNonce += 1
        }
    }
    return newNonce
}