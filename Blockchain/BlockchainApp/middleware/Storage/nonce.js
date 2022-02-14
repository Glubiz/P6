const SHA256 = require('crypto-js/sha256');
const previousBlock = require('./previousBlock')

function nonce() {
    var previousHash = previousBlock.Hash
    var newNonce = 1
    var checkNonce = False
    while (!checkNonce){
        var hashOperation = SHA256(index + newNonce.toString() + chainID.toString() + previousHash).toString();
        if (hashOperation.substring(0, 4) == '0000'){
            checkNonce = True
        } else {
            newNonce += 1
        }
    }
    return newNonce
}

module.exports = nonce()