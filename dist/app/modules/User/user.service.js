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
exports.userUpdateInDB = exports.loginFromDB = exports.registrationFromDB = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const admin_model_1 = require("../Admin/admin.model");
const user_model_1 = require("./user.model");
const transactionID_1 = require("../../utlis/transactionID");
const transaction_model_1 = require("../Transaction/transaction.model");
const registrationFromDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield admin_model_1.AdminModel.findOne();
        if (!admin || admin.balance < 40) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Please contact the administrator");
        }
        const user = new user_model_1.UsersModel(data);
        yield user.save();
        if (!user) {
            throw new ApiError_1.default(400, "Failed to create");
        }
        admin.balance -= user.balance;
        yield Promise.all([
            admin.save(),
            new transaction_model_1.Transaction({
                sender: admin._id,
                receiver: user._id,
                amount: user.balance,
                transactionType: "gift",
                transactionFee: 0,
                transactionID: (0, transactionID_1.generateTransactionID)(),
                timestamp: new Date(),
            }).save(),
        ]);
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
exports.registrationFromDB = registrationFromDB;
const loginFromDB = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.UsersModel.aggregate([
        { $match: reqBody },
        { $project: { _id: 1, email: 1, name: 1, mobileNumber: 1, active: 1 } },
    ]);
    return user;
});
exports.loginFromDB = loginFromDB;
const userUpdateInDB = (userId, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield user_model_1.UsersModel.updateOne({ _id: userId }, { $set: updateData });
        return result;
    }
    catch (error) {
        // Handle any errors that occur during the update process.
        throw error; // Rethrow the error or handle it as needed.
    }
});
exports.userUpdateInDB = userUpdateInDB;
