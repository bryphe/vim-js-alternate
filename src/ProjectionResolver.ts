import minimatch = require("minimatch");
import path = require("path");

import IProjectionLoader from "./IProjectionLoader";
import IProjectionResolver from "./IProjectionResolver";

export class ProjectionResolver implements IProjectionResolver {

    private _projectionLoader: IProjectionLoader;

    constructor(projectionLoader: IProjectionLoader) {
        this._projectionLoader = projectionLoader;
    }

    public resolveProjection(file: string): string {
        var workingDirectory = path.dirname(file);

        var projections = this._projectionLoader.getProjections(workingDirectory);

        for(var i = 0; i < projections.length; i++) { 
            var projection = projections[i];
            
            var basePath = projection.basePath;
            var alternates = projection.alternates;

            for(var j = 0; j < alternates.length; j++) {
                var globPath = path.join(basePath, "/**/", alternates[j].primaryFilePattern);

                if(minimatch(file, globPath)) {
                    console.log("FOUND HIT");
                }
            }
        }

        return null;
    }
}
