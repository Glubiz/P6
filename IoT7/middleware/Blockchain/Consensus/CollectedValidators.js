const fs = require('fs')

var arr = []
var pending = []
var countedArr = []

//Creates the Node, Count pair in a JSON array.
const PrepareArrays = () => {
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    arr = []
    for(let i = 0; i < Chain.Nodes.length; i++) {
        arr.push({Node: Chain.Nodes[i].NodeID, Count: 0})
    }
    return new Promise((resolve) => {
        resolve(arr)
    });
}

// //Clears the pending list which contains the votes that needs to be counted
// const ClearPending = () => {
//     pending = []
//     return new Promise((resolve) => {
//         resolve()
//     });
// }

// //The script that runs the above mentioned functions (runs ever minute)
// const DataHandler = async() => {
//     await PrepareArrays()
    
//     // ClearPending()
// }

// setInterval(DataHandler, 60000)

//Exports 2 functions one to add the pending votes, and one to count up and sort the list of votes.
module.exports = {
    CollectedValidators (Block) {
        Block = JSON.parse(Block)
        Block = {Validators : Block.Validators, Sender : Block.Publisher}
        let index = false
        for(let i = 0; i < pending.length; i++) {
            if(pending[i].Sender === Block.Sender){
                index = i
            }
        }
        if(index === false){
            pending.push(Block)
        } else {
            pending[index] = Block
        }
    },
    async CountedValidators () {
        if(pending.length > 0){
            countedArr = await PrepareArrays()
            //Loops all the nodes to further loop all the selected validators
            for(let i = 0; i < pending.length; i++) {
                //Loops all selected validators and adds them up
                for(let j = 0; j < pending[i].Validators.length; j++) {
                    //Finds the correct node to increment
                    for(let k = 0; k < arr.length; k++) {
                        if(arr[k].Node == pending[i].Validators[j]){
                            countedArr[k].Count += 1
                        }
                    }
                }
            }
            countedArr = countedArr.slice().sort((a, b) => b.Count - a.Count)
        }
        return new Promise((resolve) => {
            resolve(countedArr)
        });
    }
}
