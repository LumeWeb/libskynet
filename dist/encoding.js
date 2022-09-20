"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexToBuf = exports.encodeU64 = exports.encodePrefixedBytes = exports.decodeU64 = exports.bufToStr = exports.bufToB64 = exports.bufToHex = exports.b64ToBuf = void 0;
const err_js_1 = require("./err.js");
const MAX_UINT_64 = 18446744073709551615n;
// b64ToBuf will take an untrusted base64 string and convert it into a
// Uin8Array, returning an error if the input is not valid base64.
const b64regex = /^[0-9a-zA-Z-_/+=]*$/;
function b64ToBuf(b64) {
    // Check that the final string is valid base64.
    if (!b64regex.test(b64)) {
        return [new Uint8Array(0), "provided string is not valid base64"];
    }
    // Swap any '-' characters for '+', and swap any '_' characters for '/'
    // for use in the atob function.
    b64 = b64.replaceAll("-", "+").replaceAll("_", "/");
    // Perform the conversion.
    const binStr = atob(b64);
    const len = binStr.length;
    const buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        buf[i] = binStr.charCodeAt(i);
    }
    return [buf, null];
}
exports.b64ToBuf = b64ToBuf;
// bufToHex takes a Uint8Array as input and returns the hex encoding of those
// bytes as a string.
function bufToHex(buf) {
    return [...buf].map((x) => x.toString(16).padStart(2, "0")).join("");
}
exports.bufToHex = bufToHex;
// bufToB64 will convert a Uint8Array to a base64 string with URL encoding and
// no padding characters.
function bufToB64(buf) {
    const b64Str = btoa(String.fromCharCode(...buf));
    return b64Str.replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}
exports.bufToB64 = bufToB64;
// bufToStr takes an ArrayBuffer as input and returns a text string. bufToStr
// will check for invalid characters.
function bufToStr(buf) {
    try {
        const text = new TextDecoder("utf-8", { fatal: true }).decode(buf);
        return [text, null];
    }
    catch (err) {
        return ["", (0, err_js_1.addContextToErr)(err.toString(), "unable to decode ArrayBuffer to string")];
    }
}
exports.bufToStr = bufToStr;
// decodeU64 is the opposite of encodeU64, it takes a uint64 encoded as 8 bytes
// and decodes them into a BigInt.
function decodeU64(u8) {
    // Check the input.
    if (u8.length !== 8) {
        return [0n, "input should be 8 bytes"];
    }
    // Process the input.
    let num = 0n;
    for (let i = u8.length - 1; i >= 0; i--) {
        num *= 256n;
        num += BigInt(u8[i]);
    }
    return [num, null];
}
exports.decodeU64 = decodeU64;
// encodePrefixedBytes takes a Uint8Array as input and returns a Uint8Array
// that has the length prefixed as an 8 byte prefix.
function encodePrefixedBytes(bytes) {
    const [encodedLen, err] = encodeU64(BigInt(bytes.length));
    if (err !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(err, "unable to encode array length")];
    }
    const prefixedArray = new Uint8Array(8 + bytes.length);
    prefixedArray.set(encodedLen, 0);
    prefixedArray.set(bytes, 8);
    return [prefixedArray, null];
}
exports.encodePrefixedBytes = encodePrefixedBytes;
// encodeU64 will encode a bigint in the range of a uint64 to an 8 byte
// Uint8Array.
function encodeU64(num) {
    // Check the bounds on the bigint.
    if (num < 0) {
        return [new Uint8Array(0), "expected a positive integer"];
    }
    if (num > MAX_UINT_64) {
        return [new Uint8Array(0), "expected a number no larger than a uint64"];
    }
    // Encode the bigint into a Uint8Array.
    const encoded = new Uint8Array(8);
    for (let i = 0; i < encoded.length; i++) {
        const byte = Number(num & 0xffn);
        encoded[i] = byte;
        num = num >> 8n;
    }
    return [encoded, null];
}
exports.encodeU64 = encodeU64;
// hexToBuf takes an untrusted string as input, verifies that the string is
// valid hex, and then converts the string to a Uint8Array.
const allHex = /^[0-9a-f]+$/i;
function hexToBuf(hex) {
    // The rest of the code doesn't handle zero length input well, so we handle
    // that separately. It's not an error, we just return an empty array.
    if (hex.length === 0) {
        return [new Uint8Array(0), null];
    }
    // Check that the length makes sense.
    if (hex.length % 2 !== 0) {
        return [new Uint8Array(0), "input has incorrect length"];
    }
    // Check that all of the characters are legal.
    if (!allHex.test(hex)) {
        return [new Uint8Array(0), "input has invalid character"];
    }
    // Create the buffer and fill it.
    const matches = hex.match(/.{2}/g);
    if (matches === null) {
        return [new Uint8Array(0), "input is incomplete"];
    }
    const u8 = new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
    return [u8, null];
}
exports.hexToBuf = hexToBuf;
