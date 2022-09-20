"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const objAsString_1 = require("../src/objAsString");
test("objAsString", () => {
    // Try undefined.
    let undefinedVar;
    const undefinedResult = (0, objAsString_1.objAsString)(undefinedVar);
    expect(undefinedResult).toBe("[cannot convert undefined to string]");
    // Try null.
    const nullVar = null;
    const nullResult = (0, objAsString_1.objAsString)(nullVar);
    expect(nullResult).toBe("[cannot convert null to string]");
    // Try a string.
    const strResult = (0, objAsString_1.objAsString)("asdf");
    expect(strResult).toBe("asdf");
    const strVar = "asdfasdf";
    const strResult2 = (0, objAsString_1.objAsString)(strVar);
    expect(strResult2).toBe("asdfasdf");
    // Try an object.
    const objVar = { a: "b", b: 7 };
    const objResult = (0, objAsString_1.objAsString)(objVar);
    expect(objResult).toBe('{"a":"b","b":7}');
    // Try an object with a defined toString that is a function.
    objVar.toString = function () {
        return "b7";
    };
    const objResult3 = (0, objAsString_1.objAsString)(objVar);
    expect(objResult3).toBe("b7");
    // Try an object with a defined toString that is not a function. We need to
    // specifiy 'as any' because we already made 'toString' a string, and now we
    // are redefining the field with a new type.
    objVar.toString = "b7";
    const objResult2 = (0, objAsString_1.objAsString)(objVar);
    expect(objResult2).toBe('{"a":"b","b":7,"toString":"b7"}');
    // Try testing an error object.
    const err1 = new Error("this is an error");
    const err1Result = (0, objAsString_1.objAsString)(err1);
    expect(err1Result).toBe("this is an error");
});
