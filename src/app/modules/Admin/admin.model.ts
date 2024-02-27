import { IAdmin } from "./admin.interface";
import mongoose, { Schema } from "mongoose";
const adminSchema = new Schema({
  name: String,
  pin: String, // hashed pin
  mobileNumber: { type: String, unique: true },
  email: { type: String, unique: true },
  accountType: { type: String, default: 'Admin' },
  nid: String,
  balance: { type: Number, default: 0 },
  lastLoginDevice: String ,
  activeSessionToken: String,
}, {
  timestamps: true,
  versionKey:false
});
export const AdminModel=mongoose.model<IAdmin>('admin',adminSchema);
