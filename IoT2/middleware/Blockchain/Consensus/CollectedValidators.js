const fs = require('fs')

var arr = []
var pending = []
var countedArr

const CollectedValidators = (Block) => {
    Block = JSON.parse(Block)
    Block = {Validators : Block.Validators, Sender : Block.Sender}
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
    console.log(pending)

}

const PrepareArrays = () => {
    var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))
    arr = []
    for(let i = 0; i < Chain.Area[0].Nodes.length; i++) {
        arr.push({Node: Chain.Area[0].Nodes[i].NodeID, Count: 0})
    }
    return new Promise((resolve) => {
        resolve()
    });
}


const CountedValidators = () => {
    if(pending.length > 0){
        countedArr = arr
        //Loops all the nodes to further loop all the selected validators
        for(let i = 0; i < pending.length; i++) {
            //Loops all selected validators and adds them up
            for(let j = 0; j < pending[i].Validators.length; j++) {
                //Finds the correct node to increment
                for(let k = 0; k < arr.length; k++) {
                    if(arr[k].Node == pending[i].Validators){
                        countedArr[k].Count += 1
                    }
                }
            }
        }
        countedArr = countedArr.slice().sort((a, b) => b.Count - a.Count)

    }
    return new Promise((resolve) => {
        resolve()
    });
}

const ClearPending = () => {
    pending = []
    return new Promise((resolve) => {
        resolve()
    });
}

const DataHandler = async() => {
    await PrepareArrays()
    await ClearPending()
    CountedValidators()
}

setInterval(DataHandler, 900000)


module.exports = {CollectedValidators, countedArr}