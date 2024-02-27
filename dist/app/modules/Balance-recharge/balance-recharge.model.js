"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceRechargeModel = void 0;
const mongoose_1 = require("mongoose");
const balanceRechargeSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'agents' },
    amount: Number,
    status: { type: String, default: "pending" },
    timestamp: { type: Date, default: Date.now }
});
exports.BalanceRechargeModel = (0, mongoose_1.model)("balance-recharge", balanceRechargeSchema);
