import { Err } from "./types.js";
interface fileDataObj {
    fileData: Uint8Array;
    err: Err;
}
declare function verifyDownloadResponse(response: Response, u8Link: Uint8Array, fileDataPtr: fileDataObj): Promise<Err>;
export { fileDataObj, verifyDownloadResponse };
