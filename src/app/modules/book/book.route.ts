import express from "express";
import { BooksController } from "./book.controller";
import { auth } from "../../middleware/AuthVerifyMiddleware";

const router = express.Router();
router.get("/", BooksController.getAllFromDB);
router.get("/:id", BooksController.getByIdFromDB);
router.post("/", auth, BooksController.insertIntoDB);
router.post("/review/:id",auth, BooksController.insertReviewFromDB);
router.patch("/:id", auth, BooksController.updateOneInDB);
router.delete("/:id", auth, BooksController.deleteByIdFromDB);

export const BookesRoutes = router;
