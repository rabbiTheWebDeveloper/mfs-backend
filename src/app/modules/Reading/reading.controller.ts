import { Request, RequestHandler, Response } from "express";
import { Readingservice } from "./reading.service";
import catchAsync from "../../shared/catchAsync";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IReading } from "./reading.interface";
import {
  readingFilterableFields,
  readingSearchableFields,
} from "./reading.constants";
import pick from "../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;
  const result = await Readingservice.insertIntoDB(payload);
  sendReponse<IReading>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wish created successfully!",
    data: result,
  });
});
const getAllFromDB = async (req: Request, res: Response) => {
  const filters = pick(req.query, readingFilterableFields);
  const paginationOptions = pick(req.query, readingSearchableFields);
  const user = req.headers.id as string;
  const result = await Readingservice.getAllFromDB(
    filters,
    paginationOptions,
    user
  );
  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wishs retrieved successfully!",
    data: result,
  });
};

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.headers.id as string;
  const id = req.params.id;
  const result = await Readingservice.deleteByIdFromDB(id, user);
  sendReponse<IReading>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wish deleted successfully !",
    data: result,
  });
});

export const ReadingController = {
  insertIntoDB,
  getAllFromDB,
  deleteByIdFromDB,
};
