const cote = require('cote');
const client = new cote.Requester({ name: 'Client' });

client.send({ type: 'Transaction' }, (Transaction) => {
    console.log(Transaction);
});