import { SortOrder } from "mongoose";
import { paginationHelpers } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import { readingSearchableFields } from "./reading.constants";
import { IReading, IReadingFilters } from "./reading.interface";
import { Reading } from "./reading.model";
import { IGenericResponse } from "../../interfaces/common";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const insertIntoDB = async (data: any): Promise<IReading> => {
  const { bookId } = data;
  const wishBook = await Reading.findOne(data);
  if (wishBook) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Reading  book is  same");
  }

  const user = new Reading(data);
  await user.save();
  return user;
};

const getAllFromDB = async (
  filters: IReadingFilters,

  paginationOptions: IPaginationOptions,
  userId: string
): Promise<IGenericResponse<IReading[]>> => {
  const { limit, page, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  const { searchTerm, ...filtersData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: readingSearchableFields.map((field) => ({
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

  const result = await Reading.find(whereConditions)
    .populate("userId", "name email -_id")
    .populate("bookId", "title publication_Date genre author -_id")
    .sort(sortConditions)
    .skip(skip)
    .limit(limit);

  const total = await Reading.countDocuments();

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
): Promise<IReading | null> => {
  const book = await Reading.findOne({ _id: id, userId: userId });

  if (!book) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Reading Book not found");
  }
  const result = await Reading.findByIdAndDelete(id);
  return result;
};

export const Readingservice = {
  insertIntoDB,
  getAllFromDB,
  deleteByIdFromDB,
};
