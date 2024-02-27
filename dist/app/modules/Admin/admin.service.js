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
exports.AdminService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const agent_model_1 = require("../Agent/agent.model");
const user_model_1 = require("../User/user.model");
const admin_model_1 = require("./admin.model");
const transaction_model_1 = require("../Transaction/transaction.model");
const transactionID_1 = require("../../utlis/transactionID");
const registrationFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userFind = yield user_model_1.UsersModel.find({
            $or: [
                { mobileNumber: data.mobileNumber },
                { email: data.email },
                { nid: data.nid },
            ],
        });
        if (userFind.length > 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
        }
        const agentFind = yield agent_model_1.AgentsModel.find({
            $or: [
                { mobileNumber: data.mobileNumber },
                { email: data.email },
                { nid: data.nid },
            ],
        });
        if (agentFind.length > 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
        }
        const adminFind = yield agent_model_1.AgentsModel.find({
            $or: [
                { mobileNumber: data.mobileNumber },
                { email: data.email },
                { nid: data.nid },
            ],
        });
        if (adminFind.length > 0) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already exists");
        }
        const user = new admin_model_1.AdminModel(data);
        yield user.save();
        if (!user) {
            throw new ApiError_1.default(400, "Failed to create");
        }
        return user;
    }
    catch (error) {
        if (error.code === 11000 && error.keyPattern.email === 1) {
            throw new ApiError_1.default(400, "Email already exists");
        }
        else {
            throw error;
        }
    }
});
const loginFromDB = (credentials) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber } = credentials;
        const user = yield admin_model_1.AdminModel.findOne({ mobileNumber }, {
            _id: 1,
            email: 1,
            name: 1,
            mobileNumber: 1,
            accountType: 1,
            pin: 1,
        });
        return user;
    }
    catch (error) {
        console.error("Error in loginFromDB:", error);
        throw new Error("An error occurred while fetching user data from the database");
    }
});
const userUpdateOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.UsersModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const agentApprovedUpdateOnDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield agent_model_1.AgentsModel.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const sentMoneyInsertIntoDB = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = yield user_model_1.UsersModel.findOne({ mobileNumber: senderId });
    const receiver = yield user_model_1.UsersModel.findOne({ mobileNumber: receiverId });
    if (!sender || !receiver) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Sender or receiver not found");
    }
    if (sender.balance < amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance");
    }
    const transactionFee = amount > 100 ? 5 : 0;
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
const cashOutUserIntoDB = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const [sender, adminReceiver] = yield Promise.all([
        user_model_1.UsersModel.findOne({ _id: senderId }),
        admin_model_1.AdminModel.findOne({ mobileNumber: receiverId }),
    ]);
    if (!sender || !adminReceiver)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Sender or receiver not found");
    const fee = amount * 0.005;
    if (sender.balance < amount + fee)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance");
    sender.balance -= amount + fee;
    adminReceiver.balance += amount + fee;
    const transaction = new transaction_model_1.Transaction({
        sender: sender._id,
        receiver: adminReceiver._id,
        amount,
        transactionType: "cashOut From admin",
        transactionFee: fee,
        transactionID: (0, transactionID_1.generateTransactionID)(),
        timestamp: new Date(),
    });
    yield Promise.all([
        sender.save(),
        adminReceiver.save(),
        transaction.save(),
        sender.updateOne({ $push: { transactions: transaction._id } }),
        adminReceiver.updateOne({ $push: { transactions: transaction._id } }),
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
const userListInDB = (adminID) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.AdminModel.findOne({ _id: adminID });
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Admin not found");
    }
    const user = yield user_model_1.UsersModel.find();
    return user;
});
const agentListInDB = (adminID) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield admin_model_1.AdminModel.findOne({ _id: adminID });
    if (!admin) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Admin not found");
    }
    const agent = yield agent_model_1.AgentsModel.find();
    return agent;
});
const cashinAdminToAgentInsertIntoDB = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = yield admin_model_1.AdminModel.findOne({ _id: senderId });
    const receiver = yield agent_model_1.AgentsModel.findOne({ mobileNumber: receiverId });
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
        transactionType: "cash In Admin TO Agent",
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
const cashinAdminToUserInsertIntoDB = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = yield admin_model_1.AdminModel.findOne({ _id: senderId });
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
        transactionType: "cash In Admin TO User",
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
exports.AdminService = {
    registrationFromDB,
    loginFromDB,
    userUpdateOnDB,
    agentApprovedUpdateOnDB,
    cashOutUserIntoDB,
    userListInDB,
    agentListInDB,
    cashinAdminToAgentInsertIntoDB,
    cashinAdminToUserInsertIntoDB,
};
