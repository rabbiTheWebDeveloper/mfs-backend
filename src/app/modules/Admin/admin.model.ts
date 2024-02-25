import { IAdmin } from "./admin.interface";
import mongoose, { Schema } from "mongoose";
const adminSchema = new Schema({
  name: String,
  pin: String, // hashed pin
  mobileNumber: { type: String, unique: true },
  email: { type: String, unique: true },
  accountType: { type: String, default: 'Admin' },
  nid: String,
  lastLoginDevice: String
}, {
  timestamps: true,
  versionKey:false
});
export const AdminModel=mongoose.model<IAdmin>('admin',adminSchema);
