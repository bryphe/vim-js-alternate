declare var vim;
declare var log; 

log.verbose("vim-js-alternate: initialized");

import ProjectionLoader from "./ProjectionLoader";
import { ProjectionResolver } from "./ProjectionResolver";

var projectionLoader = new ProjectionLoader();
var projectionResolver = new ProjectionResolver(projectionLoader);

var currentBuffer;
var currentAlternateFile = null;


var alternateCache = {};

vim.on("BufEnter", (args) => {
    currentBuffer = args.currentBuffer;
    if(currentBuffer) {
        currentAlternateFile = projectionResolver.getAlternate(currentBuffer);
        log.verbose("Resolving projection for: " + currentBuffer + " | " + projectionResolver.getAlternate(currentBuffer));
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

log.verbose("command registered")
