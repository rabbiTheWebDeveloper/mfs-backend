"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, refPath: 'senderType' },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, refPath: 'receiverType' },
    amount: Number,
    transactionType: String,
    transactionFee: Number,
    transactionID: String,
    timestamp: { type: Date, default: Date.now },
    senderType: { type: String, enum: ['users', 'agents'] },
    receiverType: { type: String, enum: ['users', 'agents'] }
});
exports.Transaction = (0, mongoose_1.model)("transaction", transactionSchema);
