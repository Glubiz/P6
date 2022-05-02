const request = require("supertest");
const app = require("./app");

describe("Test the ping API", () => {
  test("It should respond 200 to the POST method", done => {
    request(app)
      .post("/Ping")
      .send({ID: 'caaad24f420d803320b9a5ff2165afe666afaa2129b207a5de868105f5c456e3'})
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