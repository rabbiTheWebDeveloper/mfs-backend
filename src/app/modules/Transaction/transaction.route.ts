import express from "express";
import { TransactionController } from "./transaction.controller";
import { auth } from "../../middleware/AuthVerifyMiddleware";

const router = express.Router();
router.post("/sentMoney", TransactionController.insertIntoDB);


export const transactionRoutes = router;
