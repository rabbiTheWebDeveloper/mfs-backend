import mongoose, { Schema, Model, model } from "mongoose";
import { IBook } from "./book.interface";

type bookModel = Model<IBook, Record<string, unknown>>;
const bookSchema = new Schema<IBook>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    publication_Date: {
      type: String,
      required: true,
    },
    reviews: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
          comments: {
            type: String,
            required: true,
          },
        },
      ],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
export const Book = model<IBook, bookModel>("Books", bookSchema);
