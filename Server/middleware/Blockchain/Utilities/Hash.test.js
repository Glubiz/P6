const SHA256 = require('crypto-js/sha256');
const Hash = require("./Hash");

describe("Test should return a hash value", () => {
    test("It should return a hash", done => {
        var DateTime = new Date().getTime().toString()
        var Hashed = Hash('Create Genesis' + 'System', 'None', DateTime)
        
        expect(Hashed).toBe(SHA256('Create Genesis' + 'System' + 'None' + DateTime).toString());
        done()
    });
});

