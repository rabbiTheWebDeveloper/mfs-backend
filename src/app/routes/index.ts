import express from "express";
import { userRoutes } from "../modules/User/user.router";
import {  transactionRoutes } from "../modules/Transaction/transaction.route";
import { agentsRoutes } from "../modules/Agent/agent.router";
import { adminRoutes } from "../modules/Admin/admin.router";
import { BalanceRechargeRoutes } from "../modules/Balance-recharge/balance-recharge.route";
import { WithdrawRoutes } from "../modules/Withdraw/withdraw.route";
import { CashInRequestRoutes } from "../modules/CashInRequest/cash-in-request.route";
const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/admin",
    route: adminRoutes,
  },
  {
    path: "/agents",
    route: agentsRoutes,
  },
  {
    path: "/transaction",
    route: transactionRoutes,
  },
  {
    path: "/balance-recharge",
    route: BalanceRechargeRoutes,
  },
  {
    path: "/withdraw",
    route: WithdrawRoutes,
  },
  {
    path: "/cash-in-request",
    route: CashInRequestRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
