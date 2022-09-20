import { Err } from "./types.js";
interface HistoricErr {
    err: Err;
    date: Date;
}
interface ErrTracker {
    recentErrs: HistoricErr[];
    oldErrs: HistoricErr[];
    addErr: (err: Err) => void;
    viewErrs: () => HistoricErr[];
}
declare function newErrTracker(): ErrTracker;
export { ErrTracker, HistoricErr, newErrTracker };
