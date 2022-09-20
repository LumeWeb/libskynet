"use strict";
// seed.ts implements mysky seed as defined in
// https://blog.sia.tech/a-technical-breakdown-of-mysky-seeds-ba9964505978
//
// At points some of the bitmath can get hairy, but it's just trying to match
// the specification of the blog post, and keep compatibility with the other
// libraries that implemented mysky seeds.
Object.defineProperty(exports, "__esModule", { value: true });
exports.validSeedPhrase = exports.seedPhraseToSeed = exports.seedToChecksumWords = exports.generateSeedPhraseDeterministic = exports.deriveMyskyRootKeypair = exports.deriveChildSeed = exports.SEED_BYTES = void 0;
const dictionary_js_1 = require("./dictionary.js");
const ed25519_js_1 = require("./ed25519.js");
const err_js_1 = require("./err.js");
const sha512_js_1 = require("./sha512.js");
// Define the number of entropy words used when generating the seed.
const SEED_ENTROPY_WORDS = 13;
const SEED_CHECKSUM_WORDS = 2; // Not used, but left as documentation.
const SEED_BYTES = 16;
exports.SEED_BYTES = SEED_BYTES;
// deriveChildSeed is a helper function to derive a child seed from a parent
// seed using a string as the path.
function deriveChildSeed(parentSeed, derivationTag) {
    const tagU8 = new TextEncoder().encode(" - " + derivationTag);
    const preimage = new Uint8Array(parentSeed.length + tagU8.length);
    preimage.set(parentSeed, 0);
    preimage.set(tagU8, parentSeed.length);
    const hash = (0, sha512_js_1.sha512)(preimage);
    return hash.slice(0, SEED_BYTES);
}
exports.deriveChildSeed = deriveChildSeed;
// deriveMyskyRoot is a helper function to derive the root mysky seed of the
// provided user seed.
//
// NOTE: This is code is to provide legacy compatibility with the MySky
// ecosystem. Compatibility cannot be broken here.
function deriveMyskyRootKeypair(userSeed) {
    const saltBytes = new TextEncoder().encode("root discoverable key");
    const saltHash = (0, sha512_js_1.sha512)(saltBytes);
    const userSeedHash = (0, sha512_js_1.sha512)(userSeed);
    const mergedHash = (0, sha512_js_1.sha512)(new Uint8Array([...saltHash, ...userSeedHash]));
    const keyEntropy = mergedHash.slice(0, 32);
    // Error is ignored because it should not be possible with the provided
    // inputs.
    const [keypair] = (0, ed25519_js_1.ed25519KeypairFromEntropy)(keyEntropy);
    return keypair;
}
exports.deriveMyskyRootKeypair = deriveMyskyRootKeypair;
// generateSeedPhraseDeterministic will generate and verify a seed phrase for
// the user.
function generateSeedPhraseDeterministic(password) {
    const u8 = new TextEncoder().encode(password);
    const buf = (0, sha512_js_1.sha512)(u8);
    const entropy = Uint16Array.from(buf);
    // Generate the seed phrase from the entropy.
    const seedWords = [];
    for (let i = 0; i < SEED_ENTROPY_WORDS; i++) {
        let wordIndex = entropy[i] % dictionary_js_1.dictionary.length;
        if (i == SEED_ENTROPY_WORDS - 1) {
            wordIndex = entropy[i] % (dictionary_js_1.dictionary.length / 4);
        }
        seedWords.push(dictionary_js_1.dictionary[wordIndex]);
    }
    // Convert the seedWords to a seed.
    const [seed, err1] = seedWordsToSeed(seedWords);
    if (err1 !== null) {
        return ["", err1];
    }
    // Compute the checksum.
    const [checksumOne, checksumTwo, err2] = seedToChecksumWords(seed);
    if (err2 !== null) {
        return ["", err2];
    }
    // Assemble the final seed phrase and set the text field.
    const allWords = [...seedWords, checksumOne, checksumTwo];
    const seedPhrase = allWords.join(" ");
    return [seedPhrase, null];
}
exports.generateSeedPhraseDeterministic = generateSeedPhraseDeterministic;
// seedPhraseToSeed converts a seed phrase to a Uint8Array, returning an error
// if the seedPhrase is invalid.
function seedPhraseToSeed(seedPhrase) {
    // Create a helper function to make the below code more readable.
    const prefix = (s) => {
        return s.slice(0, dictionary_js_1.DICTIONARY_UNIQUE_PREFIX);
    };
    // Pull the seed phrase into its respective parts. First thirteen words are
    // data words, ten bits each. The thriteenth word is only 8 bits. The final
    // two words are checksum words.
    const seedWordsAndChecksum = seedPhrase.split(" ");
    const seedWords = seedWordsAndChecksum.slice(0, SEED_ENTROPY_WORDS);
    const checksumOne = seedWordsAndChecksum[SEED_ENTROPY_WORDS];
    const checksumTwo = seedWordsAndChecksum[SEED_ENTROPY_WORDS + 1];
    // Convert the seedWords to a seed.
    const [seed, err1] = seedWordsToSeed(seedWords);
    if (err1 !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(err1, "unable to parse seed phrase")];
    }
    const [checksumOneVerify, checksumTwoVerify, err2] = seedToChecksumWords(seed);
    if (err2 !== null) {
        return [new Uint8Array(0), (0, err_js_1.addContextToErr)(err2, "could not compute checksum words")];
    }
    if (prefix(checksumOne) !== prefix(checksumOneVerify)) {
        return [new Uint8Array(0), "first checksum word is invalid"];
    }
    if (prefix(checksumTwo) !== prefix(checksumTwoVerify)) {
        return [new Uint8Array(0), "second checksum word is invalid"];
    }
    return [seed, null];
}
exports.seedPhraseToSeed = seedPhraseToSeed;
// seedToChecksumWords will compute the two checksum words for the provided
// seed. The two return values are the two checksum words.
function seedToChecksumWords(seed) {
    // Input validation.
    if (seed.length !== SEED_BYTES) {
        return ["", "", `seed has the wrong length: ${seed.length}`];
    }
    // This line is just to pacify the linter about SEED_CHECKSUM_WORDS.
    if (SEED_CHECKSUM_WORDS !== 2) {
        return ["", "", "SEED_CHECKSUM_WORDS is not set to 2"];
    }
    // Get the hash of the seed and convert the hash into the checksum words. We
    // use the first 20 bits of the hash to pick two checksum words. Because each
    // byte of the seed is only 8 bits, we have to do some shifting to get all
    // the bits in the right place. You also have to make sure you get the
    // endian-ness correct.
    //
    // The below math is a product of trial-and-error and testing.
    const h = (0, sha512_js_1.sha512)(seed);
    let word1 = h[0] << 8;
    word1 += h[1];
    word1 >>= 6;
    let word2 = h[1] << 10;
    word2 &= 0xffff;
    word2 += h[2] << 2;
    word2 >>= 6;
    return [dictionary_js_1.dictionary[word1], dictionary_js_1.dictionary[word2], null];
}
exports.seedToChecksumWords = seedToChecksumWords;
// seedWordsToSeed will convert a provided seed phrase to to a Uint8Array that
// represents the cryptographic seed in bytes.
function seedWordsToSeed(seedWords) {
    // Input checking.
    if (seedWords.length !== SEED_ENTROPY_WORDS) {
        return [
            new Uint8Array(0),
            `Seed words should have length ${SEED_ENTROPY_WORDS} but has length ${seedWords.length}`,
        ];
    }
    // We are getting 16 bytes of entropy. This was ported from somewhere else
    // and basically had to be massaged until all the testing passed.
    const bytes = new Uint8Array(SEED_BYTES);
    let curByte = 0;
    let curBit = 0;
    for (let i = 0; i < SEED_ENTROPY_WORDS; i++) {
        // Determine which number corresponds to the next word. If the word isn't
        // found, return an error. We only look at the first UNIQUE_PREFIX letters
        // because we let the user mutate their seed beyond that if desired to
        // make it easier to copy and or memorize.
        let word = -1;
        for (let j = 0; j < dictionary_js_1.dictionary.length; j++) {
            if (seedWords[i].slice(0, dictionary_js_1.DICTIONARY_UNIQUE_PREFIX) === dictionary_js_1.dictionary[j].slice(0, dictionary_js_1.DICTIONARY_UNIQUE_PREFIX)) {
                word = j;
                break;
            }
        }
        if (word === -1) {
            return [new Uint8Array(0), `word '${seedWords[i]}' at index ${i} not found in dictionary`];
        }
        // The first twelve words provide 10 bits of information, and the
        // thriteenth word provides 8 bits of information, giving us 128 bits (16
        // bytes) of information, which is how much information is contained in a
        // typical cryptographic seed.
        let wordBits = 10;
        if (i === SEED_ENTROPY_WORDS - 1) {
            wordBits = 8;
        }
        // Iterate over the each bit of the word and pack the bit into our bytes
        // array. If we fill out a byte at any point, move on to the next byte.
        for (let j = 0; j < wordBits; j++) {
            const bitSet = (word & (1 << (wordBits - j - 1))) > 0;
            if (bitSet) {
                bytes[curByte] |= 1 << (8 - curBit - 1);
            }
            curBit += 1;
            if (curBit >= 8) {
                // Current byte has 8 bits, go to the next byte.
                curByte += 1;
                curBit = 0;
            }
        }
    }
    return [bytes, null];
}
// validSeedPhrase checks whether the provided seed phrase is valid, returning
// an error if not.
function validSeedPhrase(seedPhrase) {
    const [, err] = seedPhraseToSeed(seedPhrase);
    return err;
}
exports.validSeedPhrase = validSeedPhrase;
