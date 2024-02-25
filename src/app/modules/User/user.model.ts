import { IUser } from "./user.interface";
import mongoose, { Schema } from "mongoose";
const DataSchema= new Schema<IUser>({
    email:{type:String,unique:true},
    name:{type:String ,required:true},
    role: {
      type: String,
      enum: ["user", "admin" ,"moderator"],
      default: "user",
      required : true
    },
    mobile:{type:String},
    password:{type:String},
    photo:{type:String ,default: "https://i.ibb.co/7KGjCY4/download-removebg-preview.png"}
}, {
    timestamps: true,
    versionKey:false
  } );
export const UsersModel=mongoose.model<IUser>('users',DataSchema);
