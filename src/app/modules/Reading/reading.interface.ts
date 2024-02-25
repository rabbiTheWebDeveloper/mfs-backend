import { Types } from "mongoose";
export type IReading = {
  bookId: Types.ObjectId;
  userId: Types.ObjectId;
};

export type IReadingFilters = {
  searchTerm?: string;
  books?: Types.ObjectId;
};
