"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseInRequestModel = void 0;
const mongoose_1 = require("mongoose");
const CaseInRequestSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "agents" },
    amount: { type: Number, default: 100000 },
    status: { type: String, default: "pending" },
    timestamp: { type: Date, default: Date.now },
});
exports.CaseInRequestModel = (0, mongoose_1.model)("cash-request", CaseInRequestSchema);
