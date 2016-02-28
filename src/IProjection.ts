import IProjectionPath from "./IProjectionPath";

export interface IProjection {
    basePath: string;
    alternatePaths: IAlternateFileMapping[];
}

export default IProjection;
