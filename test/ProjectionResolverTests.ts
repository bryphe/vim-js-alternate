import assert = require("assert");
import fs = require("fs-extra");
import os = require("os");
import path = require("path");
import mockFs = require("mock-fs");

import ProjectionLoader from "../lib/ProjectionLoader"
import { ProjectionResolver } from "../lib/ProjectionResolver"

describe("ProjectionResolverTests", () => {
    var testPath: string;

    beforeEach(() => {
        testPath = path.join(os.tmpdir(), "testFolder");
        if(fs.existsSync(testPath))
            fs.removeSync(testPath);
        fs.mkdirSync(testPath);
    });

    afterEach(() => {
        fs.removeSync(testPath);
    });


    it("Test resolving a projection in the same directory", () => { 

        // Write a projection file at root
        var projection = {
            alternates: {
                "*.ex1": "{}.ex2"
            }
        };

        writeFile("project.json", JSON.stringify(projection));

        // Write a test file
        writeFile("test.ex1", "");
        writeFile("test.ex2", "");

        var projectionLoader = new ProjectionLoader();
        var projectionResolver = new ProjectionResolver(projectionLoader);

        var alternateFile = projectionResolver.getAlternate(path.join(testPath, "test.ex1"));
        assert.strictEqual(path.normalize(alternateFile), path.normalize(path.join(testPath, "test.ex2")));
    });

    it("Test resolving a projection in a subdirectory", () => {
        var projection = {
            alternates: {
                "sub1-1/*.tst":"sub1-2/{}.tst"
            }
        };

        writeFile("project.json", JSON.stringify(projection));

        writeFile("rootPath/sub1-1/test.tst", "");
        writeFile("rootPath/sub1-2/test.tst", "");

        var projectionLoader = new ProjectionLoader();
        var projectionResolver = new ProjectionResolver(projectionLoader);

        var alternateFile = projectionResolver.getAlternate(path.join(testPath, "rootPath/sub1-1/test.tst"));
        assert.strictEqual(path.normalize(alternateFile), path.normalize(path.join(testPath, "rootPath/sub1-2/test.tst")));
    });

     function writeFile(fullPath: string, contents?: string) {
         contents = contents || "";
         fs.outputFileSync(path.join(testPath, fullPath), contents);
     }
 });

