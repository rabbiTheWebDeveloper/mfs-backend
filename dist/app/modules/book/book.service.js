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
exports.Bookservice = void 0;
const paginationHelper_1 = require("../../helpers/paginationHelper");
const book_constants_1 = require("./book.constants");
const book_model_1 = require("./book.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const insertIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new book_model_1.Book(data);
    yield user.save();
    return user;
});
const getAllFromDB = (filters, paginationOptions, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const { limit, page, skip, sortBy, sortOrder } = paginationHelper_1.paginationHelpers.calculatePagination(paginationOptions);
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: book_constants_1.bookSearchableFields.map((field) => ({
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
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield book_model_1.Book.find(whereConditions)
        .populate("userId", "name email -_id")
        .sort(sortConditions)
        .skip(skip)
        .limit(limit);
    const total = yield book_model_1.Book.countDocuments();
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
const getByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield book_model_1.Book.findById(id);
    return result;
});
const updateOneInDB = (id, payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findOne({ _id: id, userId: userId });
    if (!book) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Book not found');
    }
    const result = yield book_model_1.Book.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
const deleteByIdFromDB = (id, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findOne({ _id: id, userId: userId });
    if (!book) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Book not found');
    }
    const result = yield book_model_1.Book.findByIdAndDelete(id);
    return result;
});
const insertReviewFromDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const book = yield book_model_1.Book.findById(id).exec();
    if (!book) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Book not found!");
    }
    const result = yield book_model_1.Book.findByIdAndUpdate(id, {
        $push: { reviews: payload },
    }).exec();
    return result;
});
exports.Bookservice = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateOneInDB,
    deleteByIdFromDB,
    insertReviewFromDB
};
