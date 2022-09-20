"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSkylink = exports.validateSkyfilePath = exports.validateSkyfileMetadata = void 0;
const err_js_1 = require("./err.js");
const encoding_js_1 = require("./encoding.js");
const skylinkBitfield_js_1 = require("./skylinkBitfield.js");
// validateSkyfilePath checks whether the provided path is a valid path for a
// file in a skylink.
function validateSkyfilePath(path) {
    if (path === "") {
        return "path cannot be blank";
    }
    if (path === "..") {
        return "path cannot be ..";
    }
    if (path === ".") {
        return "path cannot be .";
    }
    if (path.startsWith("/")) {
        return "metdata.Filename cannot start with /";
    }
    if (path.startsWith("../")) {
        return "metdata.Filename cannot start with ../";
    }
    if (path.startsWith("./")) {
        return "metdata.Filename cannot start with ./";
    }
    const pathElems = path.split("/");
    for (let i = 0; i < pathElems.length; i++) {
        if (pathElems[i] === ".") {
            return "path cannot have a . element";
        }
        if (pathElems[i] === "..") {
            return "path cannot have a .. element";
        }
        if (pathElems[i] === "") {
            return "path cannot have an empty element, cannot contain //";
        }
    }
    return null;
}
exports.validateSkyfilePath = validateSkyfilePath;
// validateSkyfileMetadata checks whether the provided metadata is valid
// metadata for a skyfile.
function validateSkyfileMetadata(metadata) {
    // Check that the filename is valid.
    if (!("Filename" in metadata)) {
        return "metadata.Filename does not exist";
    }
    if (typeof metadata.Filename !== "string") {
        return "metadata.Filename is not a string";
    }
    const errVSP = validateSkyfilePath(metadata.Filename);
    if (errVSP !== null) {
        return (0, err_js_1.addContextToErr)(errVSP, "metadata.Filename does not have a valid path");
    }
    // Check that there are no subfiles.
    if ("Subfiles" in metadata) {
        // TODO: Fill this out using code from
        // skymodules.ValidateSkyfileMetadata to support subfiles.
        return "cannot upload files that have subfiles";
    }
    // Check that the default path rules are being respected.
    if ("DisableDefaultPath" in metadata && "DefaultPath" in metadata) {
        return "cannot set both a DefaultPath and also DisableDefaultPath";
    }
    if ("DefaultPath" in metadata) {
        // TODO: Fill this out with code from
        // skymodules.validateDefaultPath to support subfiles and
        // default paths.
        return "cannot set a default path if there are no subfiles";
    }
    if ("TryFiles" in metadata) {
        if (!metadata.TryFiles.IsArray()) {
            return "metadata.TryFiles must be an array";
        }
        if (metadata.TryFiles.length === 0) {
            return "metadata.TryFiles should not be empty";
        }
        if ("DefaultPath" in metadata) {
            return "metadata.TryFiles cannot be used alongside DefaultPath";
        }
        if ("DisableDefaultPath" in metadata) {
            return "metadata.TryFiles cannot be used alongside DisableDefaultPath";
        }
        // TODO: finish the TryFiles checking using skymodules.ValidateTryFiles
        return "TryFiles is not supported at this time";
    }
    if ("ErrorPages" in metadata) {
        // TODO: finish using skymodules.ValidateErrorPages
        return "ErrorPages is not supported at this time";
    }
    return null;
}
exports.validateSkyfileMetadata = validateSkyfileMetadata;
// validateSkylink returns null if the provided Uint8Array is a valid skylink.
function validateSkylink(skylink) {
    // If the input is a string, convert it to a Uint8Array.
    let skylinkU8;
    if (typeof skylink === "string") {
        const [buf, err] = (0, encoding_js_1.b64ToBuf)(skylink);
        if (err !== null) {
            return (0, err_js_1.addContextToErr)(err, "unable to convert skylink from string");
        }
        skylinkU8 = buf;
    }
    else {
        skylinkU8 = skylink;
    }
    // skylink is now a Uint8
    if (skylinkU8.length !== skylinkBitfield_js_1.SKYLINK_U8_V1_V2_LENGTH) {
        return `skylinkU8 has an invalid length: ${skylinkU8.length}`;
    }
    const [, , , errPSB] = (0, skylinkBitfield_js_1.parseSkylinkBitfield)(skylinkU8);
    if (errPSB !== null) {
        return (0, err_js_1.addContextToErr)(errPSB, "skylink did not decode");
    }
    return null;
}
exports.validateSkylink = validateSkylink;
