/* eslint-disable global-require */

// ===============
// DEPENDENCIES
// ===============

/**
 * Module dependencies.
 */

const request = require("supertest");

/**
 * Internal dependencies.
 */

const app = require("../src/app");

// ===============
// TESTS
// ===============

describe("express", () => {
  before(() => {
    app.server.start();
  });

  describe("favicon", () => {
    it("should return 204", (done) => {
      request(app.server).get("/favicon.ico").expect(204, done);
    });
  });

  describe("path found", () => {
    it("should return 200", (done) => {
      request(app.server).get("/").expect(200, done);
    });
  });

  describe("path not found", () => {
    it("should return 404", (done) => {
      request(app.server).get("/random").expect(404, done);
    });
  });

  // clean up
  after((done) => {
    app.server.close(done);
  });
});
