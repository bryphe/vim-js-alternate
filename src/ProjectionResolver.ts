import IProjectionResolver from "./IProjectionResolver";
import path = require("path");

export class ProjectionResolver implements IProjectionResolver {

    private _projectionLoader: IProjectionLoader;

    constructor(projectionLoader: IProjectionLoader) {
        this._projectionLoader = projectionLoader;
    }

    public resolveProjection(file: string): string {
        var workingDirectory = path.dirname(file);

        var projections = this._projectionLoader.getProjections(path);

        return null;
    }
}
