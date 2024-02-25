"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = require("../modules/User/user.router");
const transaction_route_1 = require("../modules/Transaction/transaction.route");
const agent_router_1 = require("../modules/Agent/agent.router");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_router_1.userRoutes,
    },
    {
        path: "/agents",
        route: agent_router_1.agentsRoutes,
    },
    {
        path: "/transaction",
        route: transaction_route_1.transactionRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
