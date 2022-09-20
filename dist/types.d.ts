declare type DataFn = (data?: any) => void;
declare type Err = string | null;
declare type ErrFn = (errMsg: string) => void;
declare type ErrTuple = [data: any, err: Err];
interface KernelAuthStatus {
    loginComplete: boolean;
    kernelLoaded: "not yet" | "success" | string;
    logoutComplete: boolean;
}
interface SkynetPortal {
    url: string;
    name: string;
}
interface RequestOverrideResponse {
    override: boolean;
    headers?: any;
    body?: Uint8Array;
}
export { DataFn, ErrFn, Err, ErrTuple, KernelAuthStatus, RequestOverrideResponse, SkynetPortal };
