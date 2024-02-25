import { Request, RequestHandler, Response } from "express";
import { Bookservice } from "./book.service";
import catchAsync from "../../shared/catchAsync";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IBook } from "./book.interface";
import { bookFilterableFields, bookSearchableFields } from "./book.constants";
import pick from "../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;
  const result = await Bookservice.insertIntoDB(payload);
  sendReponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book created successfully!",
    data: result,
  });
});
const getAllFromDB = async (req: Request, res: Response) => {
  const filters = pick(req.query, bookFilterableFields);
  const paginationOptions = pick(req.query, bookSearchableFields);
  const user = req.headers.id as string;
  const result = await Bookservice.getAllFromDB(
    filters,
    paginationOptions,
    user
  );
  sendReponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully!",
    data: result,
  });
};

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.headers.id;
  const id = req.params.id;
  const result = await Bookservice.getByIdFromDB(id);
  sendReponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book retrieved successfully !",
    data: result,
  });
});

const updateOneInDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.headers.id as string;
  const id = req.params.id;
  const updatedData = req.body;
  const result = await Bookservice.updateOneInDB(id, updatedData, user);
  sendReponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Join updated successfully !",
    data: result,
  });
});

const deleteByIdFromDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.headers.id as string;
  const id = req.params.id;
  const result = await Bookservice.deleteByIdFromDB(id, user);
  sendReponse<IBook>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Book deleted successfully !",
    data: result,
  });
});
const insertReviewFromDB = catchAsync(async (req, res) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;

  const result = await Bookservice.insertReviewFromDB(req.params.id, payload);
  sendReponse<IBook>(res, {
    success: true,
    statusCode: httpStatus.OK,
    data: result,
    message: "Successfully added review",
  });
});
export const BooksController = {
  insertIntoDB,
  getAllFromDB,
  getByIdFromDB,
  updateOneInDB,
  deleteByIdFromDB,
  insertReviewFromDB,
};
