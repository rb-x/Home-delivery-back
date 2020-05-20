import request from "supertest";
import app from "../index";

describe("Test the root path", () => {
  test("It should response the GET method with status 200", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe("Test the eleve route", () => {
  test("It should response the GET method with status 200", done => {
    request(app)
      .get("/eleves/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe("Test the formers route", () => {
  test("It should response the GET method with status 200", done => {
    request(app)
      .get("/formers/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

// SESSION ROUTE TEST
