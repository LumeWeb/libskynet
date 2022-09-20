interface progressiveFetchResult {
    success: boolean;
    portal: string;
    response: Response;
    portalsFailed: string[];
    responsesFailed: Response[];
    messagesFailed: string[];
    remainingPortals: string[];
    logs: string[];
}
declare function progressiveFetch(endpoint: string, fetchOpts: any, portals: string[], verifyFunction: any): Promise<progressiveFetchResult>;
export { progressiveFetch, progressiveFetchResult };
