import mongoose, { Schema, Model, model } from "mongoose";
import { ITransaction } from "./transaction.interface";

type transactionModel = Model<ITransaction, Record<string, unknown>>;
const transactionSchema = new Schema<ITransaction>({
  sender: { type: Schema.Types.ObjectId, refPath: 'senderType' },
  receiver: { type: Schema.Types.ObjectId, refPath: 'receiverType' },
  amount: Number,
  transactionType: String,
  transactionFee: Number,
  transactionID: String,
  timestamp: { type: Date, default: Date.now },
  senderType: { type: String, enum: ['users', 'agents'] },
  receiverType: { type: String, enum: ['users', 'agents'] }
});
export const Transaction = model<ITransaction, transactionModel>("transaction", transactionSchema);
