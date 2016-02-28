import IProjection from "./IProjection"

export interface IProjectionLoader {

    // Returns the alternate path for the file,
    // null if none
    getProjections(path: string): IProjection[];
}

export default IProjectionLoader;
