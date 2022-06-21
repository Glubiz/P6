const SHA256 = require('crypto-js/sha256');

module.exports = function Hash(Data, PreviousHash, DateTime){
    //Returns the hash of the block
    return SHA256(Data + PreviousHash + DateTime).toString();
}