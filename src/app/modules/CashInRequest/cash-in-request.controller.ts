import { Request, Response } from "express";
import { CaseInRequestService } from "./cash-in-request.service";
import catchAsync from "../../shared/catchAsync";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { ICaseInRequest } from "./cash-in-request.interface";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;
  console.log(payload);
  const result = await CaseInRequestService.insertIntoDB(payload);
  sendReponse<ICaseInRequest>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CaseIn Request successfully!",
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const admin = req.headers.id;
  const result = await CaseInRequestService.updateIntoDB(id, admin, payload);
  sendReponse<ICaseInRequest>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Status Updated successfully!",
    data: result,
  });
});
const getAllIntoDB = catchAsync(async (req: Request, res: Response) => {
  const adminID = req.headers.id as any;
  const result = await CaseInRequestService.getAllIntoDB(adminID);
  sendReponse<ICaseInRequest[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CaseInRequest Retrived successfully!",
    data: result,
  });
});
const getAllWithUserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const agent = req.headers.id as any;
  const result = await CaseInRequestService.getAllWithUserIntoDB(agent);
  sendReponse<ICaseInRequest[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CaseInRequest Retrived successfully!",
    data: result,
  });
});
export const CashInRequestController = {
  insertIntoDB,
  updateIntoDB,
  getAllWithUserIntoDB,
  getAllIntoDB,
};
