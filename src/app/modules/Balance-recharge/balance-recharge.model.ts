import mongoose, { Schema, Model, model } from "mongoose";
import { IBalanceRecharge } from "./balance-recharge.interface";

type transactionModel = Model<IBalanceRecharge, Record<string, unknown>>;
const balanceRechargeSchema = new Schema<IBalanceRecharge>({
  userId: { type: Schema.Types.ObjectId, ref:'agents' },
  amount: Number,
  status:{ type : String  , default: "pending"},
  timestamp: { type: Date, default: Date.now }
});
export const BalanceRechargeModel = model<IBalanceRecharge, transactionModel>("balance-recharge", balanceRechargeSchema);
