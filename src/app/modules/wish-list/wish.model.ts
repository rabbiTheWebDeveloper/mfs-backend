import mongoose, { Schema, Model, model } from "mongoose";
import { IWish } from "./wish.interface";

type bookModel = Model<IWish, Record<string, unknown>>;
const bookSchema = new Schema<IWish>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Books" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const Wish = model<IWish, bookModel>("wishs", bookSchema);
