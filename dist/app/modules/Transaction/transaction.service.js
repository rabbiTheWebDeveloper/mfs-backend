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
exports.Transactionservice = void 0;
const transaction_model_1 = require("./transaction.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const transactionID_1 = require("../../utlis/transactionID");
const user_model_1 = require("../User/user.model");
const agent_model_1 = require("../Agent/agent.model");
const admin_model_1 = require("../Admin/admin.model");
const loginCheck_1 = require("../../utlis/loginCheck");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new transaction_model_1.Transaction(data);
    yield user.save();
    return user;
});
const balanceIntoDB = (user, token) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, loginCheck_1.isToken)(token);
    const sender = yield agent_model_1.AgentsModel.findOne({ _id: user });
    const admin = yield admin_model_1.AdminModel.findOne({ _id: user });
    if (sender) {
        return { balance: sender.balance };
    }
    else if (admin) {
        return { balance: admin.balance };
    }
    else {
        const receiver = yield user_model_1.UsersModel.findOne({ _id: user });
        return receiver ? { balance: receiver.balance } : null;
    }
});
const transactionIntoDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionList = yield transaction_model_1.Transaction.find({ sender: userId })
            .populate("sender")
            .populate("receiver");
        return transactionList;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, `Error fetching transactions: ${error.message}`);
    }
});
const sentMoneyInsertIntoDB = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = yield user_model_1.UsersModel.findOne({ _id: senderId });
    const receiver = yield user_model_1.UsersModel.findOne({ mobileNumber: receiverId });
    const admin = yield admin_model_1.AdminModel.findOne();
    if (!sender || !receiver) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Sender or receiver not found");
    }
    if (sender.balance < amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance");
    }
    const transactionFee = amount > 100 ? 5 : 0;
    if (admin) {
        admin.balance += transactionFee;
        yield admin.save();
    }
    else {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Admin not found");
    }
    sender.balance -= amount + transactionFee;
    receiver.balance += amount;
    const transaction = new transaction_model_1.Transaction({
        sender: sender._id,
        receiver: receiver._id,
        amount,
        transactionType: "sendMoney",
        transactionFee,
        transactionID: (0, transactionID_1.generateTransactionID)(),
        timestamp: new Date(),
    });
    yield Promise.all([sender.save(), receiver.save(), transaction.save()]);
    yield Promise.all([
        sender.updateOne({ $push: { transactions: transaction._id } }),
        receiver.updateOne({ $push: { transactions: transaction._id } }),
    ]);
    return transaction;
});
const cashOutIntoDB = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const [sender, agentReceiver, admin] = yield Promise.all([
        user_model_1.UsersModel.findOne({ _id: senderId }),
        agent_model_1.AgentsModel.findOne({ mobileNumber: receiverId }),
        admin_model_1.AdminModel.findOne(),
    ]);
    if (!sender || !agentReceiver || !admin)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Sender or receiver not found");
    const cashOutFee = amount * 0.015;
    const adminFee = amount * 0.005;
    const agentFee = amount * 0.01;
    if (sender.balance < amount + cashOutFee)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance");
    sender.balance -= amount + cashOutFee;
    agentReceiver.balance += amount + agentFee;
    if (admin.balance !== undefined)
        admin.balance += adminFee;
    const transaction = new transaction_model_1.Transaction({
        sender: sender._id,
        receiver: agentReceiver._id,
        amount,
        transactionType: "cashOut",
        transactionFee: cashOutFee,
        transactionID: (0, transactionID_1.generateTransactionID)(),
        timestamp: new Date(),
    });
    yield Promise.all([
        sender.save(),
        agentReceiver.save(),
        admin.save(),
        transaction.save(),
        sender.updateOne({ $push: { transactions: transaction._id } }),
        agentReceiver.updateOne({ $push: { transactions: transaction._id } }),
    ]);
    return transaction;
});
const cashinAgentInsertIntoDB = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = yield agent_model_1.AgentsModel.findOne({ _id: senderId });
    const receiver = yield user_model_1.UsersModel.findOne({ mobileNumber: receiverId });
    if (!sender || !receiver) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Sender or receiver not found");
    }
    if (sender.balance < amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance");
    }
    sender.balance -= amount;
    receiver.balance += amount;
    const transaction = new transaction_model_1.Transaction({
        sender: sender._id,
        receiver: receiver._id,
        amount,
        transactionType: "cashInAgent",
        transactionFee: 0,
        transactionID: (0, transactionID_1.generateTransactionID)(),
        timestamp: new Date(),
    });
    yield Promise.all([sender.save(), receiver.save(), transaction.save()]);
    yield Promise.all([
        sender.updateOne({ $push: { transactions: transaction._id } }),
        receiver.updateOne({ $push: { transactions: transaction._id } }),
    ]);
    return transaction;
});
exports.Transactionservice = {
    insertIntoDB,
    sentMoneyInsertIntoDB,
    cashOutIntoDB,
    cashinAgentInsertIntoDB,
    balanceIntoDB,
    transactionIntoDB,
};
