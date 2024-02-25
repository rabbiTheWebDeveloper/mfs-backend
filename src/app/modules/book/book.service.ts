import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { bookSearchableFields } from "./book.constants";
import { IBook, IBookFilters, IReview } from "./book.interface";
import { Book } from "./book.model";
import { IGenericResponse } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const insertIntoDB = async (data: any): Promise<IBook> => {
  const user = new Book(data);
  await user.save();
  return user;
};

const getAllFromDB = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions,
  userId: string
): Promise<IGenericResponse<IBook[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: bookSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $paginationOptions: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }
  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Book.find(whereConditions)
    .populate("userId" , "name email -_id" )
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments();

  // return Book.find().sort({ createdAt: -1 });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<IBook | null> => {
  const result = await Book.findById(id);
  return result;
};

const updateOneInDB = async (
  id: string,
  payload: Partial<IBook>,
  userId: string
): Promise<IBook | null> => {
  const book = await Book.findOne({ _id: id, userId: userId });

  if (!book) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Book not found');
  }
  const result = await Book.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteByIdFromDB = async (id: string , userId: string): Promise<IBook | null> => {

  const book = await Book.findOne({ _id: id, userId: userId });

  if (!book) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Book not found');
  }
  const result = await Book.findByIdAndDelete(id);
  return result;
};

const insertReviewFromDB= async (
  id: string,
  payload: IReview,
): Promise<IBook | null> => {
  const book = await Book.findById(id).exec();
  if (!book) {
      throw new ApiError(httpStatus.NOT_FOUND, "Book not found!");
  }
  const result = await Book.findByIdAndUpdate(
      id,
      {
          $push: { reviews: payload },
      },
      // { new: true },
  ).exec();
  return result;
};
export const Bookservice = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  insertReviewFromDB
};
