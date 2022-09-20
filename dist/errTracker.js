"use strict";
// errTracker.ts defines an 'ErrTracker' type which keeps track of historical
// errors. When the number of errors gets too large, it randomly starts pruning
// errors. It always keeps 250 of the most recent errors, and then keeps up to
// 500 historic errors, where the first few errors after runtime are always
// kept, and the ones in the middle are increasingly likely to be omitted from
// the history.
Object.defineProperty(exports, "__esModule", { value: true });
exports.newErrTracker = void 0;
// MAX_ERRORS defines the maximum number of errors that will be held in the
// HistoricErr object.
const MAX_ERRORS = 1000;
// newErrTracker returns an ErrTracker object that is ready to have errors
// added to it.
function newErrTracker() {
    const et = {
        recentErrs: [],
        oldErrs: [],
        addErr: function (err) {
            addHistoricErr(et, err);
        },
        viewErrs: function () {
            return viewErrs(et);
        },
    };
    return et;
}
exports.newErrTracker = newErrTracker;
// addHistoricErr is a function that will add an error to a set of historic
// errors. It uses randomness to prune errors once the error object is too
// large.
function addHistoricErr(et, err) {
    // Add this error to the set of most recent errors.
    et.recentErrs.push({
        err,
        date: new Date(),
    });
    // Determine whether some of the most recent errors need to be moved into
    // logTermErrs. If the length of the mostRecentErrs is not at least half of
    // the MAX_ERRORS, we don't need to do anything.
    if (et.recentErrs.length < MAX_ERRORS / 2) {
        return;
    }
    // Iterate through the recentErrs. For the first half of the recentErrs, we
    // will use randomness to either toss them or move them to oldErrs. The
    // second half of the recentErrs will be kept as the new recentErrs array.
    const newRecentErrs = [];
    for (let i = 0; i < et.recentErrs.length; i++) {
        // If we are in the second half of the array, add the element to
        // newRecentErrs.
        if (i > et.recentErrs.length / 2) {
            newRecentErrs.push(et.recentErrs[i]);
            continue;
        }
        // We are in the first half of the array, use a random number to add the
        // error oldErrs probabilistically.
        const rand = Math.random();
        const target = et.oldErrs.length / (MAX_ERRORS / 2);
        if (rand > target || et.oldErrs.length < 25) {
            et.oldErrs.push(et.recentErrs[i]);
        }
    }
    et.recentErrs = newRecentErrs;
}
// viewErrs returns the list of errors that have been retained by the
// HistoricErr object.
function viewErrs(et) {
    const finalErrs = [];
    for (let i = 0; i < et.oldErrs.length; i++) {
        finalErrs.push(et.oldErrs[i]);
    }
    for (let i = 0; i < et.recentErrs.length; i++) {
        finalErrs.push(et.recentErrs[i]);
    }
    return finalErrs;
}
