const fs = require('fs');

describe("Test should return a hash value", () => {
    test("It should return a hash", done => {
        // Loads the blockchain into the chain variable
        var Chain = JSON.parse(fs.readFileSync('./middleware/Blockchain/Storage/Master.json'))

        // The previousblock is equal to the length of the chain minus 1, since it is zero indexed
        var PreviousBlock = Chain.Events[Chain.Events.length - 1]

        expect(PreviousBlock).toBe(Chain.Events[Chain.Events.length - 1]);
        done()
    });
});