import assert = require("assert");
import fs = require("fs");
import path = require("path");
import mockFs = require("mock-fs");

import ProjectionLoader from "../lib/ProjectionLoader"
import { ProjectionResolver } from "../lib/ProjectionResolver"

describe("ProjectionResolveTests", () => {

    beforeEach(() => {
        mockFs({
            "rootPath": {
                "sub1-1": {
                    "sub2-1": {}
                },
                "sub1-2": {
                    "sub2-2": {}
                }
            }
        });
    });

    afterEach(() => {
        mockFs.restore();
    });


    it("Test resolving a projection in the same directory", () => { 

        // Write a projection file at root
        var projection = {
            alternates: {
                "*.ex1": "{}.ex2"
            }
        };

        fs.writeFileSync("project.json", JSON.stringify(projection), "utf8");

        // Write a test file
        fs.writeFileSync("test.ex1", "");
        fs.writeFileSync("test.ex2", "");

        var projectionLoader = new ProjectionLoader();
        var projectionResolver = new ProjectionResolver(projectionLoader);

        var alternateFile = projectionResolver.getAlternate("test.ex1");
        assert.strictEqual(alternateFile, "test.ex2");
    });

    it("Test resolving a projection in a subdirectory", () => {
        var projection = {
            alternates: {
                "sub1-1/*.tst":"sub1-2/{}.tst"
            }
        };

        fs.writeFileSync("project.json", JSON.stringify(projection), "utf8");

        fs.writeFileSync("rootPath/sub1-1/test.tst", "");
        fs.writeFileSync("rootPath/sub1-2/test.tst", "");

        var projectionLoader = new ProjectionLoader();
        var projectionResolver = new ProjectionResolver(projectionLoader);

        var alternateFile = projectionResolver.getAlternate("rootPath/sub1-1/test.tst");
        assert.strictEqual(alternateFile, "rootPath/sub1-2/test.tst");
    });
 });
