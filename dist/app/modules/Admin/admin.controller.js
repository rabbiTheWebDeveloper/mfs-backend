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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_service_1 = require("./admin.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const authController_1 = require("../../middleware/authController");
const registration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    if (reqBody.pin) {
        reqBody.pin = yield (0, authController_1.hashPassword)(reqBody.pin);
    }
    const product = yield admin_service_1.AdminService.registrationFromDB(reqBody);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
}));
const login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const data = yield admin_service_1.AdminService.loginFromDB(reqBody);
    const _a = data._doc, { pin, _id, activeSessionToken } = _a, userData = __rest(_a, ["pin", "_id", "activeSessionToken"]);
    if (activeSessionToken) {
        data.activeSessionToken = null;
        yield data.save();
    }
    const compared = yield (0, authController_1.comparePassword)(reqBody.pin, pin);
    if (compared && data) {
        let Payload = {
            exp: Math.floor(Date.now() / 1000) + 50 * 24 * 60 * 60,
            data: _id,
        };
        let token = jsonwebtoken_1.default.sign(Payload, "SecretKey123456789");
        data.activeSessionToken = token;
        yield data.save();
        res.status(200).json({ status: "success", token: token, data: userData });
    }
    else {
        res.status(401).json({ status: "unauthorized" });
    }
    // }
}));
const userUpdateOnDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    const result = yield admin_service_1.AdminService.userUpdateOnDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User updated successfully !",
        data: result,
    });
}));
const agentApprovedUpdateOnDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedData = req.body;
    const result = yield admin_service_1.AdminService.agentApprovedUpdateOnDB(id, updatedData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Agent Approved successfully !",
        data: result,
    });
}));
const cashOutUserIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    console.log(payload);
    const result = yield admin_service_1.AdminService.cashOutUserIntoDB(payload.userId, payload.receiverId, payload.amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cash Out Admin successfully!",
        data: result,
    });
}));
const userListInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.headers.id;
    const result = yield admin_service_1.AdminService.userListInDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "User List  successfully!",
        data: result,
    });
}));
const agentListInDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.headers.id;
    const result = yield admin_service_1.AdminService.agentListInDB(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Agent List  successfully!",
        data: result,
    });
}));
const cashinAdminToAgentInsertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    console.log(payload);
    const result = yield admin_service_1.AdminService.cashinAdminToAgentInsertIntoDB(payload.userId, payload.receiverId, payload.amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cash Out Admin To Agent successfully!",
        data: result,
    });
}));
const cashinAdminToUserInsertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    console.log(payload);
    const result = yield admin_service_1.AdminService.cashinAdminToUserInsertIntoDB(payload.userId, payload.receiverId, payload.amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Cash Out Admin To User successfully!",
        data: result,
    });
}));
exports.adminController = {
    registration,
    login,
    userUpdateOnDB,
    agentApprovedUpdateOnDB,
    cashOutUserIntoDB,
    userListInDB,
    agentListInDB,
    cashinAdminToAgentInsertIntoDB,
    cashinAdminToUserInsertIntoDB,
};
