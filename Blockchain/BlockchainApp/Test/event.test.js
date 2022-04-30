const request = require("supertest");
const app = require("./app");

var data = {
  ID : 'caaad24f420d803320b9a5ff2165afe666afaa2129b207a5de868105f5c456e3',
  APIKey : 'cb0fe3f6ffdc9b1ea29a623e1c773b92608150ad48932457bbebd12250cb2847',
  Provider : '071a47a60d21d3a54067da8b467bea5e781fb94a33ddb17fae587eba6648bca6',
  Area : '9000',
  Usage : '1'
}

describe("Test the ping API", () => {
  test("It should response the GET method", done => {
    request(app)
      .post("/EventHash")
      .send(data)
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