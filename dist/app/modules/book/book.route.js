"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("./book.controller");
const AuthVerifyMiddleware_1 = require("../../middleware/AuthVerifyMiddleware");
const router = express_1.default.Router();
router.get("/", book_controller_1.BooksController.getAllFromDB);
router.get("/:id", book_controller_1.BooksController.getByIdFromDB);
router.post("/", AuthVerifyMiddleware_1.auth, book_controller_1.BooksController.insertIntoDB);
router.post("/review/:id", AuthVerifyMiddleware_1.auth, book_controller_1.BooksController.insertReviewFromDB);
router.patch("/:id", AuthVerifyMiddleware_1.auth, book_controller_1.BooksController.updateOneInDB);
router.delete("/:id", AuthVerifyMiddleware_1.auth, book_controller_1.BooksController.deleteByIdFromDB);
exports.BookesRoutes = router;
