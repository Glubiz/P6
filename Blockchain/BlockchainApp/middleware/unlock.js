const lockfile = require('proper-lockfile');

exports.module = function unlock(chainID){
    return lockfile.unlock('./Storage/Blockchains' + chainID + '.lock')
}