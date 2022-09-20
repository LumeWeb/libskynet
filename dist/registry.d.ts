import { Ed25519Keypair } from "./ed25519.js";
import { Err } from "./types.js";
declare function computeRegistrySignature(secretKey: Uint8Array, dataKey: Uint8Array, data: Uint8Array, revision: bigint): [signature: Uint8Array, err: Err];
declare function deriveRegistryEntryID(pubkey: Uint8Array, dataKey: Uint8Array): [Uint8Array, Err];
declare function entryIDToSkylink(entryID: Uint8Array): string;
declare function skylinkToResolverEntryData(skylink: string): [Uint8Array, Err];
declare function taggedRegistryEntryKeys(seed: Uint8Array, keypairTagStr: string, dataKeyTagStr?: string): [Ed25519Keypair, Uint8Array, Err];
declare function verifyRegistrySignature(pubkey: Uint8Array, dataKey: Uint8Array, data: Uint8Array, revision: bigint, sig: Uint8Array): boolean;
export { computeRegistrySignature, deriveRegistryEntryID, entryIDToSkylink, skylinkToResolverEntryData, taggedRegistryEntryKeys, verifyRegistrySignature, };
