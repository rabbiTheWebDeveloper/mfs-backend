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
exports.adminController = void 0;
const responseHandler_1 = require("../../utlis/responseHandler");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const admin_service_1 = require("./admin.service");
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const registration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const product = yield admin_service_1.AdminService.registrationFromDB(reqBody);
    (0, responseHandler_1.sendApiResponse)(res, 200, true, product);
}));
const login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const data = yield admin_service_1.AdminService.loginFromDB(reqBody);
    if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
        let Payload = {
            exp: Math.floor(Date.now() / 1000) + 50 * 24 * 60 * 60,
            data: data[0]["_id"],
        };
        let token = jsonwebtoken_1.default.sign(Payload, "SecretKey123456789");
        res.status(200).json({ status: "success", token: token, data: data[0] });
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
exports.adminController = {
    registration,
    login,
    userUpdateOnDB,
    agentApprovedUpdateOnDB
};
