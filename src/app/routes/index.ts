import express from "express";
import { userRoutes } from "../modules/User/user.router";
import {  transactionRoutes } from "../modules/Transaction/transaction.route";
import { agentsRoutes } from "../modules/Agent/agent.router";
import { adminRoutes } from "../modules/Admin/admin.router";
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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
