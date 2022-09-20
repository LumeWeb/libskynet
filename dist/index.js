"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKYLINK_U8_V1_V2_LENGTH = exports.sha512 = exports.SHA512_HASH_SIZE = exports.validSeedPhrase = exports.seedPhraseToSeed = exports.seedToChecksumWords = exports.generateSeedPhraseDeterministic = exports.deriveMyskyRootKeypair = exports.deriveChildSeed = exports.SEED_BYTES = exports.verifyRegistrySignature = exports.taggedRegistryEntryKeys = exports.skylinkToResolverEntryData = exports.entryIDToSkylink = exports.deriveRegistryEntryID = exports.computeRegistrySignature = exports.parseJSON = exports.objAsString = exports.blake2bProofStackRoot = exports.blake2bMerkleRoot = exports.blake2bAddLeafBytesToProofStack = exports.namespaceInode = exports.encryptFileSmall = exports.decryptFileSmall = exports.newErrTracker = exports.addContextToErr = exports.otpEncrypt = exports.hexToBuf = exports.encodeU64 = exports.encodePrefixedBytes = exports.decodeU64 = exports.bufToStr = exports.bufToHex = exports.bufToB64 = exports.b64ToBuf = exports.ed25519Verify = exports.ed25519Sign = exports.ed25519KeypairFromEntropy = exports.dictionary = exports.DICTIONARY_UNIQUE_PREFIX = exports.checkObjProps = exports.blake2b = exports.BLAKE2B_HASH_SIZE = exports.defaultPortalList = exports.verifyRegistryWriteResponse = exports.verifyRegistryReadResponse = exports.progressiveFetch = exports.verifyDownloadResponse = exports.verifyDownload = exports.downloadSkylink = void 0;
exports.validateObjPropTypes = exports.jsonStringify = exports.verifyResolverLinkProofs = exports.validateSkylink = exports.validateSkyfilePath = exports.validateSkyfileMetadata = exports.skylinkV1Bitfield = exports.parseSkylinkBitfield = void 0;
var apidownloadskylink_js_1 = require("./apidownloadskylink.js");
Object.defineProperty(exports, "downloadSkylink", { enumerable: true, get: function () { return apidownloadskylink_js_1.downloadSkylink; } });
var apidownloadverify_js_1 = require("./apidownloadverify.js");
Object.defineProperty(exports, "verifyDownload", { enumerable: true, get: function () { return apidownloadverify_js_1.verifyDownload; } });
var apidownloadverifyresponse_js_1 = require("./apidownloadverifyresponse.js");
Object.defineProperty(exports, "verifyDownloadResponse", { enumerable: true, get: function () { return apidownloadverifyresponse_js_1.verifyDownloadResponse; } });
var apiprogressivefetch_js_1 = require("./apiprogressivefetch.js");
Object.defineProperty(exports, "progressiveFetch", { enumerable: true, get: function () { return apiprogressivefetch_js_1.progressiveFetch; } });
var apiregistryverify_js_1 = require("./apiregistryverify.js");
Object.defineProperty(exports, "verifyRegistryReadResponse", { enumerable: true, get: function () { return apiregistryverify_js_1.verifyRegistryReadResponse; } });
Object.defineProperty(exports, "verifyRegistryWriteResponse", { enumerable: true, get: function () { return apiregistryverify_js_1.verifyRegistryWriteResponse; } });
var apidefaultportals_js_1 = require("./apidefaultportals.js");
Object.defineProperty(exports, "defaultPortalList", { enumerable: true, get: function () { return apidefaultportals_js_1.defaultPortalList; } });
var blake2b_js_1 = require("./blake2b.js");
Object.defineProperty(exports, "BLAKE2B_HASH_SIZE", { enumerable: true, get: function () { return blake2b_js_1.BLAKE2B_HASH_SIZE; } });
Object.defineProperty(exports, "blake2b", { enumerable: true, get: function () { return blake2b_js_1.blake2b; } });
var checkObjProps_js_1 = require("./checkObjProps.js");
Object.defineProperty(exports, "checkObjProps", { enumerable: true, get: function () { return checkObjProps_js_1.checkObjProps; } });
var dictionary_js_1 = require("./dictionary.js");
Object.defineProperty(exports, "DICTIONARY_UNIQUE_PREFIX", { enumerable: true, get: function () { return dictionary_js_1.DICTIONARY_UNIQUE_PREFIX; } });
Object.defineProperty(exports, "dictionary", { enumerable: true, get: function () { return dictionary_js_1.dictionary; } });
var ed25519_js_1 = require("./ed25519.js");
Object.defineProperty(exports, "ed25519KeypairFromEntropy", { enumerable: true, get: function () { return ed25519_js_1.ed25519KeypairFromEntropy; } });
Object.defineProperty(exports, "ed25519Sign", { enumerable: true, get: function () { return ed25519_js_1.ed25519Sign; } });
Object.defineProperty(exports, "ed25519Verify", { enumerable: true, get: function () { return ed25519_js_1.ed25519Verify; } });
var encoding_js_1 = require("./encoding.js");
Object.defineProperty(exports, "b64ToBuf", { enumerable: true, get: function () { return encoding_js_1.b64ToBuf; } });
Object.defineProperty(exports, "bufToB64", { enumerable: true, get: function () { return encoding_js_1.bufToB64; } });
Object.defineProperty(exports, "bufToHex", { enumerable: true, get: function () { return encoding_js_1.bufToHex; } });
Object.defineProperty(exports, "bufToStr", { enumerable: true, get: function () { return encoding_js_1.bufToStr; } });
Object.defineProperty(exports, "decodeU64", { enumerable: true, get: function () { return encoding_js_1.decodeU64; } });
Object.defineProperty(exports, "encodePrefixedBytes", { enumerable: true, get: function () { return encoding_js_1.encodePrefixedBytes; } });
Object.defineProperty(exports, "encodeU64", { enumerable: true, get: function () { return encoding_js_1.encodeU64; } });
Object.defineProperty(exports, "hexToBuf", { enumerable: true, get: function () { return encoding_js_1.hexToBuf; } });
var encrypt_js_1 = require("./encrypt.js");
Object.defineProperty(exports, "otpEncrypt", { enumerable: true, get: function () { return encrypt_js_1.otpEncrypt; } });
var err_js_1 = require("./err.js");
Object.defineProperty(exports, "addContextToErr", { enumerable: true, get: function () { return err_js_1.addContextToErr; } });
var errTracker_js_1 = require("./errTracker.js");
Object.defineProperty(exports, "newErrTracker", { enumerable: true, get: function () { return errTracker_js_1.newErrTracker; } });
var filePrivate_js_1 = require("./filePrivate.js");
Object.defineProperty(exports, "decryptFileSmall", { enumerable: true, get: function () { return filePrivate_js_1.decryptFileSmall; } });
Object.defineProperty(exports, "encryptFileSmall", { enumerable: true, get: function () { return filePrivate_js_1.encryptFileSmall; } });
var inode_js_1 = require("./inode.js");
Object.defineProperty(exports, "namespaceInode", { enumerable: true, get: function () { return inode_js_1.namespaceInode; } });
var merkle_js_1 = require("./merkle.js");
Object.defineProperty(exports, "blake2bAddLeafBytesToProofStack", { enumerable: true, get: function () { return merkle_js_1.blake2bAddLeafBytesToProofStack; } });
Object.defineProperty(exports, "blake2bMerkleRoot", { enumerable: true, get: function () { return merkle_js_1.blake2bMerkleRoot; } });
Object.defineProperty(exports, "blake2bProofStackRoot", { enumerable: true, get: function () { return merkle_js_1.blake2bProofStackRoot; } });
var objAsString_js_1 = require("./objAsString.js");
Object.defineProperty(exports, "objAsString", { enumerable: true, get: function () { return objAsString_js_1.objAsString; } });
var parse_js_1 = require("./parse.js");
Object.defineProperty(exports, "parseJSON", { enumerable: true, get: function () { return parse_js_1.parseJSON; } });
var registry_js_1 = require("./registry.js");
Object.defineProperty(exports, "computeRegistrySignature", { enumerable: true, get: function () { return registry_js_1.computeRegistrySignature; } });
Object.defineProperty(exports, "deriveRegistryEntryID", { enumerable: true, get: function () { return registry_js_1.deriveRegistryEntryID; } });
Object.defineProperty(exports, "entryIDToSkylink", { enumerable: true, get: function () { return registry_js_1.entryIDToSkylink; } });
Object.defineProperty(exports, "skylinkToResolverEntryData", { enumerable: true, get: function () { return registry_js_1.skylinkToResolverEntryData; } });
Object.defineProperty(exports, "taggedRegistryEntryKeys", { enumerable: true, get: function () { return registry_js_1.taggedRegistryEntryKeys; } });
Object.defineProperty(exports, "verifyRegistrySignature", { enumerable: true, get: function () { return registry_js_1.verifyRegistrySignature; } });
var seed_js_1 = require("./seed.js");
Object.defineProperty(exports, "SEED_BYTES", { enumerable: true, get: function () { return seed_js_1.SEED_BYTES; } });
Object.defineProperty(exports, "deriveChildSeed", { enumerable: true, get: function () { return seed_js_1.deriveChildSeed; } });
Object.defineProperty(exports, "deriveMyskyRootKeypair", { enumerable: true, get: function () { return seed_js_1.deriveMyskyRootKeypair; } });
Object.defineProperty(exports, "generateSeedPhraseDeterministic", { enumerable: true, get: function () { return seed_js_1.generateSeedPhraseDeterministic; } });
Object.defineProperty(exports, "seedToChecksumWords", { enumerable: true, get: function () { return seed_js_1.seedToChecksumWords; } });
Object.defineProperty(exports, "seedPhraseToSeed", { enumerable: true, get: function () { return seed_js_1.seedPhraseToSeed; } });
Object.defineProperty(exports, "validSeedPhrase", { enumerable: true, get: function () { return seed_js_1.validSeedPhrase; } });
var sha512_js_1 = require("./sha512.js");
Object.defineProperty(exports, "SHA512_HASH_SIZE", { enumerable: true, get: function () { return sha512_js_1.SHA512_HASH_SIZE; } });
Object.defineProperty(exports, "sha512", { enumerable: true, get: function () { return sha512_js_1.sha512; } });
var skylinkBitfield_js_1 = require("./skylinkBitfield.js");
Object.defineProperty(exports, "SKYLINK_U8_V1_V2_LENGTH", { enumerable: true, get: function () { return skylinkBitfield_js_1.SKYLINK_U8_V1_V2_LENGTH; } });
Object.defineProperty(exports, "parseSkylinkBitfield", { enumerable: true, get: function () { return skylinkBitfield_js_1.parseSkylinkBitfield; } });
Object.defineProperty(exports, "skylinkV1Bitfield", { enumerable: true, get: function () { return skylinkBitfield_js_1.skylinkV1Bitfield; } });
var skylinkValidate_js_1 = require("./skylinkValidate.js");
Object.defineProperty(exports, "validateSkyfileMetadata", { enumerable: true, get: function () { return skylinkValidate_js_1.validateSkyfileMetadata; } });
Object.defineProperty(exports, "validateSkyfilePath", { enumerable: true, get: function () { return skylinkValidate_js_1.validateSkyfilePath; } });
Object.defineProperty(exports, "validateSkylink", { enumerable: true, get: function () { return skylinkValidate_js_1.validateSkylink; } });
var skylinkVerifyResolver_js_1 = require("./skylinkVerifyResolver.js");
Object.defineProperty(exports, "verifyResolverLinkProofs", { enumerable: true, get: function () { return skylinkVerifyResolver_js_1.verifyResolverLinkProofs; } });
var stringifyJSON_js_1 = require("./stringifyJSON.js");
Object.defineProperty(exports, "jsonStringify", { enumerable: true, get: function () { return stringifyJSON_js_1.jsonStringify; } });
var validateObjPropTypes_js_1 = require("./validateObjPropTypes.js");
Object.defineProperty(exports, "validateObjPropTypes", { enumerable: true, get: function () { return validateObjPropTypes_js_1.validateObjPropTypes; } });