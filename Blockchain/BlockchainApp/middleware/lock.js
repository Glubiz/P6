const lockfile = require('proper-lockfile');

// exports.module = function lock(chainID){
//     return lockfile.lock('./Storage/Blockchains' + chainID + '.json')
// }

function lock(chainID){
    lockfile.lock('./Storage/Blockchains/' + chainID + '.json')
    .then(() => {
        lockfile.check('./Storage/Blockchains/' + chainID + '.json')
        .then(isLocked => {
            console.log(isLocked)
        })
    })
    return 200
}

console.log(lock('kfkaksfkas'))