import express from "express";
import { auth } from "../../middleware/AuthVerifyMiddleware";
import { WithdrawController } from "./withdraw.controller";

const router = express.Router();
router.post("/", auth, WithdrawController.insertIntoDB);
// router.put("/admin/:id", auth, WithdrawController.updateIntoDB);
router.put("/:id", auth, WithdrawController.updateIntoDB);
router.get("/", auth, WithdrawController.getAllWithUserIntoDB);
router.get("/admin", auth, WithdrawController.getAllIntoDB);

export const WithdrawRoutes = router;
