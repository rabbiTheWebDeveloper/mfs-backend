import express from "express";
import { WishsController } from "./wish.controller";
import { auth } from "../../middleware/AuthVerifyMiddleware";

const router = express.Router();
router.get("/", auth, WishsController.getAllFromDB);
router.post("/", auth, WishsController.insertIntoDB);
router.delete("/:id", auth, WishsController.deleteByIdFromDB);

export const WishRoutes = router;
