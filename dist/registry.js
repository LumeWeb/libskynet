"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRegistrySignature = exports.taggedRegistryEntryKeys = exports.skylinkToResolverEntryData = exports.entryIDToSkylink = exports.deriveRegistryEntryID = exports.computeRegistrySignature = void 0;
const blake2b_js_1 = require("./blake2b.js");
const encoding_js_1 = require("./encoding.js");
const err_js_1 = require("./err.js");
const ed25519_js_1 = require("./ed25519.js");
const seed_js_1 = require("./seed.js");
const sha512_js_1 = require("./sha512.js");
const skylinkBitfield_js_1 = require("./skylinkBitfield.js");
// computeRegistrySignature will take a secret key and the required fields of a
// registry entry and use them to compute a registry signature, returning both
// the signature and the encoded data for the registry entry.
function computeRegistrySignature(secretKey, dataKey, data, revision) {
    // Check that the data is the right size.
    if (data.length > 86) {
        return [new Uint8Array(0), "registry data must be at most 86 bytes"];
    }
    // Build the encoded data.
    const [encodedData, errEPB] = (0, encoding_js_1.encodePrefixedBytes)(data);
    if (errEPB !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errEPB, "unable to encode provided registry data")];
    }
    const [encodedRevision, errEU64] = (0, encoding_js_1.encodeU64)(revision);
    if (errEU64 !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errEU64, "unable to encode the revision number")];
    }
    // Build the signing data.
    const dataToSign = new Uint8Array(dataKey.length + encodedData.length + encodedRevision.length);
    dataToSign.set(dataKey, 0);
    dataToSign.set(encodedData, dataKey.length);
    dataToSign.set(encodedRevision, dataKey.length + encodedData.length);
    const sigHash = (0, blake2b_js_1.blake2b)(dataToSign);
    // Sign the data.
    const [sig, errS] = (0, ed25519_js_1.ed25519Sign)(sigHash, secretKey);
    if (errS !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errS, "unable to sign registry entry")];
    }
    return [sig, null];
}
exports.computeRegistrySignature = computeRegistrySignature;
// deriveRegistryEntryID derives a registry entry ID from a provided pubkey and
// dataKey.
function deriveRegistryEntryID(pubkey, dataKey) {
    // Check the lengths of the inputs.
    if (pubkey.length !== 32) {
        return [new Uint8Array(0), `pubkey is invalid, length is wrong: ${pubkey.length}`];
    }
    if (dataKey.length !== 32) {
        return [new Uint8Array(0), `dataKey is not a valid hash, length is wrong: ${pubkey.length}`];
    }
    // Establish the encoding. First 16 bytes is a specifier, second 8
    // bytes declares the length of the pubkey, the next 32 bytes is the
    // pubkey and the final 32 bytes is the dataKey. This encoding is
    // determined by the Sia protocol.
    const encoding = new Uint8Array(16 + 8 + 32 + 32);
    // Set the specifier.
    const algorithm = Array.from("ed25519").map((char) => char.charCodeAt(0)); // encode algorithm as uint8
    encoding.set(algorithm, 0);
    // Set the pubkey.
    const [encodedLen, errU64] = (0, encoding_js_1.encodeU64)(32n);
    if (errU64 !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(errU64, "unable to encode pubkey length")];
    }
    encoding.set(encodedLen, 16);
    encoding.set(pubkey, 16 + 8);
    encoding.set(dataKey, 16 + 8 + 32);
    // Get the final ID by hashing the encoded data.
    const id = (0, blake2b_js_1.blake2b)(encoding);
    return [id, null];
}
exports.deriveRegistryEntryID = deriveRegistryEntryID;
// entryIDToSkylink converts a registry entry id to a resolver skylink.
function entryIDToSkylink(entryID) {
    // The way you build an entryID from a skylink is by prefixing two bytes,
    // where the first byte has a value of '1' and the second byte has a value
    // of '0'.
    const v2Skylink = new Uint8Array(skylinkBitfield_js_1.SKYLINK_U8_V1_V2_LENGTH);
    v2Skylink.set(entryID, 2);
    v2Skylink[0] = 1;
    return (0, encoding_js_1.bufToB64)(v2Skylink);
}
exports.entryIDToSkylink = entryIDToSkylink;
// skylinkToResolverEntryData will convert a skylink to the Uint8Array that can
// be set as the entry data of a resolver link to create a working resolver
// link.
//
// It's just a passthrough to b64ToBuf, but that's not obvious unless you are
// familiar with the internals of how resolver skylinks work. This function is
// provided as an intuitive alternative as part of a public API.
function skylinkToResolverEntryData(skylink) {
    return (0, encoding_js_1.b64ToBuf)(skylink);
}
exports.skylinkToResolverEntryData = skylinkToResolverEntryData;
// registryEntryKeys will use the user's seed to derive a keypair and a dataKey
// using the provided seed and tags. The keypairTag is a tag which salts the
// keypair. If you change the input keypairTag, the resulting public key and
// secret key will be different. The dataKey tag is the salt for the dataKey,
// if you provide a different dataKey tag, the resulting dataKey will be
// different.
//
// Note that changing the keypair tag will also change the resulting dataKey.
// The purpose of the keypair tag is to obfuscate the fact that two registry
// entries are owned by the same identity. This obfuscation would break if two
// different public keys were using the same dataKey. Changing the dataKey does
// not change the public key.
function taggedRegistryEntryKeys(seed, keypairTagStr, dataKeyTagStr = "") {
    if (seed.length !== seed_js_1.SEED_BYTES) {
        return [{}, new Uint8Array(0), "seed has the wrong length: " + seed.length.toString()];
    }
    if (keypairTagStr.length > 255) {
        return [
            {},
            new Uint8Array(0),
            "keypairTag must be less than 256 characters: " + keypairTagStr.toString(),
        ];
    }
    // Generate a unique set of entropy using the seed and keypairTag.
    const keypairTag = new TextEncoder().encode(keypairTagStr);
    const entropyInput = new Uint8Array(keypairTag.length + seed.length);
    entropyInput.set(seed, 0);
    entropyInput.set(keypairTag, seed.length);
    const keypairEntropy = (0, sha512_js_1.sha512)(entropyInput);
    // Use the seed to derive the dataKey for the registry entry. We use
    // a different tag to ensure that the dataKey is independently random, such
    // that the registry entry looks like it could be any other registry entry.
    //
    // We don't want it to be possible for two different combinations of
    // tags to end up with the same dataKey. If you don't use a length
    // prefix, for example the tags ["123", "456"] and ["12", "3456"] would
    // have the same dataKey. You have to add the length prefix to the
    // first tag otherwise you can get pairs like ["6", "4321"] and ["65",
    // "321"] which could end up with the same dataKey.
    const dataKeyTag = new TextEncoder().encode(dataKeyTagStr);
    const dataKeyInput = new Uint8Array(seed.length + 1 + keypairTag.length + dataKeyTag.length);
    const keypairLen = new Uint8Array([keypairTag.length]);
    dataKeyInput.set(seed);
    dataKeyInput.set(keypairLen, seed.length);
    dataKeyInput.set(keypairTag, seed.length + 1);
    dataKeyInput.set(dataKeyTag, seed.length + 1 + keypairTag.length);
    const dataKeyEntropy = (0, sha512_js_1.sha512)(dataKeyInput);
    // Create the private key for the registry entry. Private keys are only 32
    // bytes and the output of sha512 is 64 bytes so we slice to 32 bytes so that
    // we get the right amount of entropy.
    const [keypair, errKPFE] = (0, ed25519_js_1.ed25519KeypairFromEntropy)(keypairEntropy.slice(0, 32));
    if (errKPFE !== null) {
        return [{}, new Uint8Array(0), (0, err_js_1.addContextToErr)(errKPFE, "unable to derive keypair")];
    }
    // Data keys on Skynet are only 32 bytes but the output of sha512 is 64 bytes
    // so we cut it down to 32 bytes here.
    const dataKey = dataKeyEntropy.slice(0, 32);
    return [keypair, dataKey, null];
}
exports.taggedRegistryEntryKeys = taggedRegistryEntryKeys;
// verifyRegistrySignature will verify the signature of a registry entry.
//
// The return value is a boolean because usually a failed signatrue
// verification is due to malice, the error doesn't matter much and won't be
// helping anyone debug anything.
function verifyRegistrySignature(pubkey, dataKey, data, revision, sig) {
    const [encodedData, errEPB] = (0, encoding_js_1.encodePrefixedBytes)(data);
    if (errEPB !== null) {
        return false;
    }
    const [encodedRevision, errU64] = (0, encoding_js_1.encodeU64)(revision);
    if (errU64 !== null) {
        return false;
    }
    const dataToVerify = new Uint8Array(32 + 8 + data.length + 8);
    dataToVerify.set(dataKey, 0);
    dataToVerify.set(encodedData, 32);
    dataToVerify.set(encodedRevision, 32 + 8 + data.length);
    const sigHash = (0, blake2b_js_1.blake2b)(dataToVerify);
    return (0, ed25519_js_1.ed25519Verify)(sigHash, sig, pubkey);
}
exports.verifyRegistrySignature = verifyRegistrySignature;
