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
exports.Wishservice = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const wish_constants_1 = require("./wish.constants");
const wish_model_1 = require("./wish.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId } = data;
    const wishBook = yield wish_model_1.Wish.findOne(data);
    if (wishBook) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Wish is  same");
    }
    const user = new wish_model_1.Wish(data);
    yield user.save();
    return user;
});
const getAllFromDB = (filters, paginationOptions, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: wish_constants_1.wishSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $paginationOptions: "i",
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // Add the condition to filter by userId
    andConditions.push({ userId: userId });
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield wish_model_1.Wish.find(whereConditions)
        .populate("userId", "name email -_id")
        .populate("bookId", "title publication_Date genre author -_id")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield wish_model_1.Wish.countDocuments();
    // return Book.find().sort({ createdAt: -1 });
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const deleteByIdFromDB = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield wish_model_1.Wish.findOne({ _id: id, userId: userId });
    if (!book) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Wish not found");
    }
    const result = yield wish_model_1.Wish.findByIdAndDelete(id);
    return result;
});
exports.Wishservice = {
    insertIntoDB,
    getAllFromDB,
    deleteByIdFromDB,
};
