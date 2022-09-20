import { Err } from "./types.js";
declare function verifyRegistryReadResponse(resp: Response, pubkey: Uint8Array, datakey: Uint8Array): Promise<Err>;
declare function verifyRegistryWriteResponse(resp: Response): Promise<Err>;
export { verifyRegistryReadResponse, verifyRegistryWriteResponse };
