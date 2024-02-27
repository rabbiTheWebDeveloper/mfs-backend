"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdraweModel = void 0;
const mongoose_1 = require("mongoose");
const withdrawStatusSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'agents' },
    amount: Number,
    withdrawStatus: { type: String, default: "pending" },
    timestamp: { type: Date, default: Date.now }
});
exports.WithdraweModel = (0, mongoose_1.model)("withdraw-list", withdrawStatusSchema);
