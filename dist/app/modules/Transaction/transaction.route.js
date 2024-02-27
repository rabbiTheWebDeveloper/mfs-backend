"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRoutes = void 0;
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const AuthVerifyMiddleware_1 = require("../../middleware/AuthVerifyMiddleware");
const router = express_1.default.Router();
router.post("/sentMoney", AuthVerifyMiddleware_1.auth, transaction_controller_1.TransactionController.insertIntoDB);
router.post("/cashOut", AuthVerifyMiddleware_1.auth, transaction_controller_1.TransactionController.cashOutIntoDB);
router.post("/cash-in-agent", AuthVerifyMiddleware_1.auth, transaction_controller_1.TransactionController.cashinAgentInsertIntoDB);
router.post("/balance", AuthVerifyMiddleware_1.auth, transaction_controller_1.TransactionController.balanceIntoDB);
router.get("/transaction-list", AuthVerifyMiddleware_1.auth, transaction_controller_1.TransactionController.transactionIntoDB);
exports.transactionRoutes = router;
