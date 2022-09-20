interface Ed25519Keypair {
    publicKey: Uint8Array;
    secretKey: Uint8Array;
}
declare function ed25519KeypairFromEntropy(seed: Uint8Array): [Ed25519Keypair, string | null];
declare function ed25519Sign(msg: Uint8Array, secretKey: Uint8Array): [Uint8Array, string | null];
declare function ed25519Verify(msg: Uint8Array, sig: Uint8Array, publicKey: Uint8Array): boolean;
export { Ed25519Keypair, ed25519KeypairFromEntropy, ed25519Sign, ed25519Verify };
