import { Types } from "mongoose";
export interface IUser extends Document {
  name: string;
  pin: string;
  mobileNumber: string;
  email: string;
  accountType: string;
  nid: string;
  balance: number;
  lastLoginDevice?: string;
  activeSessionToken?: string;
  transactions: Types.ObjectId[];
  active: boolean;
}
