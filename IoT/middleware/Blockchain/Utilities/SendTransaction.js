const cote = require('cote');
const fs = require('fs');

//Chooses the channel for broardcasting
const Publisher = new cote.Publisher({ name: 'Pub', broadcasts: ['Block'] })

const Publish = (Block, Type) => {
    //Loads the block
    Block = JSON.parse(Block)
    //Adds the block type
    Block.Type = Type
    //Publishes the block
    Publisher.publish('Block', JSON.stringify(Block))
}


module.exports = Publish