import { Types } from "mongoose";
export type IReview = {
  comments: string;
  userId: Types.ObjectId;
};
export type IBook = {
  title: string;
  author: string;
  genre: string;
  publication_Date: string;
  image: string;
  reviews: IReview[];
  userId: Types.ObjectId;
};

export type IBookFilters = {
  searchTerm?: string;
  books?: Types.ObjectId;
};
