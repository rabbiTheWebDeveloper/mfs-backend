import { Request, RequestHandler, Response } from "express";
import { Wishservice } from "./wish.service";
import catchAsync from "../../shared/catchAsync";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IWish } from "./wish.interface";
import { wishFilterableFields, wishSearchableFields } from "./wish.constants";
import pick from "../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;
  const result = await Wishservice.insertIntoDB(payload);
  sendReponse<IWish>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wish created successfully!",
    data: result,
  });
});
const getAllFromDB = async (req: Request, res: Response) => {
  const filters = pick(req.query, wishFilterableFields);
  const paginationOptions = pick(req.query, wishSearchableFields);
  const user = req.headers.id as string;
  const result = await Wishservice.getAllFromDB(
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
  const result = await Wishservice.deleteByIdFromDB(id, user);
  sendReponse<IWish>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Wish deleted successfully !",
    data: result,
  });
});

export const WishsController = {
  insertIntoDB,
  getAllFromDB,
  deleteByIdFromDB,

};
