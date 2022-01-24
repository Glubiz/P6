const SHA256 = require('crypto-js/sha256');
const fs = require('fs');

class Block{
    constructor(index, timestamp, data, previousHash = ""){
        this.index = index.toString();
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }


    calculateHash(){
        return SHA256(this.index + this.timestamp + this.data + JSON.stringify(this.data)).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()]
    }
    createGenesisBlock(){
        return new Block(0, "01/01-2021", "Genesis")
    }
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}


class initChain{
    constructor(){
        this.initBlockchain = new Blockchain();
    }
    createSnap(){
        let rawdata = JSON.stringify(this.initBlockchain, null, 4);
        fs.writeFileSync('blockchain.json', rawdata);
    }
    Chain(){
        let data = fs.readFileSync('blockchain.json');
        let snap = ['']
        if (data.toString().length > 1){
            snap = JSON.parse(data);
        }
        if(snap.chain.length >= this.initBlockchain.chain.length){
            fs.writeFileSync('blockchain.json', '');
            console.log('snap')
            for (let data of snap.chain){
                this.initBlockchain.addBlock(new Block(this.initBlockchain.chain.length, data.timestamp, data.data))
            }
        } else {
            console.log('new')
            let dataIndex
            if (this.initBlockchain.chain.length){
                dataIndex = this.initBlockchain.chain.length
            } else {
                dataIndex = 0
            }
            this.initBlockchain.addBlock(new Block(dataIndex, "01/02-2021", "Transact"))
            this.initBlockchain.addBlock(new Block(dataIndex, "01/03-2021", "Tis"))
        }
        this.createSnap()
        console.log(JSON.stringify(this.initBlockchain, null, 4));
    }

    
}

let init = new initChain
init.Chain()