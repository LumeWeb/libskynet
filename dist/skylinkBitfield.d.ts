declare const SKYLINK_U8_V1_V2_LENGTH = 34;
declare function parseSkylinkBitfield(skylinkU8: Uint8Array): [bigint, bigint, bigint, string | null];
declare function skylinkV1Bitfield(dataSizeBI: bigint): [Uint8Array, string | null];
export { SKYLINK_U8_V1_V2_LENGTH, parseSkylinkBitfield, skylinkV1Bitfield };
