"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRegistryWriteResponse = exports.verifyRegistryReadResponse = void 0;
const encoding_js_1 = require("./encoding.js");
const err_js_1 = require("./err.js");
const objAsString_js_1 = require("./objAsString.js");
const parse_js_1 = require("./parse.js");
const registry_js_1 = require("./registry.js");
// verifyDecodedResp will verify the decoded response from a portal for a
// regRead call.
function verifyDecodedResp(resp, data, pubkey, datakey) {
    // Status is expected to be 200.
    if (resp.status !== 200) {
        return "expected 200 response status, got: " + (0, objAsString_js_1.objAsString)(resp.status);
    }
    // Verify that all required fields were provided.
    if (!("data" in data)) {
        return "expected data field in response";
    }
    if (typeof data.data !== "string") {
        return "expected data field to be a string";
    }
    if (!("revision" in data)) {
        return "expected revision in response";
    }
    if (typeof data.revision !== "bigint") {
        return "expected revision to be a number";
    }
    if (!("signature" in data)) {
        return "expected signature in response";
    }
    if (typeof data.signature !== "string") {
        return "expected signature to be a string";
    }
    // Parse out the fields we need.
    const [entryData, errHTB] = (0, encoding_js_1.hexToBuf)(data.data);
    if (errHTB !== null) {
        return "could not decode registry data from response";
    }
    const [sig, errHTB2] = (0, encoding_js_1.hexToBuf)(data.signature);
    if (errHTB2 !== null) {
        return "could not decode signature from response";
    }
    // Verify the signature.
    if (!(0, registry_js_1.verifyRegistrySignature)(pubkey, datakey, entryData, data.revision, sig)) {
        return "signature mismatch";
    }
    // TODO: Need to be handling type 2 registry entries here otherwise we will
    // be flagging non malicious portals as malicious.
    return null;
}
// verifyRegistryReadResponse will verify that the registry read response from
// the portal was correct.
function verifyRegistryReadResponse(resp, pubkey, datakey) {
    return new Promise((resolve) => {
        resp
            .text()
            .then((str) => {
            const [obj, errPJ] = (0, parse_js_1.parseJSON)(str);
            if (errPJ !== null) {
                resolve((0, err_js_1.addContextToErr)(errPJ, "unable to parse registry response"));
                return;
            }
            const errVDR = verifyDecodedResp(resp, obj, pubkey, datakey);
            if (errVDR !== null) {
                resolve((0, err_js_1.addContextToErr)(errVDR, "regRead response failed verification"));
                return;
            }
            resolve(null);
        })
            .catch((err) => {
            resolve((0, err_js_1.addContextToErr)((0, objAsString_js_1.objAsString)(err), "unable to decode response"));
        });
    });
}
exports.verifyRegistryReadResponse = verifyRegistryReadResponse;
// verifyRegistryWriteResponse will verify that the response from a
// registryWrite call is valid. There's not much to verify beyond looking for
// the right response code, as the portal is not providing us with data, just
// confirming that a write succeeded.
function verifyRegistryWriteResponse(resp) {
    return new Promise((resolve) => {
        if (resp.status === 204) {
            resolve(null);
        }
        resolve("expecting 200 status code for registry write, got:" + resp.status.toString());
    });
}
exports.verifyRegistryWriteResponse = verifyRegistryWriteResponse;
