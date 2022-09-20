import { Err } from "./types.js";
declare function decryptFileSmall(seed: Uint8Array, inode: string, fullDataOrig: Uint8Array): [metadata: any, fileData: Uint8Array, err: Err];
declare function encryptFileSmall(seed: Uint8Array, inode: string, revision: bigint, metadata: any, fileData: Uint8Array, minFullSize?: bigint): [encryptedData: Uint8Array, err: Err];
declare function getPaddedFileSize(originalSize: bigint): bigint;
export { decryptFileSmall, encryptFileSmall, getPaddedFileSize };
