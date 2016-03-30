import path = require("path");

export default class File {
    
    public static getRootDirectory(fullPath: string): string {
        if(path.dirname(fullPath) === fullPath)
            return fullPath;

        return File.getRootDirectory(path.dirname(fullPath));
    }

    public static getPathDifference(fullPath: string, subRelativePath: string): string {
        var fullPathParts = File.splitPath(fullPath);
        fullPathParts = fullPathParts || [];
        var subRelativePathParts = File.splitPath(subRelativePath);

        var deltaPathParts = [];
        for(var i = 0; i < fullPathParts.length; i++) {
            if(subRelativePathParts[0] === fullPathParts[i])
                break;

            deltaPathParts.push(fullPathParts[i]);
        }

        return path.join.apply(path, deltaPathParts)
    }

    public static splitPath(fullPath: string): string[] {
        return path.normalize(fullPath).split(path.sep);
    }
}


