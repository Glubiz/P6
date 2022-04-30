const cote = require('cote');
const client = new cote.Requester({ name: 'Block' });

const Reciever = () => {
    client.send({ type: 'Block' }, (Block) => {
        console.log(Block);
    });

}

module.exports = Reciever