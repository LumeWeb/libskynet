"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonStringify = void 0;
const err_js_1 = require("./err.js");
const objAsString_js_1 = require("./objAsString.js");
// jsonStringify is a replacement for JSON.stringify that returns an error
// rather than throwing.
function jsonStringify(obj) {
    try {
        const str = JSON.stringify(obj, (_, v) => {
            if (typeof v === "bigint") {
                return Number(v);
            }
            return v;
        });
        return [str, null];
    }
    catch (err) {
        return ["", (0, err_js_1.addContextToErr)((0, objAsString_js_1.objAsString)(err), "unable to stringify object")];
    }
}
exports.jsonStringify = jsonStringify;
