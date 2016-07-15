declare var vim;

import ProjectionLoader from "./ProjectionLoader";
import { ProjectionResolver } from "./ProjectionResolver";

var projectionLoader = new ProjectionLoader();
var projectionResolver = new ProjectionResolver(projectionLoader);

var currentBuffer;
var currentAlternateFile = null;

var alternateCache = {};

vim.on("BufEnter", (args) => {
    currentBuffer = args.currentBuffer;
    if (currentBuffer) {
        currentAlternateFile = projectionResolver.getAlternate(currentBuffer);
        console.log("Resolving projection for: " + currentBuffer + " | " + projectionResolver.getAlternate(currentBuffer));
    }
});

vim.addCommand("Alternate", () => {

    var alternateFile = currentAlternateFile;

    // If not resolved, try the cache
    if (!alternateFile)
        alternateFile = alternateCache[currentBuffer];

    if (alternateFile) {
        // Store a reverse mapping so we can jump back easily
        alternateCache[alternateFile] = currentBuffer;
        vim.exec("edit " + alternateFile)
    } else {
        vim.echohl("No alternate file found.", "WarningMsg");
    }

});

vim.addCommand("AlternateProcessId", () => {
    vim.echo(process.pid);
});
