import mongoose, { Schema, Model, model } from "mongoose";
import { IReading } from "./reading.interface";

type bookModel = Model<IReading, Record<string, unknown>>;
const bookSchema = new Schema<IReading>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Books" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const Reading = model<IReading, bookModel>("Reading", bookSchema);
