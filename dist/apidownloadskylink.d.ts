import { Err } from "./types.js";
declare function downloadSkylink(skylink: string): Promise<[data: Uint8Array, err: Err]>;
export { downloadSkylink };
