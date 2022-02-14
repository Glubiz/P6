// const SHA256 = require('crypto-js/sha256');
// const fs = require('fs');

// class BlockChain {
//     constructor(){
//         this.chain = []
//         this.block = this.createBlock(nonce = '0', previousHash = '0')
//     }

//     calculateHash(index, nonce, chainID, previousHash, dateTime){
//         return SHA256(index + nonce + chainID + previousHash + dateTime).toString();
//     }

//     createBlock(nonce, chainID = '0', key = '0', previousHash) {
//         if (this.chain.length){
//             var dateTime = new Date().toString()
//             var index = this.chain.length + 1

//             var block = {
//                 'index' : index, 
//                 'nonce' : nonce,
//                 'chainID' : chainID,
//                 'key' : key,
//                 'hash' : calculateHash(index.toString(), nonce, chainID, previousHash, dateTime.toString()),
//                 'previousHash' : previousHash,
//                 'timeStamp' : dateTime,
//             }
            
//             this.chain.append(block)
//             return block
//         }
//     }

//     getPreviousBlock(){
//         return this.chain[-1]
//     }
    
//     proofOfWork(previousNonce){
//         var hashOperation
//         var newNonce = 1
//         var checkNonce = False
//         while (!checkNonce){
//             hashOperation = SHA256(newNonce**2 - previousNonce**2).toString()
//             if (hashOperation.substring(0, 3) == '0000'){
//                 checkNonce = True
//             } else {
//                 newNonce += 1
//             }
//         }
//         return newNonce
//     }
// }

// new BlockChain

// module.exports = BlockChain