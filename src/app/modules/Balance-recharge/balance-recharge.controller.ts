import { Request, Response } from "express";
import { BalanceRechargeservice } from "./balance-recharge.service";
import catchAsync from "../../shared/catchAsync";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { IBalanceRecharge } from "./balance-recharge.interface";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;
  const result = await BalanceRechargeservice.insertIntoDB(payload);
  sendReponse<IBalanceRecharge>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Balance Recharge Request successfully!",
    data: result,
  });
});
const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload = req.body;
  const admin = req.headers.id;
  const result = await BalanceRechargeservice.updateIntoDB(id, admin, payload);
  sendReponse<IBalanceRecharge>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Balance Recharge Request successfully!",
    data: result,
  });
});
const getAllIntoDB = catchAsync(async (req: Request, res: Response) => {
  const adminID = req.headers.id as any;
  const result = await BalanceRechargeservice.getAllIntoDB(adminID);
  sendReponse<IBalanceRecharge[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Retrived successfully!",
    data: result,
  });
});
const getAllWithUserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const agent = req.headers.id as any;
  const result = await BalanceRechargeservice.getAllWithUserIntoDB(agent);
  sendReponse<IBalanceRecharge[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Agent Retrived successfully!",
    data: result,
  });
});
export const BalanceRechargeController = {
  insertIntoDB,
  updateIntoDB,
  getAllWithUserIntoDB,
  getAllIntoDB,
};
