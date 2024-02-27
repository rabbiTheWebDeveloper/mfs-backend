"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthVerifyMiddleware_1 = require("../../middleware/AuthVerifyMiddleware");
const withdraw_controller_1 = require("./withdraw.controller");
const router = express_1.default.Router();
router.post("/", AuthVerifyMiddleware_1.auth, withdraw_controller_1.WithdrawController.insertIntoDB);
// router.put("/admin/:id", auth, WithdrawController.updateIntoDB);
router.put("/:id", AuthVerifyMiddleware_1.auth, withdraw_controller_1.WithdrawController.updateIntoDB);
router.get("/", AuthVerifyMiddleware_1.auth, withdraw_controller_1.WithdrawController.getAllWithUserIntoDB);
router.get("/admin", AuthVerifyMiddleware_1.auth, withdraw_controller_1.WithdrawController.getAllIntoDB);
exports.WithdrawRoutes = router;
