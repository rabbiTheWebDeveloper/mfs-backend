"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
router.post("/signup", (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserZodSchema), user_controller_1.registration);
router.post("/signin", user_controller_1.login);
// router.post("/user-update/:id",userUpdate);
exports.userRoutes = router;
