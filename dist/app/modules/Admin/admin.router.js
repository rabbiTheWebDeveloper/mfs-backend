"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const AuthVerifyMiddleware_1 = require("../../middleware/AuthVerifyMiddleware");
const router = (0, express_1.Router)();
router.post("/signup", 
// validateRequest(UserValidation.createUserZodSchema),
admin_controller_1.adminController.registration);
router.post("/signin", admin_controller_1.adminController.login);
router.post("/user-update/:id", AuthVerifyMiddleware_1.auth, admin_controller_1.adminController.userUpdateOnDB);
router.post("/agent-update/:id", AuthVerifyMiddleware_1.auth, admin_controller_1.adminController.agentApprovedUpdateOnDB);
exports.adminRoutes = router;
