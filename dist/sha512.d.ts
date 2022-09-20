declare const SHA512_HASH_SIZE = 64;
declare const sha512internal: (out: Uint8Array, m: Uint8Array, n: number) => number;
declare function sha512(m: Uint8Array): Uint8Array;
export { SHA512_HASH_SIZE, sha512, sha512internal };
