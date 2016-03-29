import minimatch = require("minimatch");
import path = require("path");
import glob = require("glob");

import IProjectionLoader from "./IProjectionLoader";
import IProjectionResolver from "./IProjectionResolver";

export class ProjectionResolver implements IProjectionResolver {

    private _projectionLoader: IProjectionLoader;

    constructor(projectionLoader: IProjectionLoader) {
        this._projectionLoader = projectionLoader;
    }

    public getAlternate(file: string): string {
        var workingDirectory = path.dirname(file);

        var projections = this._projectionLoader.getProjections(workingDirectory);

        for(var i = 0; i < projections.length; i++) { 
            var projection = projections[i];
            
            var alternates = projection.alternates;
            // TODO: Get rid of this
            var basePath = ".";

            for(var j = 0; j < alternates.length; j++) {
                var globPath = this._getGlobPathForPrimary(basePath, alternates[j].primaryFilePattern);

                if(minimatch(file, globPath)) {
                    // Try and find matching string
                    var fullFilePath = path.resolve(file);
                    
                    // TODO: Get relative path from the matched path, and the globPath
                    // var relativeBase = getRelativePath(fullFilePath, alternates[j].primaryFilePattern);
                    // Do path.parse on both paths:
                    // -take all the ones on the left, until it matches something on the right
                    // -use that as the delta

                    var alternate = this._findAlternate(file, this._getGlobPathForAlternate(basePath, alternates[j].alternateFilePattern));
                    if(alternate)
                        return alternate;
                }
            }
        }

        return null;
    }

    private _getGlobPathForPrimary(basePath: string, filePattern: string): string {
        if(filePattern.indexOf("{workspaceRoot}") >= 0) {
            filePattern = filePattern.replace("{workspaceRoot}", basePath);
            return path.normalize(filePattern);
        } else {
            return path.join(basePath, "/**/", filePattern);
        }
    }

    // TODO: Replace this to just concatenate the relative path that was resolved
    private _getGlobPathForAlternate(basePath: string, filePattern: string): string {
        if(filePattern.indexOf("{workspaceRoot}") >= 0) {
            filePattern = filePattern.replace("{workspaceRoot}", basePath);
            return path.normalize(filePattern);
        } else {
            return path.join(basePath, "/**/", filePattern);
        }
    }

    private _findAlternate(filePath, alternateGlobPath: string): string {
        // Replace '{}' with the filename
        var fileNameWithoutExtension = path.basename(filePath, path.extname(filePath));

        alternateGlobPath = alternateGlobPath.replace("{}", fileNameWithoutExtension);

        var matches = glob.sync(alternateGlobPath);

        if(matches.length > 0)
            return matches[0];

        return null;
    }
}
