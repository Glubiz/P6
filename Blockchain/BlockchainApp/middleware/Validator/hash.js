const SHA256 = require('crypto-js/sha256');

module.exports = function hash(index, nonce, chainID, port, previousHash, dateTime){
    //Returns the hash of the block
    return SHA256(index + nonce + chainID + port + previousHash + dateTime).toString();
}