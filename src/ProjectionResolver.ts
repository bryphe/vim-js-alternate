import minimatch = require("minimatch");
import path = require("path");
import glob = require("glob");

import File from "./File";
import IProjectionLoader from "./IProjectionLoader";
import IProjectionResolver from "./IProjectionResolver";

export class ProjectionResolver implements IProjectionResolver {

    private _projectionLoader: IProjectionLoader;

    constructor(projectionLoader: IProjectionLoader) {
        this._projectionLoader = projectionLoader;
    }

    public getAlternate(file: string): string {
        var projections = this._projectionLoader.getProjections(file);


        for (var i = 0; i < projections.length; i++) {
            var projection = projections[i];

            var alternates = projection.alternates;
            var basePath = File.getRootDirectory(file);

            this._findAlternate.apply

            for (var j = 0; j < alternates.length; j++) {
                var globPath = this._getGlobPathForPrimary(basePath, alternates[j].primaryFilePattern);

                if (minimatch(file, globPath)) {
                    // Try and find matching string
                    var fullFilePath = path.resolve(file);

                    var parsedPath = path.parse(fullFilePath);

                    var relativePath = File.getPathDifference(parsedPath.dir, alternates[j].primaryFilePattern);
                    var alternatePath = path.join(relativePath, alternates[j].alternateFilePattern);

                    var alternate = this._findAlternate(file, alternatePath);
                    if (alternate)
                        return alternate;
                }
            }
        }
        return null;
    }

    private _getGlobPathForPrimary(basePath: string, filePattern: string): string {
        return path.join(basePath, "/**/", filePattern);
    }

    private _findAlternate(filePath, alternateGlobPath: string): string {
        // Replace '{}' with the filename
        var fileNameWithoutExtension = path.basename(filePath, path.extname(filePath));

        alternateGlobPath = alternateGlobPath.replace("{}", fileNameWithoutExtension);

        var matches = glob.sync(alternateGlobPath);

        if (matches.length > 0)
            return matches[0];

        return null;
    }
}
