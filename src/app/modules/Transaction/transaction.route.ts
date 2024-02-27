import express from "express";
import { TransactionController } from "./transaction.controller";
import { auth } from "../../middleware/AuthVerifyMiddleware";

const router = express.Router();
router.post("/sentMoney", auth, TransactionController.insertIntoDB);
router.post("/cashOut",auth, TransactionController.cashOutIntoDB);
router.post("/cash-in-agent",auth, TransactionController.cashinAgentInsertIntoDB);
router.post("/balance",auth, TransactionController.balanceIntoDB);
router.get("/transaction-list",auth, TransactionController.transactionIntoDB);


export const transactionRoutes = router;
