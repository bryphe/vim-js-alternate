#!/usr/bin/env node

console.log("vim-js-alternate: initialized");

import ProjectionLoader from "./ProjectionLoader";
import { ProjectionResolver } from "./ProjectionResolver";

var Vim = require("vim-node-driver");
var vim = new Vim();

var projectionLoader = new ProjectionLoader();
var projectionResolver = new ProjectionResolver(projectionLoader);

vim.on("BufEnter", (args) => {
    var currentBuffer = args.currentBuffer;
    if(currentBuffer) {
        console.log("Resolving projection for: " + currentBuffer + " | " + projectionResolver.getAlternate(currentBuffer));
    }
});

vim.addCommand("Alternate", () => {
    vim.echo("Hello world");
});

console.log("command registered")
