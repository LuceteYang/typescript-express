import request from "supertest";
import app from "../src/app";

import { expect } from "chai";

describe("GET /api/v2/posts", () => {
  it("should return 200 OK", done => {
    request(app)
      .get("/api/v2/posts")
      .end((err, res) => {
        expect(res.error).to.be.false;
        done();
      })
      .expect(200);
  });
});


describe("POST /api/v2/posts", () => {
  it("should return 200 OK", done => {
    request(app)
      .post("/api/v2/posts")
      .field("title", "제목")
      // .attach('image', __dirname+"/../src/upload/upload_8182a413eeb367f9c421487f56f7d000.jpeg")
      .end((err, res) => {
        // expect(res.error).to.be.false;
        done();
      })
      .expect(200);
  });
});
