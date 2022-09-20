import { Err } from "./types.js";
declare function validateSkyfilePath(path: string): string | null;
declare function validateSkyfileMetadata(metadata: any): string | null;
declare function validateSkylink(skylink: string | Uint8Array): Err;
export { validateSkyfileMetadata, validateSkyfilePath, validateSkylink };
