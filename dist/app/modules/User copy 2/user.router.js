"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.post("/signup", 
// validateRequest(UserValidation.createUserZodSchema),
user_controller_1.registration);
router.post("/signin", user_controller_1.login);
// router.post("/user-update/:id",userUpdate);
exports.userRoutes = router;
