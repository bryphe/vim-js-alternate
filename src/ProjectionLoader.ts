import fs = require("fs");
import path = require("path");

import IAlternateFileMapping from "./IAlternateFileMapping"
import IProjection from "./IProjection"
import IProjectionLoader from "./IProjectionLoader"

var projectionJsonFileName = "project.json";

export default class ProjectionLoader implements IProjectionLoader {


    public getProjections(path: string): IProjection[] {
        var projections = [];
        this._loadProjectionsRecursively(path, projections);
        return projections;
    }

    private _loadProjectionsRecursively(workingDirectory: string, projections: IProjection[]): void {
        var parentPath = path.dirname(workingDirectory);
        var isRoot = parentPath === path.dirname(parentPath);

        var projectionFilePath = path.join(parentPath, projectionJsonFileName);
        if(fs.existsSync(projectionFilePath)) {
            var projectionJson = fs.readFileSync(projectionFilePath, "utf8");
            var projectionPaths = this._parseProjectionJson(projectionJson);

            var projection = {
                alternates: projectionPaths
            }

            projections.push(projection);
        }

        if(!isRoot) {
            this._loadProjectionsRecursively(parentPath, projections);
        }
    }

    private _parseProjectionJson(projectionJson: string): IAlternateFileMapping[] {
        var projection = JSON.parse(projectionJson);
        var ret = [];

        var alternates = projection.alternates;

        Object.keys(alternates).forEach((entry) => {
            var val = alternates[entry];
            ret.push({
                primaryFilePattern: entry,
                alternateFilePattern: val
            });
        });

        return ret;
    }
}

