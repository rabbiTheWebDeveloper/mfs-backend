import { Types } from "mongoose";
export interface IAdmin extends Document {
  name: string;
  pin: string;
  mobileNumber: string;
  email: string;
  accountType: string;
  nid: string;
  balance: number;
  lastLoginDevice?: string;
  activeSessionToken?: string;
}


export interface IApprovalRequest extends Document {
  agent: Types.ObjectId;
  status: string;
  timestamp: Date;
}
