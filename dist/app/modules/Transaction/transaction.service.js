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
// import { IGenericResponse } from "../../interfaces/common";
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const transactionID_1 = require("../../utlis/transactionID");
const user_model_1 = require("../User/user.model");
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new transaction_model_1.Transaction(data);
    yield user.save();
    return user;
});
const sentMoneyInsertIntoDB = (senderId, receiverId, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const sender = yield user_model_1.UsersModel.findOne({ mobileNumber: senderId });
    const receiver = yield user_model_1.UsersModel.findOne({ mobileNumber: receiverId });
    console.log(sender, receiver);
    if (!sender || !receiver) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Sender or receiver not found');
    }
    if (sender.balance < amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Insufficient balance');
    }
    const transactionFee = (amount > 100) ? 5 : 0;
    sender.balance -= (amount + transactionFee);
    receiver.balance += amount;
    yield sender.save();
    yield receiver.save();
    const transaction = new transaction_model_1.Transaction({
        sender: sender._id,
        receiver: receiver._id,
        amount,
        transactionType: 'sendMoney',
        transactionFee,
        transactionID: (0, transactionID_1.generateTransactionID)(),
        timestamp: new Date()
    });
    console.log(transaction);
    yield transaction.save();
    sender.transactions.push(transaction._id);
    receiver.transactions.push(transaction._id);
    yield sender.save();
    yield receiver.save();
    return transaction;
});
exports.Transactionservice = {
    insertIntoDB,
    sentMoneyInsertIntoDB,
};
