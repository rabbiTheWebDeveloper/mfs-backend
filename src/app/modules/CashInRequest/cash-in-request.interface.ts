import { Types } from "mongoose";
export interface ICaseInRequest extends Document {
  userId: Types.ObjectId;
  amount: number;
  status: string;
  timestamp: Date;
  
}