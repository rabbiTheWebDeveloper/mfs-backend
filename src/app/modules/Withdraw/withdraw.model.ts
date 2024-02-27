import mongoose, { Schema, Model, model } from "mongoose";
import { IWithdraw } from "./withdraw.interface";

type transactionModel = Model<IWithdraw, Record<string, unknown>>;
const withdrawStatusSchema = new Schema<IWithdraw>({
  userId: { type: Schema.Types.ObjectId, ref:'agents' },
  amount: Number,
  withdrawStatus:{ type : String  , default: "pending"},
  timestamp: { type: Date, default: Date.now }
});
export const WithdraweModel = model<IWithdraw, transactionModel>("withdraw-list", withdrawStatusSchema);
