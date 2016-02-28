import IAlternateFileMapping from "./IAlternateFileMapping";

export interface IProjection {
    basePath: string;
    alternates: IAlternateFileMapping[];
}

export default IProjection;
