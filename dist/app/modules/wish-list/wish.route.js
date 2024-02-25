"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wish_controller_1 = require("./wish.controller");
const AuthVerifyMiddleware_1 = require("../../middleware/AuthVerifyMiddleware");
const router = express_1.default.Router();
router.get("/", AuthVerifyMiddleware_1.auth, wish_controller_1.WishsController.getAllFromDB);
router.post("/", AuthVerifyMiddleware_1.auth, wish_controller_1.WishsController.insertIntoDB);
router.delete("/:id", AuthVerifyMiddleware_1.auth, wish_controller_1.WishsController.deleteByIdFromDB);
exports.WishRoutes = router;
