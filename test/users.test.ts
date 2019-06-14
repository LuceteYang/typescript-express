import request from "supertest";
import app from "../src/app";

import { expect } from "chai";

describe("GET /api/v1/hello-world", () => {
  it("should return 200 OK", done => {
    request(app)
      .get("/api/v1/hello-world")
      .end((err, res) => {
        expect(res.error).to.be.false;
        done();
      })
      .expect(200);
  });
});

describe("GET /api/v1/error", () => {
  it("should return 500 OK", done => {
    request(app)
      .get("/api/v1/error")
      .expect(500, done);
  });
});
