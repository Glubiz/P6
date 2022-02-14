const SHA256 = require('crypto-js/sha256');

function hash(index, nonce, chainID, previousHash, dateTime){
    return SHA256(index + nonce + chainID + previousHash + dateTime).toString();
}

module.exports = hash()