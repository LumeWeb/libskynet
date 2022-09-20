"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyResolverLinkProofs = void 0;
const encoding_js_1 = require("./encoding.js");
const err_js_1 = require("./err.js");
const objAsString_js_1 = require("./objAsString.js");
const registry_js_1 = require("./registry.js");
const skylinkBitfield_js_1 = require("./skylinkBitfield.js");
const skylinkValidate_js_1 = require("./skylinkValidate.js");
const validateObjPropTypes_js_1 = require("./validateObjPropTypes.js");
// verifyResolverLinkProof will check that the given resolver proof matches the
// provided skylink. If the proof is correct and the signature matches, the
// data will be returned. The returned link will be a verified skylink.
//
// The input type for 'proof' is 'any' because it is an untrusted input that
// was decoded from JSON.
function verifyResolverLinkProof(skylink, proof) {
    // Verify the presented skylink is formatted correctly.
    if (skylink.length !== skylinkBitfield_js_1.SKYLINK_U8_V1_V2_LENGTH) {
        return [new Uint8Array(0), `skylink is malformed, expecting 34 bytes, got ${skylink.length} bytes`];
    }
    // Verify that all of the fields are present and have the correct type.
    const errVOPT1 = (0, validateObjPropTypes_js_1.validateObjPropTypes)(proof, [
        ["data", "string"],
        ["datakey", "string"],
        ["publickey", "object"],
        ["signature", "string"],
        ["type", "bigint"],
        ["revision", "bigint"],
    ]);
    if (errVOPT1 !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errVOPT1, "proof is not valid")];
    }
    const errVOPT2 = (0, validateObjPropTypes_js_1.validateObjPropTypes)(proof.publickey, [
        ["algorithm", "string"],
        ["key", "string"],
    ]);
    if (errVOPT2 !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errVOPT2, "proof is not valid")];
    }
    // Check that the type and algorithm have the expected values, as only one
    // value for each is considered valid.
    if (proof.publickey.algorithm !== "ed25519") {
        return [new Uint8Array(0), `pubkey has unrecognized algorithm, expected ed25519, got ${proof.publickey.algorithm}`];
    }
    if (proof.type !== 1n) {
        return [new Uint8Array(0), "registry entry has unrecognized type: " + (0, objAsString_js_1.objAsString)(proof.type)];
    }
    // Now that we've confirmed all the typings are correct, pull them out into
    // variables that will be easier to work with.
    const dataStr = proof.data;
    const datakeyStr = proof.datakey;
    const pubkeyStr = proof.publickey.key;
    const sigStr = proof.signature;
    const revision = proof.revision;
    // Decode all of the fields. They are presented in varied types and
    // encodings.
    const [data, errD] = (0, encoding_js_1.hexToBuf)(dataStr);
    if (errD !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errD, "data is invalid hex")];
    }
    const [datakey, errDK] = (0, encoding_js_1.hexToBuf)(datakeyStr);
    if (errDK !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errDK, "datakey is invalid hex")];
    }
    const [pubkey, errPK] = (0, encoding_js_1.b64ToBuf)(pubkeyStr);
    if (errPK !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errPK, "pubkey key is invalid base64")];
    }
    const [sig, errS] = (0, encoding_js_1.hexToBuf)(sigStr);
    if (errS !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errS, "signature is invalid hex")];
    }
    // Verify that the data is a skylink - this is a proof for a resolver,
    // which means the proof is pointing to a specific skylink.
    const errVS = (0, skylinkValidate_js_1.validateSkylink)(data);
    if (errVS !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errVS, "skylink is invalid")];
    }
    // Verify that the combination of the datakey and the public key match
    // the skylink.
    const [entryID, errREID] = (0, registry_js_1.deriveRegistryEntryID)(pubkey, datakey);
    if (errREID !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errREID, "proof pubkey is malformed")];
    }
    const linkID = skylink.slice(2, skylinkBitfield_js_1.SKYLINK_U8_V1_V2_LENGTH);
    for (let i = 0; i < entryID.length; i++) {
        if (entryID[i] !== linkID[i]) {
            return [new Uint8Array(0), "proof pubkey and datakey do not match the skylink root"];
        }
    }
    // Verify the signature.
    if (!(0, registry_js_1.verifyRegistrySignature)(pubkey, datakey, data, revision, sig)) {
        return [new Uint8Array(0), "signature does not match"];
    }
    return [data, null];
}
// verifyResolverLinkProofs will verify a set of resolver link proofs provided
// by a portal after performing a resolver link lookup. Each proof corresponds
// to one level of resolution. The final value returned will be the V1 skylink
// at the end of the chain.
//
// This function treats the proof as untrusted data and will verify all of the
// fields that are provided.
function verifyResolverLinkProofs(skylink, proof) {
    // Check that the proof is an array.
    if (!Array.isArray(proof)) {
        return [new Uint8Array(0), "provided proof is not an array: " + (0, objAsString_js_1.objAsString)(proof)];
    }
    if (proof.length === 0) {
        return [new Uint8Array(0), "proof array is empty"];
    }
    // Check each proof in the chain, returning the final skylink.
    for (let i = 0; i < proof.length; i++) {
        let errVRLP;
        [skylink, errVRLP] = verifyResolverLinkProof(skylink, proof[i]);
        if (errVRLP !== null) {
            return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errVRLP, "one of the resolution proofs is invalid")];
        }
    }
    // Though it says 'skylink', the verifier is actually just returning
    // whatever the registry data is. We need to check that the final value
    // is a V1 skylink.
    if (skylink.length !== skylinkBitfield_js_1.SKYLINK_U8_V1_V2_LENGTH) {
        return [new Uint8Array(0), "final value returned by the resolver link is not a skylink"];
    }
    const [version, , , errPSB] = (0, skylinkBitfield_js_1.parseSkylinkBitfield)(skylink);
    if (errPSB !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errPSB, "final value returned by resolver link is not a valid skylink")];
    }
    if (version !== 1n) {
        return [new Uint8Array(0), "final value returned by resolver link is not a v1 skylink"];
    }
    return [skylink, null];
}
exports.verifyResolverLinkProofs = verifyResolverLinkProofs;
