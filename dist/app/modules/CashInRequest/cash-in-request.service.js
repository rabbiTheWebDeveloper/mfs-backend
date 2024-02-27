"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaseInRequestService = void 0;
const cash_in_request_model_1 = require("./cash-in-request.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const transactionID_1 = require("../../utlis/transactionID");
const agent_model_1 = require("../Agent/agent.model");
const admin_model_1 = require("../Admin/admin.model");
const transaction_model_1 = require("../Transaction/transaction.model");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new cash_in_request_model_1.CaseInRequestModel(data);
    yield user.save();
    return user;
});
const getAllIntoDB = (adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.AdminModel.findOne({ _id: adminId });
    if (!admin) {
        throw new Error("Admin not found");
    }
    const list = yield cash_in_request_model_1.CaseInRequestModel.find();
    return list;
});
const getAllWithUserIntoDB = (agentId) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield agent_model_1.AgentsModel.findOne({ _id: agentId });
    console.log(agent);
    if (!agent) {
        throw new Error("Agent not found");
    }
    const list = yield cash_in_request_model_1.CaseInRequestModel.find({ userId: agentId });
    return list;
});
const updateIntoDB = (id, adminId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield admin_model_1.AdminModel.findOne({ _id: adminId });
        if (!admin) {
            throw new Error("Admin not found");
        }
        const result = yield cash_in_request_model_1.CaseInRequestModel.findOneAndUpdate({ _id: id }, payload, { new: true });
        if (!result) {
            throw new Error("withdraw not found");
        }
        // Check if recharge is paid
        if (result.status === "paid") {
            const agent = yield agent_model_1.AgentsModel.findOne({ _id: result.userId });
            if (!agent) {
                throw new Error("Agent not found");
            }
            // Update balances and create transaction
            admin.balance -= result.amount;
            agent.balance += result.amount;
            yield Promise.all([
                admin.save(),
                agent.save(),
                new transaction_model_1.Transaction({
                    sender: agent._id,
                    receiver: admin._id,
                    amount: result.amount,
                    transactionType: "Cash In Request",
                    transactionFee: 0,
                    transactionID: (0, transactionID_1.generateTransactionID)(),
                    timestamp: new Date(),
                }).save(),
            ]);
        }
        return result;
    }
    catch (error) {
        // Handle errors
        console.error("Error in updateIntoDB:", error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal Server Error");
    }
});
exports.CaseInRequestService = {
    insertIntoDB,
    updateIntoDB,
    getAllWithUserIntoDB,
    getAllIntoDB,
};
