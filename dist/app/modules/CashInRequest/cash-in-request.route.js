"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashInRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const AuthVerifyMiddleware_1 = require("../../middleware/AuthVerifyMiddleware");
const cash_in_request_controller_1 = require("./cash-in-request.controller");
const router = express_1.default.Router();
router.post("/", AuthVerifyMiddleware_1.auth, cash_in_request_controller_1.CashInRequestController.insertIntoDB);
// router.put("/admin/:id", auth, CashInRequestController.updateIntoDB);
router.put("/:id", AuthVerifyMiddleware_1.auth, cash_in_request_controller_1.CashInRequestController.updateIntoDB);
router.get("/", AuthVerifyMiddleware_1.auth, cash_in_request_controller_1.CashInRequestController.getAllWithUserIntoDB);
router.get("/admin", AuthVerifyMiddleware_1.auth, cash_in_request_controller_1.CashInRequestController.getAllIntoDB);
exports.CashInRequestRoutes = router;
