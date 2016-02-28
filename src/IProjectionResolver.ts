export interface IProjectionResolver {

    // Returns the alternate path for the file,
    // null if none
    resolveProjection(file: string): string;
}

export default IProjectionResolver;
