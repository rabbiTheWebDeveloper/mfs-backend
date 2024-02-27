import { Types } from "mongoose";

export interface IAgent extends Document {
  name: string;
  pin: string;
  mobileNumber: string;
  email: string;
  accountType: string;
  nid: string;
  balance: number;
  transactions:Types.ObjectId[];
  approvalStatus: string;
  activeSessionToken?: string;
}