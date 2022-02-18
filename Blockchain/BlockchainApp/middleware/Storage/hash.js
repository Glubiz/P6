const SHA256 = require('crypto-js/sha256');

module.exports = function hash(index, nonce, data, previousHash, dateTime){
    //Returns the hash of the block
    return SHA256(index + nonce + data + previousHash + dateTime).toString();
}