interface proofStack {
    subtreeRoots: Uint8Array[];
    subtreeHeights: bigint[];
}
declare function blake2bAddLeafBytesToProofStack(ps: proofStack, leafBytes: Uint8Array): string | null;
declare function blake2bProofStackRoot(ps: proofStack): [Uint8Array, string | null];
declare function blake2bMerkleRoot(data: Uint8Array): [Uint8Array, string | null];
declare function blake2bVerifySectorRangeProof(root: Uint8Array, data: Uint8Array, rangeStart: bigint, rangeEnd: bigint, proof: Uint8Array): string | null;
export { blake2bAddLeafBytesToProofStack, blake2bMerkleRoot, blake2bProofStackRoot, blake2bVerifySectorRangeProof };
