#!/usr/bin/env node

console.log("vim-js-alternate: initialized");

import ProjectionLoader from "./ProjectionLoader";
import { ProjectionResolver } from "./ProjectionResolver";

var Vim = require("vim-node-driver");
var vim = new Vim();

var projectionLoader = new ProjectionLoader();
var projectionResolver = new ProjectionResolver(projectionLoader);

var currentBuffer;
var currentAlternateFile = null;

var alternateCache = {};

vim.on("BufEnter", (args) => {
    currentBuffer = args.currentBuffer;
    if(currentBuffer) {
        currentAlternateFile = projectionResolver.getAlternate(currentBuffer);
        console.log("Resolving projection for: " + currentBuffer + " | " + projectionResolver.getAlternate(currentBuffer));
    }
});

vim.addCommand("Alternate", () => {

    var alternateFile = currentAlternateFile;

    // If not resolved, try the cache
    if(!alternateFile)
        alternateFile = alternateCache[currentBuffer];

    if(alternateFile) {
        // Store a reverse mapping so we can jump back easily
        alternateCache[alternateFile] = currentBuffer;
        vim.exec("edit " + alternateFile) 
    }

});

console.log("command registered")
