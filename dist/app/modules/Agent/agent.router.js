"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentsRoutes = void 0;
const express_1 = require("express");
const agent_controller_1 = require("./agent.controller");
const router = (0, express_1.Router)();
router.post("/signup", 
// validateRequest(UserValidation.createUserZodSchema),
agent_controller_1.registration);
router.post("/signin", agent_controller_1.login);
exports.agentsRoutes = router;
