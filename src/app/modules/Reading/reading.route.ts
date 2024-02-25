import express from "express";
import { ReadingController } from "./reading.controller";
import { auth } from "../../middleware/AuthVerifyMiddleware";

const router = express.Router();
router.get("/", auth, ReadingController.getAllFromDB);
router.post("/", auth, ReadingController.insertIntoDB);
router.delete("/:id", auth, ReadingController.deleteByIdFromDB);

export const ReadingRoutes = router;
