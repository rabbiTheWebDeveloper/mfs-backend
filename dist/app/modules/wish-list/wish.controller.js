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
exports.WishsController = void 0;
const wish_service_1 = require("./wish.service");
const catchAsync_1 = __importDefault(require("../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const wish_constants_1 = require("./wish.constants");
const pick_1 = __importDefault(require("../../shared/pick"));
const insertIntoDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    const result = yield wish_service_1.Wishservice.insertIntoDB(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wish created successfully!",
        data: result,
    });
}));
const getAllFromDB = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, wish_constants_1.wishFilterableFields);
    const paginationOptions = (0, pick_1.default)(req.query, wish_constants_1.wishSearchableFields);
    const user = req.headers.id;
    const result = yield wish_service_1.Wishservice.getAllFromDB(filters, paginationOptions, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wishs retrieved successfully!",
        data: result,
    });
});
const deleteByIdFromDB = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.headers.id;
    const id = req.params.id;
    const result = yield wish_service_1.Wishservice.deleteByIdFromDB(id, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Wish deleted successfully !",
        data: result,
    });
}));
exports.WishsController = {
    insertIntoDB,
    getAllFromDB,
    deleteByIdFromDB,
};
