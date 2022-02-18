const SHA256 = require('crypto-js/sha256');
const getPreviousBlock = require('./previousBlock')

module.exports = function nonce(chainID) {
    // Calls the getPreviousBlock function to collect the hash of the previous block
    var previousBlock = getPreviousBlock(chainID)

    // Instantiates the newNonce variable, which is used to calculate the nonce of the block
    var newNonce = 1
    var checkNonce = false

    // Runs the while loop where it calculates the nonce from the problem newNonce^2 - previousNonce^2 concatenated with previousHash, if the hash of the problem starts with three zeros the while loop is terminated and the nonce is returned
    while (!checkNonce){
        var hashOperation = SHA256((newNonce**2 - previousBlock.nonce**2).toString() + previousBlock.hash).toString()
        if (hashOperation.substring(0, 3) == '000'){
            checkNonce = true
        } else {
            newNonce += 1
        }
    }
    return newNonce
}