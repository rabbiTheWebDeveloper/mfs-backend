"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceRechargeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthVerifyMiddleware_1 = require("../../middleware/AuthVerifyMiddleware");
const balance_recharge_controller_1 = require("./balance-recharge.controller");
const router = express_1.default.Router();
router.post("/", AuthVerifyMiddleware_1.auth, balance_recharge_controller_1.BalanceRechargeController.insertIntoDB);
router.put("/admin/:id", AuthVerifyMiddleware_1.auth, balance_recharge_controller_1.BalanceRechargeController.updateIntoDB);
router.put("/:id", AuthVerifyMiddleware_1.auth, balance_recharge_controller_1.BalanceRechargeController.updateIntoDB);
router.get("/", AuthVerifyMiddleware_1.auth, balance_recharge_controller_1.BalanceRechargeController.getAllWithUserIntoDB);
router.get("/admin", AuthVerifyMiddleware_1.auth, balance_recharge_controller_1.BalanceRechargeController.getAllIntoDB);
exports.BalanceRechargeRoutes = router;
