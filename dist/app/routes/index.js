"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = require("../modules/User/user.router");
const book_route_1 = require("../modules/book/book.route");
const wish_route_1 = require("../modules/wish-list/wish.route");
const reading_route_1 = require("../modules/Reading/reading.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/auth",
        route: user_router_1.userRoutes,
    },
    {
        path: "/books",
        route: book_route_1.BookesRoutes,
    },
    {
        path: "/wish",
        route: wish_route_1.WishRoutes,
    },
    {
        path: "/reading",
        route: reading_route_1.ReadingRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
