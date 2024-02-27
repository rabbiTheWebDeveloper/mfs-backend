import express from "express";
import { auth } from "../../middleware/AuthVerifyMiddleware";
import { BalanceRechargeController } from "./balance-recharge.controller";

const router = express.Router();
router.post("/", auth, BalanceRechargeController.insertIntoDB);
router.put("/admin/:id", auth, BalanceRechargeController.updateIntoDB);
router.put("/:id", auth, BalanceRechargeController.updateIntoDB);
router.get("/", auth, BalanceRechargeController.getAllWithUserIntoDB);
router.get("/admin", auth, BalanceRechargeController.getAllIntoDB);

export const BalanceRechargeRoutes = router;
