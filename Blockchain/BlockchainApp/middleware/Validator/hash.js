const SHA256 = require('crypto-js/sha256');

module.exports = function hash(index, data, previousHash, dateTime){
    //Returns the hash of the block
    return SHA256(index + data + previousHash + dateTime).toString();
}