
var arr = []
var countedArr = []

const CollectedValidators = (Block) => {
    let index = false
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] === Block.Sender){
            index = i
        }
    }
    if(index === false){
        arr.push(Block)
    } else {
        arr[index] = Block
    }
}

const CountedValidators = () => {
    if(arr.length > 0){
        countedArr = []
        for(let i = 0; i < arr.length; i++) {
            for(let j = 0; j < arr[i].Validators.length; j++) {
                if(j < arr[i].Validators.length - 1){
                    countedArr.push({})
                }
            }
        }
    }
}

module.exports = CollectedValidators