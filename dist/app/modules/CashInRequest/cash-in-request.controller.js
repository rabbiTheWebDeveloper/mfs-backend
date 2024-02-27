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
exports.CashInRequestController = void 0;
const cash_in_request_service_1 = require("./cash-in-request.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    console.log(payload);
    const result = yield cash_in_request_service_1.CaseInRequestService.insertIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "CaseIn Request successfully!",
        data: result,
    });
}));
const updateIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const payload = req.body;
    const admin = req.headers.id;
    const result = yield cash_in_request_service_1.CaseInRequestService.updateIntoDB(id, admin, payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Status Updated successfully!",
        data: result,
    });
}));
const getAllIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminID = req.headers.id;
    const result = yield cash_in_request_service_1.CaseInRequestService.getAllIntoDB(adminID);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "CaseInRequest Retrived successfully!",
        data: result,
    });
}));
const getAllWithUserIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = req.headers.id;
    const result = yield cash_in_request_service_1.CaseInRequestService.getAllWithUserIntoDB(agent);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "CaseInRequest Retrived successfully!",
        data: result,
    });
}));
exports.CashInRequestController = {
    insertIntoDB,
    updateIntoDB,
    getAllWithUserIntoDB,
    getAllIntoDB,
};
