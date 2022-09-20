"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContextToErr = void 0;
const objAsString_js_1 = require("./objAsString.js");
// addContextToErr is a helper function that standardizes the formatting of
// adding context to an error.
//
// NOTE: To protect against accidental situations where an Error type or some
// other type is provided instead of a string, we wrap both of the inputs with
// objAsString before returning them. This prevents runtime failures.
function addContextToErr(err, context) {
    if (err === null || err === undefined) {
        err = "[no error provided]";
    }
    return (0, objAsString_js_1.objAsString)(context) + ": " + (0, objAsString_js_1.objAsString)(err);
}
exports.addContextToErr = addContextToErr;
