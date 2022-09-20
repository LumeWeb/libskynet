declare function verifyDownload(root: Uint8Array, offset: bigint, fetchSize: bigint, buf: ArrayBuffer): [fileData: Uint8Array, portalAtFault: boolean, err: string | null];
export { verifyDownload };
