"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyDownloadResponse = void 0;
const apidownloadverify_js_1 = require("./apidownloadverify.js");
const err_js_1 = require("./err.js");
const objAsString_js_1 = require("./objAsString.js");
const parse_js_1 = require("./parse.js");
const skylinkBitfield_js_1 = require("./skylinkBitfield.js");
const skylinkVerifyResolver_js_1 = require("./skylinkVerifyResolver.js");
// Establish the function that verifies the result is correct.
//
// The fileDataPtr input is an empty object that verifyDownloadResponse will
// fill with the fileData. It basically allows the verify function to
// communicate back to the caller. Note that the verify function might be
// called multiple times in a row if early portals fail to retrieve the data,
// but the verify function doesn't write to the fileDataPtr until it knows that
// the download is final.
function verifyDownloadResponse(response, u8Link, fileDataPtr) {
    return new Promise((resolve) => {
        // Currently the only valid successful response for a download is a
        // 200. Anything else is unexpected and counts as an error.
        if (response.status !== 200) {
            resolve("unrecognized response status " + (0, objAsString_js_1.objAsString)(response.status) + ", expecting 200");
            return;
        }
        // Break the input link into its components.
        let [version, offset, fetchSize, errBF] = (0, skylinkBitfield_js_1.parseSkylinkBitfield)(u8Link);
        if (errBF !== null) {
            resolve((0, err_js_1.addContextToErr)(errBF, "skylink bitfield could not be parsed"));
            return;
        }
        // If this is a resolver skylink, we need to verify the resolver
        // proofs. This conditional will update the value of 'u8Link' to be the
        // value of the fully resolved link.
        if (version === 2n) {
            // Verify the resolver proofs and update the link to the correct
            // link.
            const proofJSON = response.headers.get("skynet-proof");
            if (proofJSON === null || proofJSON === undefined) {
                resolve("response did not include resolver proofs");
                return;
            }
            const [proof, errPJ] = (0, parse_js_1.parseJSON)(proofJSON);
            if (errPJ !== null) {
                resolve((0, err_js_1.addContextToErr)(errPJ, "unable to parse resolver link proofs"));
                return;
            }
            // We need to update the u8Link in-place so that the rest of the
            // function doesn't need special handling.
            let errVRLP;
            [u8Link, errVRLP] = (0, skylinkVerifyResolver_js_1.verifyResolverLinkProofs)(u8Link, proof);
            if (errVRLP !== null) {
                resolve((0, err_js_1.addContextToErr)(errVRLP, "unable to verify resolver link proofs"));
                return;
            }
            // We also need to update the parsed bitfield, because the link has
            // changed.
            [version, offset, fetchSize, errBF] = (0, skylinkBitfield_js_1.parseSkylinkBitfield)(u8Link);
            if (errBF !== null) {
                resolve((0, err_js_1.addContextToErr)(errBF, "fully resolved link has invalid bitfield"));
                return;
            }
            if (version !== 1n) {
                resolve("fully resolved link does not have version 1");
                return;
            }
        }
        response
            .arrayBuffer()
            .then((buf) => {
            const [fileData, portalAtFault, errVD] = (0, apidownloadverify_js_1.verifyDownload)(u8Link.slice(2, 34), offset, fetchSize, buf);
            if (errVD !== null && portalAtFault) {
                resolve("received invalid download from portal");
                return;
            }
            if (errVD !== null) {
                fileDataPtr.fileData = new Uint8Array(0);
                fileDataPtr.err = (0, err_js_1.addContextToErr)(errVD, "file is corrupt");
            }
            else {
                fileDataPtr.fileData = fileData;
                fileDataPtr.err = null;
            }
            // If the portal is not at fault, we tell progressiveFetch that
            // the download was a success. The caller will have to check
            // the fileDataPtr
            resolve(null);
        })
            .catch((err) => {
            resolve((0, err_js_1.addContextToErr)(err, "unable to read response body"));
        });
    });
}
exports.verifyDownloadResponse = verifyDownloadResponse;
