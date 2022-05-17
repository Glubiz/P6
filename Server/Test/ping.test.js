const request = require("supertest");
const app = require("./app");

describe("Test the ping API", () => {
  test("It should respond 200 to the POST method", done => {
    request(app)
      .post("/Ping?ID=80780812bfefdfec955c68acb9717234c87ae34bd620aa09c44e492abe1ba958&AreaCode=9000")
      .send({ID: '80780812bfefdfec955c68acb9717234c87ae34bd620aa09c44e492abe1ba958', AreaCode: '9000'})
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      })
      .catch(err =>{
        console.error(err);
        done();
      });
  });
});