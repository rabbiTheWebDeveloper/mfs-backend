import { Types } from "mongoose";
export interface ITransaction extends Document {
  sender: Types.ObjectId;
  receiver:Types.ObjectId;
  amount: number;
  transactionType: string;
  transactionFee: number;
  transactionID: string;
  timestamp: Date;
  
}