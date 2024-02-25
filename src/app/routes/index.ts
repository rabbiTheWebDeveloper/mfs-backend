import express from "express";
import { userRoutes } from "../modules/User/user.router";
import { BookesRoutes } from "../modules/book/book.route";
import { WishRoutes } from "../modules/wish-list/wish.route";
import { ReadingRoutes } from "../modules/Reading/reading.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: userRoutes,
  },
  {
    path: "/books",
    route: BookesRoutes,
  },
  {
    path: "/wish",
    route: WishRoutes,
  },
  {
    path: "/reading",
    route: ReadingRoutes,
  },
  
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
