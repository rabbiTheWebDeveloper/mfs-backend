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
router.post("/cash-out-admin", AuthVerifyMiddleware_1.auth, admin_controller_1.adminController.cashOutUserIntoDB);
router.post("/cash-out-admin-to-agent", AuthVerifyMiddleware_1.auth, admin_controller_1.adminController.cashinAdminToAgentInsertIntoDB);
router.post("/cash-out-admin-to-user", AuthVerifyMiddleware_1.auth, admin_controller_1.adminController.cashinAdminToUserInsertIntoDB);
router.get("/user-list", AuthVerifyMiddleware_1.auth, admin_controller_1.adminController.userListInDB);
router.get("/agent-list", AuthVerifyMiddleware_1.auth, admin_controller_1.adminController.agentListInDB);
exports.adminRoutes = router;
