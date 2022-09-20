"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ed25519_js_1 = require("./ed25519.js");
const sha512_js_1 = require("./sha512.js");
test("ed25519", () => {
    // Make a keypair with some entropy, then test that signing and verifying
    // don't fail.
    const entropy = (0, sha512_js_1.sha512)(new TextEncoder().encode("fake entropy"));
    const [keypair, errKPFE] = (0, ed25519_js_1.ed25519KeypairFromEntropy)(entropy.slice(0, 32));
    expect(errKPFE).toBe(null);
    const message = new TextEncoder().encode("fake message");
    const [signature, errS] = (0, ed25519_js_1.ed25519Sign)(message, keypair.secretKey);
    expect(errS).toBe(null);
    const validSig = (0, ed25519_js_1.ed25519Verify)(message, signature, keypair.publicKey);
    expect(validSig).toBe(true);
});
