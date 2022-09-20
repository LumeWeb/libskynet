"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadSkylink = void 0;
const apidownloadverifyresponse_js_1 = require("./apidownloadverifyresponse.js");
const apiprogressivefetch_js_1 = require("./apiprogressivefetch.js");
const apidefaultportals_js_1 = require("./apidefaultportals.js");
const err_js_1 = require("./err.js");
const encoding_js_1 = require("./encoding.js");
const objAsString_js_1 = require("./objAsString.js");
const skylinkValidate_js_1 = require("./skylinkValidate.js");
// downloadSkylink will download the provided skylink.
function downloadSkylink(skylink) {
    return new Promise((resolve) => {
        // Get the Uint8Array of the input skylink.
        const [u8Link, errBTB] = (0, encoding_js_1.b64ToBuf)(skylink);
        if (errBTB !== null) {
            resolve([new Uint8Array(0), (0, err_js_1.addContextToErr)(errBTB, "unable to decode skylink")]);
            return;
        }
        const errVS = (0, skylinkValidate_js_1.validateSkylink)(u8Link);
        if (errVS !== null) {
            resolve([new Uint8Array(0), (0, err_js_1.addContextToErr)(errVS, "skylink is invalid")]);
            return;
        }
        // Prepare the download call.
        const endpoint = "/skynet/trustless/basesector/" + skylink;
        const fileDataPtr = { fileData: new Uint8Array(0), err: null };
        const verifyFunction = function (response) {
            return (0, apidownloadverifyresponse_js_1.verifyDownloadResponse)(response, u8Link, fileDataPtr);
        };
        // Perform the download call.
        (0, apiprogressivefetch_js_1.progressiveFetch)(endpoint, null, apidefaultportals_js_1.defaultPortalList, verifyFunction).then((result) => {
            // Return an error if the call failed.
            if (result.success !== true) {
                // Check for a 404.
                for (let i = 0; i < result.responsesFailed.length; i++) {
                    if (result.responsesFailed[i] !== null && result.responsesFailed[i].status === 404) {
                        resolve([new Uint8Array(0), "404"]);
                        return;
                    }
                }
                // Error is not a 404, return the logs as the error.
                const err = (0, objAsString_js_1.objAsString)(result.logs);
                resolve([new Uint8Array(0), (0, err_js_1.addContextToErr)(err, "unable to complete download")]);
                return;
            }
            // Check if the portal is honest but the download is corrupt.
            if (fileDataPtr.err !== null) {
                resolve([new Uint8Array(0), (0, err_js_1.addContextToErr)(fileDataPtr.err, "download is corrupt")]);
                return;
            }
            resolve([fileDataPtr.fileData, null]);
        });
    });
}
exports.downloadSkylink = downloadSkylink;
