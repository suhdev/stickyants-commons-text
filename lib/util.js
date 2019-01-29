"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createArray(length, defValue) {
    var a = [];
    for (var i = 0; i < length; i++) {
        a.push(typeof defValue === "function" ? defValue() : defValue);
    }
    return a;
}
exports.createArray = createArray;
