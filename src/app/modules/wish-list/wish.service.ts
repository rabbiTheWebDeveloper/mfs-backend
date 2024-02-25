import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { wishSearchableFields } from "./wish.constants";
import { IWish, IWishFilters } from "./wish.interface";
import { Wish } from "./wish.model";
import { IGenericResponse } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const insertIntoDB = async (data: any): Promise<IWish> => {
  const { bookId } = data;
  const wishBook = await Wish.findOne(data);
  if (wishBook) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Wish is  same");
  }

  const user = new Wish(data);
  await user.save();
  return user;
};

const getAllFromDB = async (
  filters: IWishFilters,

  paginationOptions: IPaginationOptions,
  userId: string
): Promise<IGenericResponse<IWish[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: wishSearchableFields.map((field) => ({
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

  // Add the condition to filter by userId
  andConditions.push({ userId: userId });
  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Wish.find(whereConditions)
    .populate("userId", "name email -_id")
    .populate("bookId", "title publication_Date genre author -_id")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Wish.countDocuments();

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

const deleteByIdFromDB = async (
  id: string,
  userId: string
): Promise<IWish | null> => {
  const book = await Wish.findOne({ _id: id, userId: userId });

  if (!book) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Wish not found");
  }
  const result = await Wish.findByIdAndDelete(id);
  return result;
};

export const Wishservice = {
  insertIntoDB,
  getAllFromDB,
  deleteByIdFromDB,
};
