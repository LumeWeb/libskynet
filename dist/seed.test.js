"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dictionary_js_1 = require("../src/dictionary.js");
const seed_js_1 = require("../src/seed.js");
test("generateSeedPhraseDeterministic", () => {
    // Generate three seed phrases, two matching and one not matching. Make sure
    // they match and don't match as expected.
    const [phraseTestInput, err3] = (0, seed_js_1.generateSeedPhraseDeterministic)("Test");
    const [phraseTestInput2, err4] = (0, seed_js_1.generateSeedPhraseDeterministic)("Test");
    const [phraseTestInput3, err5] = (0, seed_js_1.generateSeedPhraseDeterministic)("Test2");
    expect(err3).toBe(null);
    expect(err4).toBe(null);
    expect(err5).toBe(null);
    expect(phraseTestInput).toBe(phraseTestInput2);
    expect(phraseTestInput).not.toBe(phraseTestInput3);
    // Check that both seed phrases are valid.
    const errVSP1 = (0, seed_js_1.validSeedPhrase)(phraseTestInput);
    const errVSP2 = (0, seed_js_1.validSeedPhrase)(phraseTestInput3);
    expect(errVSP1).toBe(null);
    expect(errVSP2).toBe(null);
    // Check that the generated seeds follow the 13th word rule, which is that
    // the 13th word must always be from the first 256 entries in the dictionary
    // (this keeps the final 2 bits clear)
    for (let i = 0; i < 128; i++) {
        const [phrase, err] = (0, seed_js_1.generateSeedPhraseDeterministic)(i.toString());
        expect(err).toBe(null);
        let found = false;
        const words = phrase.split(" ");
        for (let j = 0; j < 256; j++) {
            if (words[12] === dictionary_js_1.dictionary[j]) {
                found = true;
                break;
            }
        }
        expect(found).toBe(true);
    }
});
// TestMyskyEquivalence is a test that checks that the way libskynet derives
// the mysky seed for a user matches the code that derived a mysky seed for a
// user in skynet-mysky. Following the test are some unique dependencies so
// that the simulated mysky derivation is as close to the original code as
// possible.
const tweetnacl_1 = __importDefault(require("tweetnacl"));
const SALT_ROOT_DISCOVERABLE_KEY = "root discoverable key";
function genKeyPairFromSeed(seed) {
    const hash = hashWithSalt(seed, SALT_ROOT_DISCOVERABLE_KEY);
    return genKeyPairFromHash(hash);
}
function hashWithSalt(message, salt) {
    return s512(new Uint8Array([...s512(salt), ...s512(message)]));
}
function s512(message) {
    if (typeof message === "string") {
        return tweetnacl_1.default.hash(stringToUint8ArrayUtf8(message));
    }
    return tweetnacl_1.default.hash(message);
}
function stringToUint8ArrayUtf8(str) {
    return Uint8Array.from(Buffer.from(str, "utf-8"));
}
function genKeyPairFromHash(hash) {
    const hashBytes = hash.slice(0, 32);
    const { publicKey, secretKey } = tweetnacl_1.default.sign.keyPair.fromSeed(hashBytes);
    return [publicKey, secretKey];
}
test("myskyEquivalence", () => {
    // Get a seed.
    const [seedPhrase, errGSPD] = (0, seed_js_1.generateSeedPhraseDeterministic)("test-for-mysky");
    expect(errGSPD).toBe(null);
    const [seed, errVSP] = (0, seed_js_1.seedPhraseToSeed)(seedPhrase);
    expect(errVSP).toBe(null);
    const [pkOld, skOld] = genKeyPairFromSeed(seed);
    const keypair = (0, seed_js_1.deriveMyskyRootKeypair)(seed);
    expect(pkOld.length).toBe(keypair.publicKey.length);
    for (let i = 0; i < pkOld.length; i++) {
        expect(pkOld[i]).toBe(keypair.publicKey[i]);
    }
    expect(skOld.length).toBe(keypair.secretKey.length);
    for (let i = 0; i < skOld.length; i++) {
        expect(skOld[i]).toBe(keypair.secretKey[i]);
    }
});
