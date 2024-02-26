import mongoose, { Schema, Model, model } from "mongoose";
import { ITransaction } from "./transaction.interface";

type transactionModel = Model<ITransaction, Record<string, unknown>>;
const transactionSchema = new Schema<ITransaction>({
  sender: { type: Schema.Types.ObjectId, ref:'users' ||'agents' },
  receiver:{ type: Schema.Types.ObjectId, ref:'users'||'agents' },
  amount: Number,
  transactionType: String,
  transactionFee: Number,
  transactionID: String,
  timestamp: { type: Date, default: Date.now }
});
export const Transaction = model<ITransaction, transactionModel>("transaction", transactionSchema);
