"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentsModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const agentSchema = new mongoose_1.Schema({
    name: String,
    pin: String,
    mobileNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    accountType: { type: String, default: 'Agent' },
    nid: String,
    balance: { type: Number, default: 100000 },
    transactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Transaction' }],
    approvalStatus: { type: String, default: 'Pending' },
    activeSessionToken: String, // Approved, Rejected
}, {
    timestamps: true,
    versionKey: false
});
exports.AgentsModel = mongoose_1.default.model('agents', agentSchema);
