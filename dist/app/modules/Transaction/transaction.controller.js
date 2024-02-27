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
exports.TransactionController = void 0;
const transaction_service_1 = require("./transaction.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    const result = yield transaction_service_1.Transactionservice.sentMoneyInsertIntoDB(payload.userId, payload.receiverId, payload.amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sent Money successfully!",
        data: result,
    });
}));
const transactionIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.headers.id;
    const result = yield transaction_service_1.Transactionservice.transactionIntoDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "transactionList retrieved successfully!",
        data: result,
    });
}));
const balanceIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.headers.id;
    const token = req.headers.token;
    console.log(`balanceIntoDB `, token);
    const result = yield transaction_service_1.Transactionservice.balanceIntoDB(user, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Balance successfully!",
        data: result,
    });
}));
const cashOutIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    console.log(payload);
    const result = yield transaction_service_1.Transactionservice.cashOutIntoDB(payload.userId, payload.receiverId, payload.amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Sent Money successfully!",
        data: result,
    });
}));
const cashinAgentInsertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    console.log(payload);
    const result = yield transaction_service_1.Transactionservice.cashinAgentInsertIntoDB(payload.userId, payload.receiverId, payload.amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cash IN  Agent successfully!",
        data: result,
    });
}));
exports.TransactionController = {
    insertIntoDB,
    cashOutIntoDB,
    cashinAgentInsertIntoDB,
    balanceIntoDB,
    transactionIntoDB,
};
