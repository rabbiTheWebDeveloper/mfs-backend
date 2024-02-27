import mongoose, { Schema, Model, model } from "mongoose";
import { ICaseInRequest } from "./cash-in-request.interface";

type transactionModel = Model<ICaseInRequest, Record<string, unknown>>;
const CaseInRequestSchema = new Schema<ICaseInRequest>({
  userId: { type: Schema.Types.ObjectId, ref: "agents" },
  amount: { type: Number, default: 100000 },
  status: { type: String, default: "pending" },
  timestamp: { type: Date, default: Date.now },
});
export const CaseInRequestModel = model<ICaseInRequest, transactionModel>(
  "cash-request",
  CaseInRequestSchema
);
