"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const reading_controller_1 = require("./reading.controller");
const AuthVerifyMiddleware_1 = require("../../middleware/AuthVerifyMiddleware");
const router = express_1.default.Router();
router.get("/", AuthVerifyMiddleware_1.auth, reading_controller_1.ReadingController.getAllFromDB);
router.post("/", AuthVerifyMiddleware_1.auth, reading_controller_1.ReadingController.insertIntoDB);
router.delete("/:id", AuthVerifyMiddleware_1.auth, reading_controller_1.ReadingController.deleteByIdFromDB);
exports.ReadingRoutes = router;
