const cote = require('cote');
const timeService = new cote.Responder({ name: 'Transaction' });

timeService.on('Transaction', (req, cb) => {
    cb({"hello": "Hi"});
});