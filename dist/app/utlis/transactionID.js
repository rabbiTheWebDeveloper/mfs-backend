"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTransactionID = void 0;
function generateTransactionID() {
    const randomString = Math.random().toString(36).substr(2, 10);
    const timestamp = Date.now();
    const transactionID = `${randomString}-${timestamp}`;
    return transactionID;
}
exports.generateTransactionID = generateTransactionID;
