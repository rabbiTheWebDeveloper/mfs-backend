import { Request, Response } from "express";
import { Withdrawservice } from "./withdraw.service";
import catchAsync from "../../shared/catchAsync";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IWithdraw } from "./withdraw.interface";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;
  console.log(payload);
  const result = await Withdrawservice.insertIntoDB(payload);
  sendReponse<IWithdraw>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Withdraw Request successfully!",
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const admin = req.headers.id;
  const result = await Withdrawservice.updateIntoDB(id, admin, payload);
  sendReponse<IWithdraw>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status Updated successfully!",
    data: result,
  });
});
const getAllIntoDB = catchAsync(async (req: Request, res: Response) => {
  const adminID = req.headers.id as any;
  const result = await Withdrawservice.getAllIntoDB(adminID);
  sendReponse<IWithdraw[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Retrived successfully!",
    data: result,
  });
});
const getAllWithUserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const agent = req.headers.id as any;
  const result = await Withdrawservice.getAllWithUserIntoDB(agent);
  sendReponse<IWithdraw[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent Retrived successfully!",
    data: result,
  });
});
export const WithdrawController = {
  insertIntoDB,
  updateIntoDB,
  getAllWithUserIntoDB,
  getAllIntoDB,
};
