import express from "express";
import { TransactionController } from "./transaction.controller";
import { auth } from "../../middleware/AuthVerifyMiddleware";

const router = express.Router();
router.post("/sentMoney", TransactionController.insertIntoDB);
router.post("/cashOut",auth, TransactionController.cashOutIntoDB);


export const transactionRoutes = router;
