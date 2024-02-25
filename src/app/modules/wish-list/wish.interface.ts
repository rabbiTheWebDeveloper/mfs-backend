import { Types } from "mongoose";
export type IReview = {
  comments: string;
  userId: Types.ObjectId;
};
export type IWish = {
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
};

export type IWishFilters = {
  searchTerm?: string;
  books?: Types.ObjectId;
};
