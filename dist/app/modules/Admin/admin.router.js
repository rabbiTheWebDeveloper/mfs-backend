"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const router = (0, express_1.Router)();
router.post("/signup", 
// validateRequest(UserValidation.createUserZodSchema),
admin_controller_1.registration);
router.post("/signin", admin_controller_1.login);
// router.post("/user-update/:id",userUpdate);
exports.adminRoutes = router;
