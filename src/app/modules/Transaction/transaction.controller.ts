import { Request, Response } from "express";
import { Transactionservice } from "./transaction.service";
import catchAsync from "../../shared/catchAsync";
import sendReponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { ITransaction } from "./transaction.interface";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;
  const result = await Transactionservice.sentMoneyInsertIntoDB(
    payload.userId,
    payload.receiverId,
    payload.amount
  );
  sendReponse<ITransaction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sent Money successfully!",
    data: result,
  });
});
const transactionIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.headers.id;
  const result = await Transactionservice.transactionIntoDB(user);
  sendReponse<object | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "transactionList retrieved successfully!",
    data: result,
  });
});
const balanceIntoDB = catchAsync(async (req: Request, res: Response) => {
  const user = req.headers.id;
  const token = req.headers.token;
  console.log(`balanceIntoDB `, token);
  const result = await Transactionservice.balanceIntoDB(user , token);
  sendReponse<object | null>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Balance successfully!",
    data: result,
  });
});

const cashOutIntoDB = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const user = req.headers.id;
  payload.userId = user;
  console.log(payload);
  const result = await Transactionservice.cashOutIntoDB(
    payload.userId,
    payload.receiverId,
    payload.amount
  );
  sendReponse<ITransaction>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Sent Money successfully!",
    data: result,
  });
});
const cashinAgentInsertIntoDB = catchAsync(
  async (req: Request, res: Response) => {
    const payload = req.body;
    const user = req.headers.id;
    payload.userId = user;
    console.log(payload);
    const result = await Transactionservice.cashinAgentInsertIntoDB(
      payload.userId,
      payload.receiverId,
      payload.amount
    );
    sendReponse<ITransaction>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Cash IN  Agent successfully!",
      data: result,
    });
  }
);

export const TransactionController = {
  insertIntoDB,
  cashOutIntoDB,
  cashinAgentInsertIntoDB,
  balanceIntoDB,
  transactionIntoDB,
};
