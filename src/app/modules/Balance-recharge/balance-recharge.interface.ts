import { Types } from "mongoose";
export interface IBalanceRecharge extends Document {
  userId: Types.ObjectId;
  amount: number;
  status: string;
  timestamp: Date;
  
}