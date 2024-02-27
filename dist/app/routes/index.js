"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_1 = require("../modules/User/user.router");
const transaction_route_1 = require("../modules/Transaction/transaction.route");
const agent_router_1 = require("../modules/Agent/agent.router");
const admin_router_1 = require("../modules/Admin/admin.router");
const balance_recharge_route_1 = require("../modules/Balance-recharge/balance-recharge.route");
const withdraw_route_1 = require("../modules/Withdraw/withdraw.route");
const cash_in_request_route_1 = require("../modules/CashInRequest/cash-in-request.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_router_1.userRoutes,
    },
    {
        path: "/admin",
        route: admin_router_1.adminRoutes,
    },
    {
        path: "/agents",
        route: agent_router_1.agentsRoutes,
    },
    {
        path: "/transaction",
        route: transaction_route_1.transactionRoutes,
    },
    {
        path: "/balance-recharge",
        route: balance_recharge_route_1.BalanceRechargeRoutes,
    },
    {
        path: "/withdraw",
        route: withdraw_route_1.WithdrawRoutes,
    },
    {
        path: "/cash-in-request",
        route: cash_in_request_route_1.CashInRequestRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
