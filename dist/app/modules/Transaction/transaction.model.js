"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' || 'agents' },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: 'users' || 'agents' },
    amount: Number,
    transactionType: String,
    transactionFee: Number,
    transactionID: String,
    timestamp: { type: Date, default: Date.now }
});
exports.Transaction = (0, mongoose_1.model)("transaction", transactionSchema);
