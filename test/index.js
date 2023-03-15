/* eslint-disable global-require */

// ===============
// DEPENDENCIES
// ===============

/**
 * Node dependencies.
 */

const assert = require("node:assert").strict;
const process = require("node:process");

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
  describe("startup", () => {
    before((done) => {
      app.server.once("closed", () => {
        done();
      });

      process.emit("SIGTERM");
    });

    describe("app.server.start() when server is not running", () => {
      it("should start listening", (done) => {
        assert.equal(app.server.listening, false, "should not be listening");

        app.server.start((err) => {
          assert.ifError(err, "callback should not have error param");
          assert.equal(app.server.listening, true, "should be listening");
          done();
        });
      });
    });

    describe("app.server.start() called when server is running", () => {
      it("should not throw error", (done) => {
        assert.equal(app.server.listening, true, "should be listening");

        app.server.start((err) => {
          assert.ok(err, "callback should have error param");
          assert.equal(app.server.listening, true, "should be listening");
          done();
        });
      });
    });
  });

  describe("routing", () => {
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
  });

  describe("graceful shutdown", () => {
    describe("SIGTERM when server is running", () => {
      it("should stop listening", (done) => {
        assert.equal(app.server.listening, true, "should be listening");

        app.server.once("closed", (err) => {
          assert.ifError(err, "callback should not have error param");
          assert.equal(app.server.listening, false, "should not be listening");
          done();
        });

        process.emit("SIGTERM");
      });
    });

    describe("SIGTERM when server is not running", () => {
      it("should not throw error", (done) => {
        assert.equal(app.server.listening, false, "should not be listening");

        app.server.once("closed", (err) => {
          assert.ok(err, "callback should have error param");
          assert.equal(app.server.listening, false, "should not be listening");
          done();
        });

        process.emit("SIGTERM");
      });
    });
  });

  after((done) => {
    app.server.once("closed", () => {
      done();
    });

    process.emit("SIGTERM");
  });
});
