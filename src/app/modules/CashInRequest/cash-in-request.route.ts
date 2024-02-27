import express from "express";
import { auth } from "../../middleware/AuthVerifyMiddleware";
import { CashInRequestController } from "./cash-in-request.controller";

const router = express.Router();
router.post("/", auth, CashInRequestController.insertIntoDB);
// router.put("/admin/:id", auth, CashInRequestController.updateIntoDB);
router.put("/:id", auth, CashInRequestController.updateIntoDB);
router.get("/", auth, CashInRequestController.getAllWithUserIntoDB);
router.get("/admin", auth, CashInRequestController.getAllIntoDB);

export const CashInRequestRoutes = router;
