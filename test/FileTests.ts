import assert = require("assert");
import fs = require("fs");
import path = require("path");

import File from "../lib/File";

describe("File", () => {

    describe("getRootDirectory", () => {

        it("resolves path correctly", () => {
            assert.strictEqual(File.getRootDirectory("D:/test1"), "D:/");
        });
    });

    describe("getPathDifference", () => {
        it("resolves simple path", () => {
            var diff = File.getPathDifference("D:/test1/test2/test3", "test2/test3");
            assert.strictEqual(diff, path.join("D:", "test1"));
        });

        it("handles case where there is no common path", () => {
            var diff = File.getPathDifference("D:/test1", "C:/test2");
            assert.strictEqual(diff, path.join("D:", "test1"));
        });
    });
});
