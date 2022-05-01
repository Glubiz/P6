const fs = require('fs');
const Snap = require('./Snap')

describe("Test the snap functionality", () => {
    test("It should return ok", done => {
        var Action = Snap()

        expect(Action).toBe({});
        done()
    });
});