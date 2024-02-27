import { IUser } from "./user.interface";
import mongoose, { Schema } from "mongoose";
  const userSchema = new Schema <IUser>({
    name: String,
    pin: String, // hashed pin
    mobileNumber: { type: String, unique: true },
    email: { type: String, unique: true },
    accountType: { type: String, default: 'User' },
    nid: String,
    balance: { type: Number, default: 40 }, // Initial bonus for users
    active: { type: Boolean, default: true }, // Initial bonus for users
    lastLoginDevice: String,
    activeSessionToken: String,
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
} , {
  timestamps: true,
  versionKey:false
} );
export const UsersModel=mongoose.model<IUser>('users',userSchema);
