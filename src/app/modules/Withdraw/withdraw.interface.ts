import { Types } from "mongoose";
export interface IWithdraw extends Document {
  userId: Types.ObjectId;
  amount: number;
  withdrawStatus: string;
  timestamp: Date;
  
}